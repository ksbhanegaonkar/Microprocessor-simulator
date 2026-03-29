import React from 'react';
import EightBitDisplay from './../LedDisplay/EightBitDisplay';
import Switch from './../Basic/Switch';
import Button from './../Basic/Button';

const ExternalInputPort = ({
  externalInputValue, externalInputIntValue, loadExtrnalInput,
  resetExternalInputValue, externalInputBusBuffer, toggleExternalInputBusBufferState
}) => (
  <div className="card h-100">
    <div className="card-header d-flex align-items-center gap-2">
      <span>External Input</span>
      <EightBitDisplay displayValue={externalInputValue} />
      <span className="badge bg-info ms-auto">{externalInputIntValue}</span>
    </div>
    <div className="card-body p-3">
      <div className="mb-2">
        <span className={`badge ${externalInputBusBuffer === 1 ? 'bg-success' : 'bg-secondary'}`}>
          Output Buffer: {externalInputBusBuffer ? 'ON' : 'OFF'}
        </span>
      </div>
      <div className="d-flex gap-1 mb-2 justify-content-center">
        {[7, 6, 5, 4, 3, 2, 1, 0].map((pos) => (
          <Switch key={pos} switchState={externalInputValue[7 - pos]} onClick={loadExtrnalInput} switchPosition={String(pos)} />
        ))}
      </div>
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-warning" onClick={resetExternalInputValue}>Reset</button>
        <Button onClick={toggleExternalInputBusBufferState} buttonState={externalInputBusBuffer}
          name={externalInputBusBuffer === 1 ? 'Disable Output' : 'Enable Output'} />
      </div>
    </div>
  </div>
);

export default ExternalInputPort;