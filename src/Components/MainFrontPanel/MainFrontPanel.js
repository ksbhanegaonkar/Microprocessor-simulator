import React, { useState, useRef, useCallback } from 'react';
import EightBitRegistor from './../Register/EightBitRegistor';
import FourBitCounter from './../Counter/FourBitCounter';
import SystemClock from './../SystemClock/SystemClock';
import ExternalInputPort from './../ExternalInputPort/ExternalInputPort';
import Accumulator from './../Accumulator/Accumulator';
import EightBitBus from '../Bus/EightBitBus';
import SixteenByteRAM from '../RAM/SixteenByteRAM';
import SevenSegmentDisplay from '../LedDisplay/SevenSegmentDisplay';
import ControlUnit from '../ControlUnit/ControlUnit';
import ThreeBitCounter from './../Counter/ThreeBitCounter';
import ExecutionTracer from '../ExecutionTracer/ExecutionTracer';
import SamplePrograms from '../SamplePrograms/SamplePrograms';

/* ───── helpers (pure) ───── */
const dec2bin = (dec) => (parseInt(dec, 10).toString(2)).padStart(8, '0');
const dec2binFourBit = (dec) => (parseInt(dec, 10).toString(2)).padStart(4, '0');
const dec2binTenBit = (dec) => (parseInt(dec, 10).toString(2)).padStart(10, '0');
const dec2binFifteenBit = (dec) => (parseInt(dec, 10).toString(2)).padStart(15, '0');

const binaryAnd = (a, b) => {
  const aBin = dec2bin(a);
  const bBin = dec2bin(b);
  let val = 0;
  for (let i = 0; i < 8; i++) {
    val += (aBin[7 - i] * bBin[7 - i]) << i;
  }
  return val;
};

const recalcBus = (busContrib) => {
  let val = 255;
  for (const k in busContrib) val = binaryAnd(val, busContrib[k]);
  return val;
};

const initialRomData = () => { const arr = new Array(1024); arr.fill(0); return arr; };
const initialRomAddrBits = () => { const arr = new Array(10); arr.fill(0); return arr; };

const MainFrontPanel = () => {
  const intervalIdRef = useRef(0);
  const busSignalRef = useRef({});

  const [state, setState] = useState({
    ClockType: 'A',
    CurrentClockState: 0,
    astableClockPeriod: 1000,
    isHalt: 0,
    currentCounterValue: 0,
    isCounterEnable: 0,
    counterOutputEnable: 0,
    jumpEnable: 0,
    externalInputValue: 0,
    externalInputBusBuffer: 0,
    registorAvalue: 0,
    registorAInputEnable: 0,
    registorAOutputEnable: 0,
    registorBvalue: 0,
    registorBInputEnable: 0,
    registorBOutputEnable: 0,
    instructionRegisterValue: 0,
    instructionRegisterInputEnable: 0,
    instructionRegisterOutputEnable: 0,
    accumulatorValue: 0,
    carryValue: 0,
    zeroValue: 0,
    addSubtractFlag: 0,
    accumulatorOutputEnable: 0,
    ramAddress: 0,
    ramData: [30, 47, 224, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 28, 14],
    ramMode: 'Run',
    ramProgramData: 0,
    ramAddressInputEnable: 0,
    ramDataOutputEnable: 0,
    outputDisplayValue: 0,
    outputDisplayInputEnable: 0,
    dataOnBus: 255,
    controlUnitMode: 'AutoControl',
    controlWord: 0,
    romAddress: 0,
    romData: initialRomData(),
    romProgramData: 0,
    romIndividualAddressBits: initialRomAddrBits(),
    tStateCounterValue: 0
  });

  /* ═══════════════════════════════════════════════════════════
     applyControlWordToState — atomic state transform.
     Sets all 15 control signals, updates busSignalRef, and
     recalculates dataOnBus. Returns the new state object.
     ═══════════════════════════════════════════════════════════ */
  const applyControlWordToState = useCallback((prevState, word) => {
    const bw = dec2binFifteenBit(word);
    const ns = { ...prevState };

    ns.counterOutputEnable       = parseInt(bw[0], 10);
    ns.isCounterEnable           = parseInt(bw[1], 10);
    ns.jumpEnable                = parseInt(bw[2], 10);
    ns.registorAInputEnable      = parseInt(bw[3], 10);
    ns.registorAOutputEnable     = parseInt(bw[4], 10);
    ns.registorBInputEnable      = parseInt(bw[5], 10);
    ns.registorBOutputEnable     = parseInt(bw[6], 10);
    ns.accumulatorOutputEnable   = parseInt(bw[7], 10);
    ns.addSubtractFlag           = parseInt(bw[8], 10);
    ns.outputDisplayInputEnable  = parseInt(bw[9], 10);
    ns.ramAddressInputEnable     = parseInt(bw[10], 10);
    ns.ramDataOutputEnable       = parseInt(bw[11], 10);
    ns.instructionRegisterInputEnable  = parseInt(bw[12], 10);
    ns.instructionRegisterOutputEnable = parseInt(bw[13], 10);

    // Update bus contributors for every output-enable signal
    const busOutputs = [
      ['counterOutputEnable',              'currentCounterValue',      ns.currentCounterValue],
      ['registorAOutputEnable',            'registorAvalue',           ns.registorAvalue],
      ['registorBOutputEnable',            'registorBvalue',           ns.registorBvalue],
      ['accumulatorOutputEnable',          'accumulatorValue',         ns.accumulatorValue],
      ['ramDataOutputEnable',              'currentRamDataByte',       ns.ramData[ns.ramAddress]],
      ['instructionRegisterOutputEnable',  'instructionRegisterValue', binaryAnd(ns.instructionRegisterValue, 15)],
    ];
    for (const [field, busKey, busValue] of busOutputs) {
      if (ns[field] === 1) {
        busSignalRef.current[busKey] = busValue;
      } else {
        delete busSignalRef.current[busKey];
      }
    }
    ns.dataOnBus = recalcBus(busSignalRef.current);

    // HLT
    if (parseInt(bw[14], 10) === 1) {
      if (intervalIdRef.current !== 0) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = 0;
      }
      ns.isHalt = 1;
      ns.currentCounterValue = 0;
    }
    return ns;
  }, []);

  /* ───── toggle helpers (used by manual-control mode & component buttons) ───── */
  const toggleCounterOutputEnable = useCallback(() => {
    setState(prev => {
      if (prev.counterOutputEnable === 1) {
        delete busSignalRef.current.currentCounterValue;
      } else {
        busSignalRef.current.currentCounterValue = prev.currentCounterValue;
      }
      const newCO = prev.counterOutputEnable === 1 ? 0 : 1;
      return { ...prev, counterOutputEnable: newCO, dataOnBus: recalcBus(busSignalRef.current) };
    });
  }, []);

  const toggleCountEnable = useCallback(() => {
    setState(prev => ({ ...prev, isCounterEnable: prev.isCounterEnable === 1 ? 0 : 1 }));
  }, []);

  const jump = useCallback(() => {
    setState(prev => ({ ...prev, jumpEnable: prev.jumpEnable === 1 ? 0 : 1 }));
  }, []);

  const toggleRegistorAInputEnableState = useCallback(() => {
    setState(prev => ({ ...prev, registorAInputEnable: prev.registorAInputEnable === 1 ? 0 : 1 }));
  }, []);

  const toggleRegistorAOutputEnableState = useCallback(() => {
    setState(prev => {
      if (prev.registorAOutputEnable === 1) {
        delete busSignalRef.current.registorAvalue;
      } else {
        busSignalRef.current.registorAvalue = prev.registorAvalue;
      }
      const nv = prev.registorAOutputEnable === 1 ? 0 : 1;
      return { ...prev, registorAOutputEnable: nv, dataOnBus: recalcBus(busSignalRef.current) };
    });
  }, []);

  const toggleRegistorBInputEnableState = useCallback(() => {
    setState(prev => ({ ...prev, registorBInputEnable: prev.registorBInputEnable === 1 ? 0 : 1 }));
  }, []);

  const toggleRegistorBOutputEnableState = useCallback(() => {
    setState(prev => {
      if (prev.registorBOutputEnable === 1) {
        delete busSignalRef.current.registorBvalue;
      } else {
        busSignalRef.current.registorBvalue = prev.registorBvalue;
      }
      const nv = prev.registorBOutputEnable === 1 ? 0 : 1;
      return { ...prev, registorBOutputEnable: nv, dataOnBus: recalcBus(busSignalRef.current) };
    });
  }, []);

  const toggleInstructionRegistorInputEnable = useCallback(() => {
    setState(prev => ({ ...prev, instructionRegisterInputEnable: prev.instructionRegisterInputEnable === 1 ? 0 : 1 }));
  }, []);

  const toggleInstructionRegistorOutputEnable = useCallback(() => {
    setState(prev => {
      if (prev.instructionRegisterOutputEnable === 1) {
        delete busSignalRef.current.instructionRegisterValue;
      } else {
        busSignalRef.current.instructionRegisterValue = binaryAnd(prev.instructionRegisterValue, 15);
      }
      const nv = prev.instructionRegisterOutputEnable === 1 ? 0 : 1;
      return { ...prev, instructionRegisterOutputEnable: nv, dataOnBus: recalcBus(busSignalRef.current) };
    });
  }, []);

  const toggleAccumulatorOutputEnable = useCallback(() => {
    setState(prev => {
      if (prev.accumulatorOutputEnable === 1) {
        delete busSignalRef.current.accumulatorValue;
      } else {
        busSignalRef.current.accumulatorValue = prev.accumulatorValue;
      }
      const nv = prev.accumulatorOutputEnable === 1 ? 0 : 1;
      return { ...prev, accumulatorOutputEnable: nv, dataOnBus: recalcBus(busSignalRef.current) };
    });
  }, []);

  const toggleAddSubtractFlag = useCallback(() => {
    setState(prev => ({ ...prev, addSubtractFlag: prev.addSubtractFlag === 1 ? 0 : 1 }));
  }, []);

  const toggleOutputDisplayInputEnable = useCallback(() => {
    setState(prev => ({ ...prev, outputDisplayInputEnable: prev.outputDisplayInputEnable === 1 ? 0 : 1 }));
  }, []);

  const toggleRamAddressInputEnable = useCallback(() => {
    setState(prev => ({ ...prev, ramAddressInputEnable: prev.ramAddressInputEnable === 1 ? 0 : 1 }));
  }, []);

  const toggleRamDataOutputEnable = useCallback(() => {
    setState(prev => {
      if (prev.ramDataOutputEnable === 1) {
        delete busSignalRef.current.currentRamDataByte;
      } else {
        busSignalRef.current.currentRamDataByte = prev.ramData[prev.ramAddress];
      }
      const nv = prev.ramDataOutputEnable === 1 ? 0 : 1;
      return { ...prev, ramDataOutputEnable: nv, dataOnBus: recalcBus(busSignalRef.current) };
    });
  }, []);

  const toggleExternalInputBusBufferState = useCallback(() => {
    setState(prev => {
      if (prev.externalInputBusBuffer === 1) {
        delete busSignalRef.current.externalInputValue;
      } else {
        busSignalRef.current.externalInputValue = prev.externalInputValue;
      }
      const nv = prev.externalInputBusBuffer === 1 ? 0 : 1;
      return { ...prev, externalInputBusBuffer: nv, dataOnBus: recalcBus(busSignalRef.current) };
    });
  }, []);

  /* ───── clock ───── */
  const stopAstableClockPulse = useCallback(() => {
    if (intervalIdRef.current !== 0) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = 0;
      setState(prev => ({ ...prev, isHalt: 1, currentCounterValue: 0 }));
    }
  }, []);

  /* ═══════════════════════════════════════════════════════════
     changeClockState — the heart of the simulation.
     Rising edge (0→1): data moves through registers / bus.
     Falling edge (1→0): T-state advances, control word applied
                          INLINE (not via setTimeout).
     ═══════════════════════════════════════════════════════════ */
  const changeClockState = useCallback(() => {
    setState(prev => {
      let ns;
      if (prev.CurrentClockState === 0) {
        /* ── RISING EDGE ── */
        ns = { ...prev, CurrentClockState: 1 };

        if (ns.isCounterEnable === 1) {
          ns.currentCounterValue = prev.currentCounterValue === 15 ? 0 : prev.currentCounterValue + 1;
        }
        if (ns.registorAInputEnable === 1) ns.registorAvalue = prev.dataOnBus;
        if (ns.registorBInputEnable === 1) ns.registorBvalue = prev.dataOnBus;
        if (ns.instructionRegisterInputEnable === 1) {
          ns.instructionRegisterValue = prev.dataOnBus;
          const bIR = dec2bin(ns.instructionRegisterValue);
          const bT = dec2binFourBit(ns.tStateCounterValue);
          ns.romAddress =
            bIR[3] * 1 + bIR[2] * 2 + bIR[1] * 4 + bIR[0] * 8 +
            bT[3] * 16 + bT[2] * 32 + bT[1] * 64 +
            prev.carryValue * 128 + prev.zeroValue * 256;
        }
        if (ns.outputDisplayInputEnable === 1) ns.outputDisplayValue = prev.dataOnBus;
        if (ns.ramAddressInputEnable === 1) ns.ramAddress = binaryAnd(prev.dataOnBus, 15);
        if (ns.jumpEnable === 1) ns.currentCounterValue = binaryAnd(prev.dataOnBus, 15);

        // Accumulator always computes
        if (ns.addSubtractFlag === 0) {
          const sum = ns.registorAvalue + ns.registorBvalue;
          if (sum > 255) { ns.carryValue = 1; ns.zeroValue = 0; ns.accumulatorValue = sum - 255; }
          else { ns.carryValue = 0; ns.zeroValue = 0; ns.accumulatorValue = sum; }
        } else {
          const diff = ns.registorAvalue - ns.registorBvalue;
          if (diff < 0) { ns.carryValue = 1; ns.zeroValue = 0; ns.accumulatorValue = diff + 255; }
          else if (diff === 0) { ns.carryValue = 0; ns.zeroValue = 1; ns.accumulatorValue = diff; }
          else { ns.carryValue = 0; ns.zeroValue = 0; ns.accumulatorValue = diff; }
        }

        return ns;

      } else {
        /* ── FALLING EDGE ── */
        ns = { ...prev, CurrentClockState: 0 };

        // Advance T-state counter
        let newT = ns.tStateCounterValue === 5 ? 0 : ns.tStateCounterValue + 1;

        // Compute new ROM address from IR opcode + new T-state + flags
        const bIR = dec2bin(ns.instructionRegisterValue);
        const bT = dec2binFourBit(newT);
        ns.romAddress =
          bIR[3] * 1 + bIR[2] * 2 + bIR[1] * 4 + bIR[0] * 8 +
          bT[3] * 16 + bT[2] * 32 + bT[1] * 64 +
          prev.carryValue * 128 + prev.zeroValue * 256;
        ns.tStateCounterValue = newT;

        // In AutoControl, apply the control word for the NEW T-state
        // directly inside this setState (not via setTimeout) so the
        // control signals are set atomically before the next rising edge.
        if (prev.controlUnitMode === 'AutoControl') {
          ns = applyControlWordToState(ns, ns.romData[ns.romAddress]);
        }

        return ns;
      }
    });
  }, [applyControlWordToState]);

  const triggerMonostableClockPulse = useCallback(() => {
    changeClockState();
    setTimeout(changeClockState, 1000);
  }, [changeClockState]);

  const triggerAstableClockPulse = useCallback(() => {
    if (intervalIdRef.current === 0) {
      setState(prev => ({ ...prev, isHalt: 0 }));
      intervalIdRef.current = setInterval(changeClockState, state.astableClockPeriod);
    }
  }, [changeClockState, state.astableClockPeriod]);

  const onAstableClockFrequencyChange = useCallback((event) => {
    const period = parseInt(event.target.value, 10);
    setState(prev => ({ ...prev, astableClockPeriod: period }));
    stopAstableClockPulse();
  }, [stopAstableClockPulse]);

  const onClockModeSelect = useCallback((event) => {
    setState(prev => ({ ...prev, ClockType: event.target.value, CurrentClockState: 0 }));
  }, []);

  /* ───── RAM handlers ───── */
  const onRAMModeSelect = useCallback((e) => setState(prev => ({ ...prev, ramMode: e.target.value })), []);
  const loadRAMDataInput = useCallback((pos, val) => {
    setState(prev => {
      const nv = val === 1 ? prev.ramProgramData + Math.pow(2, pos) : prev.ramProgramData - Math.pow(2, pos);
      return { ...prev, ramProgramData: nv };
    });
  }, []);
  const clearRAMInputData = useCallback(() => setState(prev => ({ ...prev, ramProgramData: 0 })), []);
  const updateRamData = useCallback(() => {
    setState(prev => {
      const nd = [...prev.ramData];
      nd[prev.ramAddress] = prev.ramProgramData;
      return { ...prev, ramData: nd };
    });
  }, []);
  const uploadRAMDataFromFile = useCallback((data) => setState(prev => ({ ...prev, ramData: data })), []);
  const downloadRamData = useCallback(() => {
    setState(prev => ({ ...prev, ramProgramData: prev.ramData[prev.ramAddress] }));
  }, []);
  const loadRAMAddressInput = useCallback((pos, val) => {
    setState(prev => {
      const nv = val === 1 ? prev.ramAddress + Math.pow(2, pos) : prev.ramAddress - Math.pow(2, pos);
      return { ...prev, ramAddress: nv };
    });
  }, []);
  const clearRAMAddressInput = useCallback(() => setState(prev => ({ ...prev, ramAddress: 0 })), []);
  const incrementRAMAddress = useCallback(() => {
    setState(prev => prev.ramAddress < 15 ? { ...prev, ramAddress: prev.ramAddress + 1 } : prev);
  }, []);
  const decrementRAMAddress = useCallback(() => {
    setState(prev => prev.ramAddress > 0 ? { ...prev, ramAddress: prev.ramAddress - 1 } : prev);
  }, []);

  /* ───── External input ───── */
  const loadExtrnalInput = useCallback((pos, val) => {
    setState(prev => {
      const nv = val === 1 ? prev.externalInputValue + Math.pow(2, pos) : prev.externalInputValue - Math.pow(2, pos);
      if (prev.externalInputBusBuffer === 1) {
        busSignalRef.current.externalInputValue = nv;
        return { ...prev, externalInputValue: nv, dataOnBus: recalcBus(busSignalRef.current) };
      }
      return { ...prev, externalInputValue: nv };
    });
  }, []);
  const setExternalInputValue = useCallback((v) => setState(prev => ({ ...prev, externalInputValue: v })), []);
  const resetExternalInputValue = useCallback(() => setState(prev => ({ ...prev, externalInputValue: 0 })), []);

  /* ───── ROM handlers ───── */
  const onControlUnitModeSelect = useCallback((e) => setState(prev => ({ ...prev, controlUnitMode: e.target.value })), []);
  const loadROMDataInput = useCallback((pos, val) => {
    setState(prev => {
      const nv = val === 1 ? prev.romProgramData + Math.pow(2, pos) : prev.romProgramData - Math.pow(2, pos);
      return { ...prev, romProgramData: nv };
    });
  }, []);
  const clearROMInputData = useCallback(() => setState(prev => ({ ...prev, romProgramData: 0 })), []);

  const validateAddress = useCallback((address, userAddr) => {
    const bin = dec2binTenBit(address);
    for (let i = 0; i < 10; i++) {
      if (userAddr[i] !== '*' && bin[i] !== String(userAddr[i])) return false;
    }
    return true;
  }, []);

  const updateRomData = useCallback(() => {
    setState(prev => {
      const nd = [...prev.romData];
      for (let i = 0; i < nd.length; i++) {
        if (validateAddress(i, prev.romIndividualAddressBits)) nd[i] = prev.romProgramData;
      }
      return applyControlWordToState({ ...prev, romData: nd }, nd[0]);
    });
  }, [validateAddress, applyControlWordToState]);

  const uploadROMDataFromFile = useCallback((data) => {
    setState(prev => applyControlWordToState({ ...prev, romData: data }, data[0]));
  }, [applyControlWordToState]);

  const loadROMAddressInput = useCallback((pos, val) => {
    setState(prev => {
      const nb = [...prev.romIndividualAddressBits];
      nb[9 - pos] = val;
      return { ...prev, romIndividualAddressBits: nb };
    });
  }, []);
  const clearROMAddressInput = useCallback(() => {
    setState(prev => ({ ...prev, romIndividualAddressBits: new Array(10).fill(0) }));
  }, []);

  /* ───── manual control ───── */
  const updateManualControlSignal = useCallback((pos) => {
    const fns = {
      '0': toggleCounterOutputEnable, '1': toggleCountEnable, '2': jump,
      '3': toggleRegistorAInputEnableState, '4': toggleRegistorAOutputEnableState,
      '5': toggleRegistorBInputEnableState, '6': toggleRegistorBOutputEnableState,
      '7': toggleAccumulatorOutputEnable, '8': toggleAddSubtractFlag,
      '9': toggleOutputDisplayInputEnable, '10': toggleRamAddressInputEnable,
      '11': toggleRamDataOutputEnable, '12': toggleInstructionRegistorInputEnable,
      '13': toggleInstructionRegistorOutputEnable, '14': stopAstableClockPulse
    };
    if (fns[pos]) fns[pos]();
  }, [toggleCounterOutputEnable, toggleCountEnable, jump, toggleRegistorAInputEnableState,
    toggleRegistorAOutputEnableState, toggleRegistorBInputEnableState, toggleRegistorBOutputEnableState,
    toggleAccumulatorOutputEnable, toggleAddSubtractFlag, toggleOutputDisplayInputEnable,
    toggleRamAddressInputEnable, toggleRamDataOutputEnable, toggleInstructionRegistorInputEnable,
    toggleInstructionRegistorOutputEnable, stopAstableClockPulse]);

  /* ───── counter helpers ───── */
  const enableCounter = useCallback(() => setState(prev => ({ ...prev, isCounterEnable: 1 })), []);
  const dissableCounter = useCallback(() => setState(prev => ({ ...prev, isCounterEnable: 0 })), []);

  /* ───── sample program loader ───── */
  const loadSampleProgram = useCallback((ramData, romData) => {
    /* Stop any running clock, then load both RAM + ROM and apply initial control word */
    if (intervalIdRef.current !== 0) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = 0;
    }
    busSignalRef.current = {};
    setState(prev => {
      const fresh = {
        ...prev,
        CurrentClockState: 0, isHalt: 0,
        currentCounterValue: 0, tStateCounterValue: 0, romAddress: 0,
        registorAvalue: 0, registorBvalue: 0,
        instructionRegisterValue: 0, accumulatorValue: 0,
        carryValue: 0, zeroValue: 0, addSubtractFlag: 0,
        outputDisplayValue: 0, ramAddress: 0, dataOnBus: 255,
        ramData: ramData, romData: romData, ramMode: 'Run',
        controlUnitMode: 'AutoControl',
      };
      return applyControlWordToState(fresh, romData[0]);
    });
  }, [applyControlWordToState]);

  /* ───── CPU reset ───── */
  const resetCPU = useCallback(() => {
    if (intervalIdRef.current !== 0) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = 0;
    }
    busSignalRef.current = {};
    setState(prev => {
      const fresh = {
        ...prev,
        CurrentClockState: 0, isHalt: 0,
        currentCounterValue: 0, tStateCounterValue: 0, romAddress: 0,
        registorAvalue: 0, registorBvalue: 0,
        instructionRegisterValue: 0, accumulatorValue: 0,
        carryValue: 0, zeroValue: 0, addSubtractFlag: 0,
        outputDisplayValue: 0, ramAddress: 0, dataOnBus: 255,
      };
      if (prev.romData[0]) return applyControlWordToState(fresh, prev.romData[0]);
      return fresh;
    });
  }, [applyControlWordToState]);

  /* ───── data flow highlight helpers ───── */
  const hlClass = (...conditions) => {
    const sending = conditions.some(c => c === 'send');
    const receiving = conditions.some(c => c === 'recv');
    if (sending && receiving) return 'data-sending data-receiving';
    if (sending) return 'data-sending';
    if (receiving) return 'data-receiving';
    return '';
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="container-fluid px-3 py-3" style={{ maxWidth: 1400 }}>
      {/* ── Title + subtitle ── */}
      <div className="text-center mb-2">
        <h2 className="mb-0" style={{ color: 'var(--accent, #58a6ff)', letterSpacing: 2, fontWeight: 700 }}>
          Microprocessor Simulator
        </h2>
        <div className="text-muted" style={{ fontSize: '0.75rem', letterSpacing: 1 }}>
          SAP-1 Architecture — 4-Bit Educational Simulator
        </div>
      </div>

      {/* ── Reset button ── */}
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-outline-danger btn-sm" onClick={resetCPU}
          style={{ fontSize: '0.72rem', padding: '3px 14px' }}>
          ↺ Reset CPU
        </button>
      </div>

      {/* ── Sample Programs ── */}
      <SamplePrograms onLoadProgram={loadSampleProgram} />

      <div className="row g-3">
        {/* LEFT COLUMN */}
        <div className="col-lg-4 col-md-5 d-flex flex-column gap-3">
          <SystemClock
            ClockType={state.ClockType} CurrentClockState={state.CurrentClockState}
            onClockModeSelect={onClockModeSelect} changeClockState={changeClockState}
            triggerMonostableClockPulse={triggerMonostableClockPulse}
            triggerAstableClockPulse={triggerAstableClockPulse}
            stopAstableClockPulse={stopAstableClockPulse}
            onAstableClockFrequencyChange={onAstableClockFrequencyChange}
            astableClockPeriod={state.astableClockPeriod}
          />
          <div className={hlClass(state.ramDataOutputEnable ? 'send' : null, state.ramAddressInputEnable ? 'recv' : null)}>
          <SixteenByteRAM
            dec2bin={dec2bin} dec2binFourBit={dec2binFourBit}
            ramData={state.ramData} ramAddress={state.ramAddress}
            loadRAMDataInput={loadRAMDataInput} loadRAMAddressInput={loadRAMAddressInput}
            ramMode={state.ramMode} onRAMModeSelect={onRAMModeSelect}
            updateRamData={updateRamData} ramProgramData={state.ramProgramData}
            clearRAMInputData={clearRAMInputData} clearRAMAddressInput={clearRAMAddressInput}
            incrementRAMAddress={incrementRAMAddress} decrementRAMAddress={decrementRAMAddress}
            downloadRamData={downloadRamData}
            ramAddressInputEnable={state.ramAddressInputEnable}
            ramDataOutputEnable={state.ramDataOutputEnable}
            toggleRamAddressInputEnable={toggleRamAddressInputEnable}
            toggleRamDataOutputEnable={toggleRamDataOutputEnable}
            uploadRAMDataFromFile={uploadRAMDataFromFile}
          />
          </div>
          <div className={hlClass(state.instructionRegisterOutputEnable ? 'send' : null, state.instructionRegisterInputEnable ? 'recv' : null)}>
          <EightBitRegistor
            dec2bin={dec2bin} registorName="Instruction Register"
            registorvalue={state.instructionRegisterValue}
            registorInputEnable={state.instructionRegisterInputEnable}
            registorOutputEnable={state.instructionRegisterOutputEnable}
            toggleRegistorInputEnableState={toggleInstructionRegistorInputEnable}
            toggleRegistorOutputEnableState={toggleInstructionRegistorOutputEnable}
          />
          </div>
          <div className={hlClass(state.externalInputBusBuffer ? 'send' : null)}>
          <ExternalInputPort
            externalInputValue={dec2bin(state.externalInputValue)}
            externalInputIntValue={state.externalInputValue}
            setExternalInputValue={setExternalInputValue}
            loadExtrnalInput={loadExtrnalInput}
            resetExternalInputValue={resetExternalInputValue}
            externalInputBusBuffer={state.externalInputBusBuffer}
            toggleExternalInputBusBufferState={toggleExternalInputBusBufferState}
          />
          </div>
          <ThreeBitCounter currentCounterValue={state.tStateCounterValue} dec2binFourBit={dec2binFourBit} />
        </div>

        {/* CENTER — BUS */}
        <div className={`col-lg-1 col-md-2 d-flex align-items-stretch justify-content-center ${Object.keys(busSignalRef.current).length > 0 ? 'bus-active' : ''}`}>
          <EightBitBus currentValue={state.dataOnBus} dec2bin={dec2bin} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-lg-4 col-md-5 d-flex flex-column gap-3">
          <div className={hlClass(state.counterOutputEnable ? 'send' : null, state.jumpEnable ? 'recv' : null)}>
          <FourBitCounter
            currentCounterValue={state.currentCounterValue}
            isCounterEnable={state.isCounterEnable}
            enableCounter={enableCounter} dissableCounter={dissableCounter}
            dec2binFourBit={dec2binFourBit}
            counterOutputEnable={state.counterOutputEnable}
            toggleCounterOutputEnable={toggleCounterOutputEnable}
            toggleCountEnable={toggleCountEnable}
            jump={jump} jumpEnable={state.jumpEnable}
          />
          </div>
          <div className={hlClass(state.registorAOutputEnable ? 'send' : null, state.registorAInputEnable ? 'recv' : null)}>
          <EightBitRegistor
            dec2bin={dec2bin} registorName="Register A"
            registorvalue={state.registorAvalue}
            registorInputEnable={state.registorAInputEnable}
            registorOutputEnable={state.registorAOutputEnable}
            toggleRegistorInputEnableState={toggleRegistorAInputEnableState}
            toggleRegistorOutputEnableState={toggleRegistorAOutputEnableState}
          />
          </div>
          <div className={hlClass(state.accumulatorOutputEnable ? 'send' : null)}>
          <Accumulator
            dec2bin={dec2bin}
            firstOperandValue={state.registorAvalue} secondOperandValue={state.registorBvalue}
            addSubtractFlag={state.addSubtractFlag}
            accumulatorOutputEnable={state.accumulatorOutputEnable}
            toggleAccumulatorOutputEnable={toggleAccumulatorOutputEnable}
            toggleAddSubtractFlag={toggleAddSubtractFlag}
            carryValue={state.carryValue} zeroValue={state.zeroValue}
            currentValue={state.accumulatorValue}
          />
          </div>
          <div className={hlClass(state.registorBOutputEnable ? 'send' : null, state.registorBInputEnable ? 'recv' : null)}>
          <EightBitRegistor
            dec2bin={dec2bin} registorName="Register B"
            registorvalue={state.registorBvalue}
            registorInputEnable={state.registorBInputEnable}
            registorOutputEnable={state.registorBOutputEnable}
            toggleRegistorInputEnableState={toggleRegistorBInputEnableState}
            toggleRegistorOutputEnableState={toggleRegistorBOutputEnableState}
          />
          </div>
          <div className={hlClass(state.outputDisplayInputEnable ? 'recv' : null)}>
          <SevenSegmentDisplay
            displayValue={state.outputDisplayValue}
            toggleOutputDisplayInputEnable={toggleOutputDisplayInputEnable}
            outputDisplayInputEnable={state.outputDisplayInputEnable}
          />
          </div>
        </div>
      </div>

      {/* ── Learning Dashboard ── */}
      <div className="row g-3 mt-2">
        <div className="col-12">
          <ExecutionTracer state={state} />
        </div>
      </div>

      {/* CONTROL UNIT — full width */}
      <div className="row g-3 mt-2">
        <div className="col-12">
          <ControlUnit
            onControlUnitModeSelect={onControlUnitModeSelect}
            controlUnitMode={state.controlUnitMode}
            updateManualControlSignal={updateManualControlSignal}
            counterOutputEnable={state.counterOutputEnable}
            isCounterEnable={state.isCounterEnable}
            jumpEnable={state.jumpEnable}
            registorAInputEnable={state.registorAInputEnable}
            registorAOutputEnable={state.registorAOutputEnable}
            registorBInputEnable={state.registorBInputEnable}
            registorBOutputEnable={state.registorBOutputEnable}
            addSubtractFlag={state.addSubtractFlag}
            accumulatorOutputEnable={state.accumulatorOutputEnable}
            outputDisplayInputEnable={state.outputDisplayInputEnable}
            ramAddressInputEnable={state.ramAddressInputEnable}
            ramDataOutputEnable={state.ramDataOutputEnable}
            instructionRegisterInputEnable={state.instructionRegisterInputEnable}
            instructionRegisterOutputEnable={state.instructionRegisterOutputEnable}
            stopAstableClockPulse={stopAstableClockPulse}
            isHalt={intervalIdRef.current === 0 ? 1 : 0}
            romAddress={state.romAddress}
            romIndividualAddressBits={state.romIndividualAddressBits}
            romData={state.romData}
            dec2bin={dec2bin}
            dec2binFourBit={dec2binFourBit}
            dec2binTenBit={dec2binTenBit}
            dec2binFifteenBit={dec2binFifteenBit}
            loadROMAddressInput={loadROMAddressInput}
            clearROMAddressInput={clearROMAddressInput}
            loadROMDataInput={loadROMDataInput}
            clearROMInputData={clearROMInputData}
            updateRomData={updateRomData}
            romProgramData={state.romProgramData}
            uploadROMDataFromFile={uploadROMDataFromFile}
          />
        </div>
      </div>

      <footer className="text-center text-muted mt-4 pb-3" style={{ fontSize: '0.8rem' }}>
        Gift to PRMIT&R with love from Kedar Bhanegaonkar &bull; Special thanks to Fuladi Sir, Dhembare Sir and Deshmukh Sir
      </footer>
    </div>
  );
};

export default MainFrontPanel;
