import React, { useCallback } from 'react';
import SingleBitDisplay from './../LedDisplay/SingleBitDisplay';
import Switch from './../Basic/Switch';
import ThreeStateSwitch from './../Basic/ThreeStateSwitch';
import TenBitDisplay from '../LedDisplay/TenBitDisplay';
import ROMFileUpload from '../FileUpload/ROMFileUpload';

const SIGNAL_LABELS = ['CO','CE','JP','AI','AO','BI','BO','AcO','S/A','OE','RAI','RO','II','IO','HLT'];
const ADDR_LABELS = ['-','ZF','CF','t2','t1','t0','IR7','IR6','IR5','IR4'];

const ControlUnit = (props) => {
  const {
    controlUnitMode, onControlUnitModeSelect, updateManualControlSignal,
    counterOutputEnable, isCounterEnable, jumpEnable,
    registorAInputEnable, registorAOutputEnable,
    registorBInputEnable, registorBOutputEnable,
    accumulatorOutputEnable, addSubtractFlag,
    outputDisplayInputEnable, ramAddressInputEnable, ramDataOutputEnable,
    instructionRegisterInputEnable, instructionRegisterOutputEnable,
    stopAstableClockPulse, isHalt,
    romAddress, romIndividualAddressBits, romData,
    dec2binTenBit, dec2binFifteenBit,
    loadROMAddressInput, clearROMAddressInput,
    loadROMDataInput, clearROMInputData,
    updateRomData, romProgramData, uploadROMDataFromFile
  } = props;

  const signalValues = [
    counterOutputEnable, isCounterEnable, jumpEnable,
    registorAInputEnable, registorAOutputEnable,
    registorBInputEnable, registorBOutputEnable,
    accumulatorOutputEnable, addSubtractFlag,
    outputDisplayInputEnable, ramAddressInputEnable, ramDataOutputEnable,
    instructionRegisterInputEnable, instructionRegisterOutputEnable, isHalt
  ];

  const downloadFile = useCallback(() => {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(romData.map(dec2binFifteenBit).join('\r\n')));
    el.setAttribute('download', 'ROM_Bytes.txt');
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }, [romData, dec2binFifteenBit]);

  const renderSignalRow = (values, labels) => (
    <div className="d-flex flex-wrap gap-1 justify-content-center mb-2">
      {labels.map((label, i) => (
        <div key={label} className="text-center" style={{ minWidth: '32px' }}>
          <SingleBitDisplay displayValue={values[i]} />
          <div style={{ fontSize: '0.65rem' }} className="text-muted mt-1">{label}</div>
        </div>
      ))}
    </div>
  );

  const renderManualControl = () => (
    <div className="mt-2">
      {renderSignalRow(signalValues, SIGNAL_LABELS)}
      <div className="d-flex flex-wrap gap-1 justify-content-center">
        {SIGNAL_LABELS.map((label, i) => (
          <div key={label} className="text-center" style={{ minWidth: '32px' }}>
            {i < 14 ? (
              <Switch onClick={updateManualControlSignal} switchState={signalValues[i]} switchPosition={String(i)} />
            ) : (
              <Switch onClick={stopAstableClockPulse} switchState={isHalt} switchPosition="14" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutoControl = () => {
    const binaryRomData = dec2binFifteenBit(romData[romAddress]);
    const binaryRomAddress = dec2binTenBit(romAddress);
    return (
      <div className="mt-2">
        <div className="mb-3">
          <label className="form-label mb-1 fw-semibold" style={{ fontSize: '0.75rem' }}>ROM Output:</label>
          <div className="d-flex flex-wrap gap-1 justify-content-center">
            {SIGNAL_LABELS.map((label, i) => (
              <div key={label} className="text-center" style={{ minWidth: '32px' }}>
                <SingleBitDisplay displayValue={binaryRomData[i]} />
                <div style={{ fontSize: '0.65rem' }} className="text-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="form-label mb-1 fw-semibold" style={{ fontSize: '0.75rem' }}>ROM Address:</label>
          <div className="d-flex flex-wrap gap-1 justify-content-center">
            {ADDR_LABELS.slice(1).map((label, i) => (
              <div key={label} className="text-center" style={{ minWidth: '32px' }}>
                <SingleBitDisplay displayValue={binaryRomAddress[i + 1]} />
                <div style={{ fontSize: '0.65rem' }} className="text-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderInstructionDesign = () => {
    const romDataBin = dec2binFifteenBit(romProgramData);
    return (
      <div className="mt-2">
        <div className="mb-3">
          <label className="form-label mb-1 fw-semibold" style={{ fontSize: '0.75rem' }}>
            Data Input: <span className="text-info">{romProgramData}</span>
          </label>
          <div className="d-flex flex-wrap gap-1 justify-content-center mb-1">
            {SIGNAL_LABELS.map((label, i) => (
              <div key={label} className="text-center" style={{ minWidth: '32px' }}>
                <SingleBitDisplay displayValue={romDataBin[i]} />
                <div style={{ fontSize: '0.6rem' }} className="text-muted">{label}</div>
                <Switch switchState={romDataBin[i]} onClick={loadROMDataInput} switchPosition={String(14 - i)} />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label mb-1 fw-semibold" style={{ fontSize: '0.75rem' }}>
            Address: <span className="text-info">{romAddress}</span>
          </label>
          <TenBitDisplay displayValue={romIndividualAddressBits} />
          <div className="d-flex flex-wrap gap-1 justify-content-center mt-1">
            {ADDR_LABELS.map((label, i) => (
              <div key={label} className="text-center" style={{ minWidth: '32px' }}>
                <ThreeStateSwitch switchState={romIndividualAddressBits[i]} onClick={loadROMAddressInput} switchPosition={String(9 - i)} />
                <div style={{ fontSize: '0.6rem' }} className="text-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-1 justify-content-center mb-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={clearROMAddressInput}>Clear Address</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={clearROMInputData}>Clear Data</button>
          <button className="btn btn-sm btn-primary" onClick={updateRomData}>Upload</button>
        </div>
        <hr className="my-2" />
        <div className="d-flex flex-wrap gap-1 align-items-center">
          <button className="btn btn-sm btn-outline-info" onClick={downloadFile}>Download ROM</button>
          <ROMFileUpload uploadDataFromFile={uploadROMDataFromFile} />
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center gap-2">
        <span>Control Unit</span>
        <select className="form-select form-select-sm ms-auto" style={{ width: 'auto' }}
          value={controlUnitMode} onChange={onControlUnitModeSelect}>
          <option value="ManualControl">Manual Control</option>
          <option value="AutoControl">Auto Control</option>
          <option value="InstructionDesign">Instruction Design</option>
        </select>
      </div>
      <div className="card-body p-3">
        {controlUnitMode === 'ManualControl' && renderManualControl()}
        {controlUnitMode === 'AutoControl' && renderAutoControl()}
        {controlUnitMode === 'InstructionDesign' && renderInstructionDesign()}
      </div>
    </div>
  );
};

export default ControlUnit;
