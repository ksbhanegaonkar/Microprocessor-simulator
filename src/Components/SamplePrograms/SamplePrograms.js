import React, { useState } from 'react';

/* ────────────────────────────────────────────────────
   Standard SAP-1 ROM Microcode
   Builds a 1024-entry ROM supporting: LDA, ADD, SUB, OUT, HLT
   ──────────────────────────────────────────────────── */
const CO = 16384, CE = 8192, AI = 2048, AO = 1024;
const BI = 512, AcO = 128, SA = 64, OE = 32;
const RAI = 16, RO = 8, II = 4, IO = 2, HLT = 1;

const buildStandardROM = () => {
  const rom = new Array(1024).fill(0);
  /* Flags: CF (bit7 = +128), ZF (bit8 = +256) — for basic SAP-1
     these don't change the microcode, so we duplicate across flag combos */
  for (const foff of [0, 128, 256, 384]) {
    /* T0 + T1: Fetch cycle — same for ALL opcodes */
    for (let op = 0; op < 16; op++) {
      rom[foff + op + 0 * 16] = CO | RAI;       // T0: PC → Bus → MAR
      rom[foff + op + 1 * 16] = CE | RO | II;   // T1: RAM → Bus → IR, PC++
    }
    /* LDA (opcode 1) */
    rom[foff + 1 + 2 * 16] = IO | RAI;          // T2: IR[3:0] → Bus → MAR
    rom[foff + 1 + 3 * 16] = AI | RO;           // T3: RAM → Bus → A
    /* ADD (opcode 2) */
    rom[foff + 2 + 2 * 16] = IO | RAI;          // T2: IR[3:0] → Bus → MAR
    rom[foff + 2 + 3 * 16] = BI | RO;           // T3: RAM → Bus → B
    rom[foff + 2 + 4 * 16] = AI | AcO;          // T4: ALU(A+B) → Bus → A
    /* SUB (opcode 3) */
    rom[foff + 3 + 2 * 16] = IO | RAI;          // T2: IR[3:0] → Bus → MAR
    rom[foff + 3 + 3 * 16] = BI | SA | RO;      // T3: RAM → Bus → B, set SUB
    rom[foff + 3 + 4 * 16] = AI | AcO | SA;     // T4: ALU(A−B) → Bus → A
    /* OUT (opcode 14) */
    rom[foff + 14 + 2 * 16] = AO | OE;          // T2: A → Bus → Display
    /* HLT (opcode 15) */
    rom[foff + 15 + 2 * 16] = HLT;              // T2: Halt
  }
  return rom;
};

const STANDARD_ROM = buildStandardROM();

/* ────────────────────────────────────────────────────
   Sample Programs — RAM data + descriptions
   Format: 8-bit values, 16 entries (addresses 0-15)
   Instruction encoding: [opcode(4bit)][operand(4bit)]
     LDA=0001, ADD=0010, SUB=0011, OUT=1110, HLT=1111
   ──────────────────────────────────────────────────── */
const SAMPLE_PROGRAMS = [
  {
    id: 'add2',
    name: 'Add Two Numbers',
    description: 'Adds 28 + 14 = 42. The simplest program: load a number, add another, display the result.',
    assembly: [
      { addr: 0, code: 'LDA 14', comment: 'Load 28 from RAM[14] into Register A' },
      { addr: 1, code: 'ADD 15', comment: 'Add 14 from RAM[15] → A = 28+14 = 42' },
      { addr: 2, code: 'OUT',    comment: 'Display Register A (42) on output' },
      { addr: 3, code: 'HLT',    comment: 'Stop the CPU' },
      { addr: 14, code: '28',    comment: 'Data: first number' },
      { addr: 15, code: '14',    comment: 'Data: second number' },
    ],
    /* LDA 14 = 0001_1110 = 30, ADD 15 = 0010_1111 = 47, OUT = 1110_0000 = 224, HLT = 1111_0000 = 240 */
    ram: [30, 47, 224, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 14],
    expectedResult: '42',
  },
  {
    id: 'sub2',
    name: 'Subtract Two Numbers',
    description: 'Computes 50 − 20 = 30. Demonstrates the SUB instruction and the ALU subtract mode.',
    assembly: [
      { addr: 0, code: 'LDA 14', comment: 'Load 50 from RAM[14] into A' },
      { addr: 1, code: 'SUB 15', comment: 'Subtract 20 from RAM[15] → A = 50−20 = 30' },
      { addr: 2, code: 'OUT',    comment: 'Display result (30)' },
      { addr: 3, code: 'HLT',    comment: 'Stop' },
      { addr: 14, code: '50',    comment: 'Data: first number' },
      { addr: 15, code: '20',    comment: 'Data: second number' },
    ],
    ram: [30, 63, 224, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 20],
    expectedResult: '30',
  },
  {
    id: 'add3',
    name: 'Add Three Numbers',
    description: 'Adds 10 + 20 + 30 = 60. Shows how multiple ADD instructions chain together.',
    assembly: [
      { addr: 0,  code: 'LDA 12', comment: 'Load 10 from RAM[12]' },
      { addr: 1,  code: 'ADD 13', comment: 'Add 20 → A = 30' },
      { addr: 2,  code: 'ADD 14', comment: 'Add 30 → A = 60' },
      { addr: 3,  code: 'OUT',    comment: 'Display 60' },
      { addr: 4,  code: 'HLT',    comment: 'Stop' },
      { addr: 12, code: '10',     comment: 'Data: first number' },
      { addr: 13, code: '20',     comment: 'Data: second number' },
      { addr: 14, code: '30',     comment: 'Data: third number' },
    ],
    /* LDA 12=0001_1100=28, ADD 13=0010_1101=45, ADD 14=0010_1110=46 */
    ram: [28, 45, 46, 224, 240, 0, 0, 0, 0, 0, 0, 0, 10, 20, 30, 0],
    expectedResult: '60',
  },
  {
    id: 'addSub',
    name: 'Add Then Subtract',
    description: 'Computes (15 + 25) − 10 = 30. Demonstrates mixing ADD and SUB operations.',
    assembly: [
      { addr: 0,  code: 'LDA 12', comment: 'Load 15' },
      { addr: 1,  code: 'ADD 13', comment: 'Add 25 → A = 40' },
      { addr: 2,  code: 'SUB 14', comment: 'Subtract 10 → A = 30' },
      { addr: 3,  code: 'OUT',    comment: 'Display 30' },
      { addr: 4,  code: 'HLT',    comment: 'Stop' },
      { addr: 12, code: '15',     comment: 'Data' },
      { addr: 13, code: '25',     comment: 'Data' },
      { addr: 14, code: '10',     comment: 'Data' },
    ],
    /* LDA 12=28, ADD 13=45, SUB 14=0011_1110=62 */
    ram: [28, 45, 62, 224, 240, 0, 0, 0, 0, 0, 0, 0, 15, 25, 10, 0],
    expectedResult: '30',
  },
  {
    id: 'loadOut',
    name: 'Load & Display',
    description: 'The simplest possible program — just loads a value and displays it. Great for understanding the fetch cycle.',
    assembly: [
      { addr: 0,  code: 'LDA 15', comment: 'Load 42 from RAM[15]' },
      { addr: 1,  code: 'OUT',    comment: 'Display 42' },
      { addr: 2,  code: 'HLT',    comment: 'Stop' },
      { addr: 15, code: '42',     comment: 'Data: the answer' },
    ],
    /* LDA 15 = 0001_1111 = 31 */
    ram: [31, 224, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42],
    expectedResult: '42',
  },
];

const SamplePrograms = ({ onLoadProgram }) => {
  const [selected, setSelected] = useState(null);
  const [loaded, setLoaded] = useState(null);

  const program = SAMPLE_PROGRAMS.find(p => p.id === selected);

  const handleLoad = () => {
    if (!program) return;
    onLoadProgram(program.ram, STANDARD_ROM);
    setLoaded(program.id);
    setTimeout(() => setLoaded(null), 2000);
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex align-items-center justify-content-between py-2">
        <span style={{ fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--accent)', marginRight: 6 }}>▸</span>
          Sample Programs
        </span>
        <span className="text-muted" style={{ fontSize: '0.65rem' }}>
          Quick-load educational programs with pre-programmed ROM microcode
        </span>
      </div>
      <div className="card-body p-3">
        {/* Program selector buttons */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {SAMPLE_PROGRAMS.map(prog => (
            <button key={prog.id}
              className={`btn btn-sm ${selected === prog.id ? 'btn-info' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '4px 12px' }}
              onClick={() => setSelected(prog.id)}
            >
              {prog.name}
            </button>
          ))}
        </div>

        {/* Selected program details */}
        {program && (
          <div className="row g-3">
            {/* Description */}
            <div className="col-md-5">
              <div className="p-2 rounded h-100" style={{ background: '#0d111799', border: '1px solid var(--border)' }}>
                <div className="mb-2" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
                  {program.name}
                </div>
                <div className="mb-2" style={{ fontSize: '0.75rem', color: '#c9d1d9', lineHeight: 1.5 }}>
                  {program.description}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>Expected output:</span>
                  <span className="badge bg-success" style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.8rem' }}>
                    {program.expectedResult}
                  </span>
                </div>
              </div>
            </div>

            {/* Assembly listing */}
            <div className="col-md-5">
              <div className="p-2 rounded h-100" style={{ background: '#0d111799', border: '1px solid var(--border)' }}>
                <div className="mb-1 text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Assembly Listing
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', lineHeight: 1.7 }}>
                  {program.assembly.map(line => (
                    <div key={line.addr} className="d-flex gap-2">
                      <span style={{ color: '#8b949e', minWidth: 24, textAlign: 'right' }}>{line.addr}:</span>
                      <span style={{ color: '#79c0ff', minWidth: 60, fontWeight: 600 }}>{line.code}</span>
                      <span style={{ color: '#484f58' }}>; {line.comment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Load button */}
            <div className="col-md-2 d-flex align-items-center justify-content-center">
              <button
                className={`btn ${loaded === program.id ? 'btn-success' : 'btn-info'} btn-sm`}
                style={{ fontSize: '0.8rem', padding: '8px 20px', fontWeight: 600 }}
                onClick={handleLoad}
              >
                {loaded === program.id ? '✓ Loaded!' : '⬇ Load Program'}
              </button>
            </div>
          </div>
        )}

        {!program && (
          <div className="text-center text-muted py-2" style={{ fontSize: '0.8rem' }}>
            Select a program above to see its description and assembly code
          </div>
        )}
      </div>
    </div>
  );
};

export default SamplePrograms;
