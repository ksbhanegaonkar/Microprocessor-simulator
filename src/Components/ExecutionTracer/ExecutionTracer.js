import React, { useState } from 'react';

/* ── Opcode lookup ── */
const OPCODES = {
  0: { mnemonic: 'NOP', name: 'No Operation', desc: 'Does nothing — CPU idles for this instruction cycle' },
  1: { mnemonic: 'LDA', name: 'Load A', desc: 'Load value from RAM address into Register A', hasOperand: true },
  2: { mnemonic: 'ADD', name: 'Add', desc: 'Add value at RAM address to Register A (A = A + RAM[addr])', hasOperand: true },
  3: { mnemonic: 'SUB', name: 'Subtract', desc: 'Subtract value at RAM address from Register A (A = A − RAM[addr])', hasOperand: true },
  14: { mnemonic: 'OUT', name: 'Output', desc: 'Copy Register A value to the Output Display' },
  15: { mnemonic: 'HLT', name: 'Halt', desc: 'Stop the CPU clock — execution ends' },
};
const unknownOp = { mnemonic: '???', name: 'Unknown', desc: 'Undefined opcode — no microcode programmed' };

/* ── Signal human-readable descriptions ── */
const signalInfo = (s, st) => {
  const bus = st.dataOnBus;
  const map = {
    CO:  { label: 'Counter Out',     detail: `Program Counter (${st.currentCounterValue}) → Bus`, type: 'send', color: '#58a6ff' },
    CE:  { label: 'Counter Enable',  detail: 'Program Counter increments on next rising edge', type: 'config', color: '#8b949e' },
    JP:  { label: 'Jump',            detail: `Bus (${bus & 0xF}) → Program Counter`, type: 'recv', color: '#d2a8ff' },
    AI:  { label: 'A Register In',   detail: `Bus (${bus}) → Register A`, type: 'recv', color: '#79c0ff' },
    AO:  { label: 'A Register Out',  detail: `Register A (${st.registorAvalue}) → Bus`, type: 'send', color: '#58a6ff' },
    BI:  { label: 'B Register In',   detail: `Bus (${bus}) → Register B`, type: 'recv', color: '#79c0ff' },
    BO:  { label: 'B Register Out',  detail: `Register B (${st.registorBvalue}) → Bus`, type: 'send', color: '#58a6ff' },
    AcO: { label: 'Accumulator Out', detail: `ALU Result (${st.accumulatorValue}) → Bus`, type: 'send', color: '#3fb950' },
    'S/A':{ label: 'Subtract Mode',  detail: 'ALU set to SUBTRACT (A − B)', type: 'config', color: '#f0883e' },
    OE:  { label: 'Output Enable',   detail: `Bus (${bus}) → Output Display`, type: 'recv', color: '#79c0ff' },
    RAI: { label: 'RAM Addr In',     detail: `Bus lower 4 bits (${bus & 0xF}) → RAM Address Register`, type: 'recv', color: '#79c0ff' },
    RO:  { label: 'RAM Data Out',    detail: `RAM[${st.ramAddress}] (${st.ramData[st.ramAddress]}) → Bus`, type: 'send', color: '#58a6ff' },
    II:  { label: 'IR In',           detail: `Bus (${bus}) → Instruction Register`, type: 'recv', color: '#79c0ff' },
    IO:  { label: 'IR Out',          detail: `IR lower 4 bits (${st.instructionRegisterValue & 0xF}) → Bus`, type: 'send', color: '#58a6ff' },
    HLT: { label: 'Halt',            detail: 'CPU clock stopped — execution complete', type: 'halt', color: '#f85149' },
  };
  return map[s] || { label: s, detail: '', type: 'config', color: '#8b949e' };
};

/* ── Control signal names in order ── */
const SIGNAL_NAMES = ['CO','CE','JP','AI','AO','BI','BO','AcO','S/A','OE','RAI','RO','II','IO','HLT'];

const ExecutionTracer = ({ state }) => {
  const [activeTab, setActiveTab] = useState('monitor');

  const opcode = (state.instructionRegisterValue >> 4) & 0xF;
  const operand = state.instructionRegisterValue & 0xF;
  const info = OPCODES[opcode] || unknownOp;
  const tState = state.tStateCounterValue;
  const clockHigh = state.CurrentClockState === 1;

  /* Phase determination */
  const phase = tState <= 1 ? 'Fetch' : tState === 2 ? 'Decode' : 'Execute';
  const phaseColors = { Fetch: '#58a6ff', Decode: '#d2a8ff', Execute: '#3fb950' };

  /* Active control signals */
  const signalValues = [
    state.counterOutputEnable, state.isCounterEnable, state.jumpEnable,
    state.registorAInputEnable, state.registorAOutputEnable,
    state.registorBInputEnable, state.registorBOutputEnable,
    state.accumulatorOutputEnable, state.addSubtractFlag,
    state.outputDisplayInputEnable, state.ramAddressInputEnable,
    state.ramDataOutputEnable, state.instructionRegisterInputEnable,
    state.instructionRegisterOutputEnable, state.isHalt
  ];
  const activeSignals = SIGNAL_NAMES.filter((_, i) => signalValues[i] === 1);

  /* Data flow arrow */
  const buildDataFlow = () => {
    const senders = [];
    const receivers = [];
    if (state.counterOutputEnable) senders.push(`PC(${state.currentCounterValue})`);
    if (state.registorAOutputEnable) senders.push(`RegA(${state.registorAvalue})`);
    if (state.registorBOutputEnable) senders.push(`RegB(${state.registorBvalue})`);
    if (state.accumulatorOutputEnable) senders.push(`ALU(${state.accumulatorValue})`);
    if (state.ramDataOutputEnable) senders.push(`RAM[${state.ramAddress}](${state.ramData[state.ramAddress]})`);
    if (state.instructionRegisterOutputEnable) senders.push(`IR₄(${state.instructionRegisterValue & 0xF})`);
    if (state.externalInputBusBuffer) senders.push(`ExtIn(${state.externalInputValue})`);

    if (state.registorAInputEnable) receivers.push('RegA');
    if (state.registorBInputEnable) receivers.push('RegB');
    if (state.instructionRegisterInputEnable) receivers.push('IR');
    if (state.outputDisplayInputEnable) receivers.push('Display');
    if (state.ramAddressInputEnable) receivers.push('MAR');
    if (state.jumpEnable) receivers.push('PC(Jump)');

    if (senders.length === 0 && receivers.length === 0) return null;
    return { senders, receivers, busVal: state.dataOnBus };
  };

  const dataFlow = buildDataFlow();

  /* ── Render: Monitor Tab ── */
  const renderMonitor = () => (
    <div>
      {/* Phase + T-state pipeline */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', minWidth: 55 }}>Phase</span>
          <div className="d-flex gap-1 flex-grow-1">
            {['Fetch', 'Decode', 'Execute'].map(p => (
              <div key={p} style={{
                flex: 1, textAlign: 'center', padding: '4px 0',
                borderRadius: 4, fontSize: '0.75rem', fontWeight: 600,
                background: phase === p ? phaseColors[p] + '22' : 'transparent',
                color: phase === p ? phaseColors[p] : '#484f58',
                border: `1px solid ${phase === p ? phaseColors[p] + '55' : '#30363d'}`,
                transition: 'all 0.3s'
              }}>{p}</div>
            ))}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', minWidth: 55 }}>T-State</span>
          <div className="d-flex gap-1 flex-grow-1">
            {[0,1,2,3,4,5].map(t => (
              <div key={t} style={{
                flex: 1, textAlign: 'center', padding: '3px 0',
                borderRadius: 4, fontSize: '0.7rem', fontWeight: 700,
                background: tState === t ? '#58a6ff' : 'transparent',
                color: tState === t ? '#fff' : '#484f58',
                border: `1px solid ${tState === t ? '#58a6ff' : '#30363d'}`,
                transition: 'all 0.3s'
              }}>T{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Clock indicator */}
      <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: '0.8rem' }}>
        <span style={{
          display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
          background: clockHigh ? 'var(--led-on)' : 'var(--led-off)',
          boxShadow: clockHigh ? '0 0 8px var(--led-on)' : 'none',
        }}/>
        <span style={{ color: clockHigh ? 'var(--led-on)' : '#8b949e' }}>
          Clock: {clockHigh ? 'HIGH ↑' : 'LOW ↓'}
        </span>
        {state.isHalt === 1 && (
          <span className="badge bg-danger ms-auto" style={{ fontSize: '0.7rem' }}>HALTED</span>
        )}
      </div>

      {/* Data flow arrow */}
      {dataFlow && (
        <div className="mb-3 p-2 rounded" style={{ background: '#0d111799', border: '1px solid var(--border)' }}>
          <div className="text-muted mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Data Flow</div>
          <div className="d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.8rem' }}>
            {dataFlow.senders.length > 0 && (
              <span style={{ color: '#3fb950', fontWeight: 600 }}>{dataFlow.senders.join(', ')}</span>
            )}
            {dataFlow.senders.length > 0 && dataFlow.receivers.length > 0 && (
              <>
                <span style={{ color: '#58a6ff' }}>→</span>
                <span className="badge" style={{ background: '#161b22', border: '1px solid #58a6ff', color: '#58a6ff', fontFamily: 'monospace' }}>
                  BUS={dataFlow.busVal}
                </span>
                <span style={{ color: '#58a6ff' }}>→</span>
              </>
            )}
            {dataFlow.receivers.length > 0 && (
              <span style={{ color: '#79c0ff', fontWeight: 600 }}>{dataFlow.receivers.join(', ')}</span>
            )}
          </div>
        </div>
      )}

      {/* Active control signals */}
      <div>
        <div className="text-muted mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Active Control Signals</div>
        {activeSignals.length === 0 ? (
          <div className="text-muted" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>No signals active</div>
        ) : (
          <div className="d-flex flex-column gap-1">
            {activeSignals.map(sig => {
              const info = signalInfo(sig, state);
              return (
                <div key={sig} className="d-flex align-items-center gap-2" style={{ fontSize: '0.75rem' }}>
                  <span className="badge" style={{
                    background: info.color + '22', color: info.color,
                    border: `1px solid ${info.color}44`, minWidth: 36, fontWeight: 700,
                  }}>{sig}</span>
                  <span style={{ color: '#c9d1d9' }}>{info.detail}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  /* ── Render: Instruction Decoder Tab ── */
  const renderDecoder = () => {
    const irBin = (state.instructionRegisterValue >>> 0).toString(2).padStart(8, '0');
    return (
      <div>
        {/* Binary breakdown */}
        <div className="text-center mb-3">
          <div className="text-muted mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Instruction Register Breakdown</div>
          <div className="d-flex justify-content-center gap-0" style={{ fontFamily: 'monospace' }}>
            {irBin.split('').map((bit, i) => (
              <div key={i} style={{
                width: 30, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < 4 ? '#d2a8ff18' : '#3fb95018',
                border: '1px solid ' + (i < 4 ? '#d2a8ff44' : '#3fb95044'),
                color: i < 4 ? '#d2a8ff' : '#3fb950',
                fontSize: '1rem', fontWeight: 700,
                borderRadius: i === 0 ? '6px 0 0 6px' : i === 7 ? '0 6px 6px 0' : 0,
              }}>{bit}</div>
            ))}
          </div>
          <div className="d-flex justify-content-center mt-1">
            <span style={{ width: 120, textAlign: 'center', fontSize: '0.65rem', color: '#d2a8ff' }}>Opcode ({info.mnemonic})</span>
            <span style={{ width: 120, textAlign: 'center', fontSize: '0.65rem', color: '#3fb950' }}>
              {info.hasOperand ? `Operand (${operand})` : 'Unused'}
            </span>
          </div>
        </div>

        {/* Decoded instruction */}
        <div className="p-2 rounded mb-3" style={{ background: '#0d111799', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: 1 }}>
            {info.mnemonic}{info.hasOperand ? ` ${operand}` : ''}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8b949e', marginTop: 4 }}>{info.desc}</div>
        </div>

        {/* Execution timeline */}
        <div>
          <div className="text-muted mb-2" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Instruction Cycle Timeline</div>
          {renderTimeline(opcode, operand, tState)}
        </div>
      </div>
    );
  };

  /* ── Instruction cycle timeline ── */
  const renderTimeline = (op, addr, currentT) => {
    const common = [
      { t: 0, label: 'Fetch', desc: 'PC → Bus → MAR (set RAM address)' },
      { t: 1, label: 'Fetch', desc: 'RAM → Bus → IR, PC+1 (load instruction)' },
    ];
    const specific = {
      1: [
        { t: 2, label: 'Decode', desc: `IR operand (${addr}) → Bus → MAR` },
        { t: 3, label: 'Execute', desc: `RAM[${addr}] → Bus → Register A` },
      ],
      2: [
        { t: 2, label: 'Decode', desc: `IR operand (${addr}) → Bus → MAR` },
        { t: 3, label: 'Execute', desc: `RAM[${addr}] → Bus → Register B` },
        { t: 4, label: 'Execute', desc: 'ALU (A+B) → Bus → Register A' },
      ],
      3: [
        { t: 2, label: 'Decode', desc: `IR operand (${addr}) → Bus → MAR` },
        { t: 3, label: 'Execute', desc: `RAM[${addr}] → Bus → Register B, set SUB` },
        { t: 4, label: 'Execute', desc: 'ALU (A−B) → Bus → Register A' },
      ],
      14: [
        { t: 2, label: 'Execute', desc: 'Register A → Bus → Output Display' },
      ],
      15: [
        { t: 2, label: 'Execute', desc: 'HALT signal — CPU stops' },
      ],
    };
    const steps = [...common, ...(specific[op] || [{ t: 2, label: 'Execute', desc: 'No operation defined' }])];
    return (
      <div className="d-flex flex-column gap-1">
        {steps.map(step => {
          const isCurrent = step.t === currentT;
          const isDone = step.t < currentT;
          return (
            <div key={step.t} className="d-flex align-items-center gap-2" style={{
              fontSize: '0.75rem', padding: '3px 6px', borderRadius: 4,
              background: isCurrent ? '#58a6ff15' : 'transparent',
              border: isCurrent ? '1px solid #58a6ff33' : '1px solid transparent',
              opacity: isDone ? 0.5 : 1,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700,
                background: isCurrent ? '#58a6ff' : isDone ? '#3fb950' : '#21262d',
                color: isCurrent || isDone ? '#fff' : '#8b949e',
              }}>
                {isDone ? '✓' : `T${step.t}`}
              </span>
              <span style={{ color: isDone ? '#8b949e' : '#c9d1d9' }}>{step.desc}</span>
            </div>
          );
        })}
      </div>
    );
  };

  /* ── Render: Reference Tab ── */
  const renderReference = () => (
    <div style={{ fontSize: '0.75rem' }}>
      {/* Instruction set */}
      <div className="mb-3">
        <div className="text-muted mb-2" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Instruction Set (5 Instructions)</div>
        <table className="table table-sm table-borderless mb-0" style={{ fontSize: '0.75rem' }}>
          <thead>
            <tr style={{ color: '#8b949e', borderBottom: '1px solid var(--border)' }}>
              <th style={{ width: 50 }}>Code</th><th style={{ width: 55 }}>Binary</th><th>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['LDA a', '0001', 'A = RAM[a]  — Load RAM value into Register A'],
              ['ADD a', '0010', 'A = A + RAM[a]  — Add RAM value to A'],
              ['SUB a', '0011', 'A = A − RAM[a]  — Subtract RAM value from A'],
              ['OUT', '1110', 'Display = A  — Show Register A on output'],
              ['HLT', '1111', 'Stop  — Halt the CPU clock'],
            ].map(([mnem, bin, desc]) => (
              <tr key={mnem}>
                <td style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: 'monospace' }}>{mnem}</td>
                <td style={{ fontFamily: 'monospace', color: '#d2a8ff' }}>{bin}</td>
                <td style={{ color: '#c9d1d9' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Control signals */}
      <div className="mb-3">
        <div className="text-muted mb-2" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Control Signals (15-bit Control Word)</div>
        <div className="row g-1">
          {[
            ['CO', 'Counter Out', 'PC value → Bus'],
            ['CE', 'Counter Enable', 'PC increments on ↑'],
            ['JP', 'Jump', 'Bus → PC (branch)'],
            ['AI', 'A In', 'Bus → Register A'],
            ['AO', 'A Out', 'Register A → Bus'],
            ['BI', 'B In', 'Bus → Register B'],
            ['BO', 'B Out', 'Register B → Bus'],
            ['AcO', 'ALU Out', 'ALU result → Bus'],
            ['S/A', 'Sub/Add', '0=Add, 1=Sub'],
            ['OE', 'Out Enable', 'Bus → Display'],
            ['RAI', 'RAM Addr', 'Bus → MAR'],
            ['RO', 'RAM Out', 'RAM[MAR] → Bus'],
            ['II', 'IR In', 'Bus → IR'],
            ['IO', 'IR Out', 'IR[3:0] → Bus'],
            ['HLT', 'Halt', 'Stop CPU'],
          ].map(([sig, name, desc]) => (
            <div key={sig} className="col-6 col-xl-4">
              <div className="d-flex align-items-center gap-1 p-1 rounded" style={{ background: '#0d111744' }}>
                <span className="badge" style={{
                  background: '#21262d', color: 'var(--accent)', border: '1px solid var(--border)',
                  fontFamily: 'monospace', fontWeight: 700, minWidth: 30, fontSize: '0.65rem'
                }}>{sig}</span>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#c9d1d9' }}>{name}</div>
                  <div style={{ fontSize: '0.6rem', color: '#8b949e' }}>{desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fetch cycle */}
      <div>
        <div className="text-muted mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Fetch-Decode-Execute Cycle</div>
        <div className="p-2 rounded" style={{ background: '#0d111744', border: '1px solid var(--border)', lineHeight: 1.8 }}>
          <div><strong style={{ color: '#58a6ff' }}>T0:</strong> <code style={{ color: '#3fb950', fontSize: '0.7rem' }}>CO + RAI</code> → PC address placed on bus, loaded into MAR</div>
          <div><strong style={{ color: '#58a6ff' }}>T1:</strong> <code style={{ color: '#3fb950', fontSize: '0.7rem' }}>CE + RO + II</code> → RAM data → bus → IR, PC increments</div>
          <div><strong style={{ color: '#d2a8ff' }}>T2:</strong> Decode — instruction-specific signals begin</div>
          <div><strong style={{ color: '#3fb950' }}>T3–T5:</strong> Execute — varies by instruction</div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { key: 'monitor', label: 'Execution Monitor' },
    { key: 'decoder', label: 'Instruction Decoder' },
    { key: 'reference', label: 'Quick Reference' },
  ];

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between py-2">
        <div className="d-flex gap-1">
          {tabs.map(tab => (
            <button key={tab.key}
              className={`btn btn-sm ${activeTab === tab.key ? 'btn-info' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.7rem', padding: '2px 10px' }}
              onClick={() => setActiveTab(tab.key)}
            >{tab.label}</button>
          ))}
        </div>
        <span style={{ fontSize: '0.65rem', color: '#8b949e' }}>
          SAP-1 Learning Dashboard
        </span>
      </div>
      <div className="card-body p-3" style={{ minHeight: 180 }}>
        {activeTab === 'monitor' && renderMonitor()}
        {activeTab === 'decoder' && renderDecoder()}
        {activeTab === 'reference' && renderReference()}
      </div>
    </div>
  );
};

export default ExecutionTracer;
