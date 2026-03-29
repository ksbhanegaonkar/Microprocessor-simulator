import React from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import Button from '../Basic/Button';

const EightBitRegistor = ({ registorName, currentValue, dec2bin,
  registorInputEnable, registorOutputEnable,
  toggleRegistorInputEnableState, toggleRegistorOutputEnableState }) => (
  <div className="card h-100">
    <div className="card-header d-flex align-items-center gap-2">
      <span>{registorName}</span>
      <EightBitDisplay displayValue={dec2bin(currentValue)} />
      <span className="badge bg-info ms-auto">{currentValue}</span>
    </div>
    <div className="card-body p-3">
      <div className="d-flex flex-wrap gap-1 mb-2">
        <span className={`badge ${registorInputEnable ? 'bg-success' : 'bg-secondary'}`}>IN: {registorInputEnable}</span>
        <span className={`badge ${registorOutputEnable ? 'bg-success' : 'bg-secondary'}`}>OUT: {registorOutputEnable}</span>
      </div>
      <div className="d-flex flex-wrap gap-1">
        <Button onClick={toggleRegistorInputEnableState} buttonState={registorInputEnable}
          name={registorInputEnable === 1 ? 'Disable Input' : 'Enable Input'} />
        <Button onClick={toggleRegistorOutputEnableState} buttonState={registorOutputEnable}
          name={registorOutputEnable === 1 ? 'Disable Output' : 'Enable Output'} />
      </div>
    </div>
  </div>
);

export default EightBitRegistor;