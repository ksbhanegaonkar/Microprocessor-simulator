import React, { useState, useCallback } from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import FourBitDisplay from './../LedDisplay/FourBitDisplay';
import SixteenByteRAMDataDisplay from './SixteenByteRAMDataDisplay';
import Switch from './../Basic/Switch';
import RAMFileUpload from '../FileUpload/RAMFileUpload';
import Button from '../Basic/Button';

const SixteenByteRAM = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const {
    dec2bin, dec2binFourBit, ramData, ramAddress, loadRAMDataInput, loadRAMAddressInput,
    ramMode, onRAMModeSelect, updateRamData, ramProgramData, clearRAMInputData,
    clearRAMAddressInput, incrementRAMAddress, decrementRAMAddress, downloadRamData,
    ramAddressInputEnable, ramDataOutputEnable, toggleRamAddressInputEnable,
    toggleRamDataOutputEnable, uploadRAMDataFromFile
  } = props;

  const downloadFile = useCallback(() => {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ramData.map(dec2bin).join('\r\n')));
    el.setAttribute('download', 'RAMProgram.txt');
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }, [ramData, dec2bin]);

  const renderProgramMode = () => {
    const addrBin = dec2binFourBit(ramAddress);
    const dataBin = dec2bin(ramProgramData);
    return (
      <div className="mt-2">
        <div className="mb-2">
          <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Data Input:</label>
          <div className="d-flex gap-1 justify-content-center">
            {[7,6,5,4,3,2,1,0].map(pos => (
              <Switch key={pos} switchState={dataBin[7-pos]} onClick={loadRAMDataInput} switchPosition={String(pos)} />
            ))}
          </div>
        </div>
        <div className="mb-2">
          <label className="form-label mb-1" style={{ fontSize: '0.75rem' }}>Address:</label>
          <div className="d-flex gap-1 justify-content-center">
            {[3,2,1,0].map(pos => (
              <Switch key={pos} switchState={addrBin[3-pos]} onClick={loadRAMAddressInput} switchPosition={String(pos)} />
            ))}
          </div>
        </div>
        <div className="d-flex flex-wrap gap-1 justify-content-center">
          <button className="btn btn-sm btn-outline-secondary" onClick={clearRAMAddressInput}>Clear Addr</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={clearRAMInputData}>Clear Data</button>
          <button className="btn btn-sm btn-outline-info" onClick={downloadRamData}>Download</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={decrementRAMAddress}>Addr--</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={incrementRAMAddress}>Addr++</button>
          <button className="btn btn-sm btn-primary" onClick={updateRamData}>Upload Byte</button>
        </div>
      </div>
    );
  };

  const renderRunMode = () => (
    <div className="mt-2">
      <div className="d-flex flex-wrap gap-1 mb-2">
        <Button onClick={toggleRamAddressInputEnable} buttonState={ramAddressInputEnable}
          name={ramAddressInputEnable === 1 ? 'Disable RAI' : 'Enable RAI'} />
        <Button onClick={toggleRamDataOutputEnable} buttonState={ramDataOutputEnable}
          name={ramDataOutputEnable === 1 ? 'Disable RO' : 'Enable RO'} />
      </div>
      <button className="btn btn-sm btn-outline-info" onClick={() => setShowPopup(true)}>Show RAM Data</button>
      {showPopup && (
        <SixteenByteRAMDataDisplay dec2bin={dec2bin} dec2binFourBit={dec2binFourBit}
          ramData={ramData} closePopup={() => setShowPopup(false)} />
      )}
    </div>
  );

  const renderFileMode = () => (
    <div className="mt-2">
      <button className="btn btn-sm btn-outline-info mb-2" onClick={downloadFile}>Download File</button>
      <RAMFileUpload uploadDataFromFile={uploadRAMDataFromFile} />
    </div>
  );

  return (
    <div className="card h-100">
      <div className="card-header d-flex align-items-center gap-2">
        <span>RAM (16 Bytes)</span>
        <select className="form-select form-select-sm ms-auto" style={{ width: 'auto' }} value={ramMode} onChange={onRAMModeSelect}>
          <option value="Run">Run</option>
          <option value="Program">Program</option>
          <option value="File Upload">File Upload</option>
        </select>
      </div>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.8rem' }}>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Value:</span>
            <span className="fw-bold">{ramData[ramAddress]}</span>
            <EightBitDisplay displayValue={dec2bin(ramData[ramAddress])} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Addr:</span>
            <span className="fw-bold">{ramAddress}</span>
            <FourBitDisplay displayValue={dec2binFourBit(ramAddress)} />
          </div>
        </div>
        <div className="d-flex flex-wrap gap-1 mb-1">
          <span className={`badge ${ramAddressInputEnable ? 'bg-success' : 'bg-secondary'}`}>RAI: {ramAddressInputEnable}</span>
          <span className={`badge ${ramDataOutputEnable ? 'bg-success' : 'bg-secondary'}`}>RO: {ramDataOutputEnable}</span>
        </div>
        {ramMode === 'Program' && renderProgramMode()}
        {ramMode === 'Run' && renderRunMode()}
        {ramMode === 'File Upload' && renderFileMode()}
      </div>
    </div>
  );
};

export default SixteenByteRAM;
