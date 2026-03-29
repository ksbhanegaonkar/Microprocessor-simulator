import React from 'react';
import FourBitDisplay from './../LedDisplay/FourBitDisplay';
import Button from '../Basic/Button';

const FourBitCounter = (props) => {
  const { currentCounterValue, isCounterEnable, dec2binFourBit,
    counterOutputEnable, toggleCounterOutputEnable, toggleCountEnable,
    jump, jumpEnable } = props;

  return (
    <div className="card h-100">
      <div className="card-header d-flex align-items-center gap-2">
        <span>Program Counter</span>
        <FourBitDisplay displayValue={dec2binFourBit(currentCounterValue)} />
        <span className="badge bg-info ms-auto">{currentCounterValue}</span>
      </div>
      <div className="card-body p-3">
        <div className="d-flex flex-wrap gap-1 mb-2">
          <span className={`badge ${isCounterEnable ? 'bg-success' : 'bg-secondary'}`}>CE: {isCounterEnable}</span>
          <span className={`badge ${counterOutputEnable ? 'bg-success' : 'bg-secondary'}`}>CO: {counterOutputEnable}</span>
          <span className={`badge ${jumpEnable ? 'bg-warning text-dark' : 'bg-secondary'}`}>JP: {jumpEnable}</span>
        </div>
        <div className="d-flex flex-wrap gap-1">
          <Button onClick={toggleCountEnable} buttonState={isCounterEnable}
            name={isCounterEnable === 1 ? 'Disable CE' : 'Enable CE'} />
          <Button onClick={toggleCounterOutputEnable} buttonState={counterOutputEnable}
            name={counterOutputEnable === 1 ? 'Disable CO' : 'Enable CO'} />
          <Button onClick={jump} buttonState={jumpEnable}
            name={jumpEnable === 1 ? 'Disable JP' : 'Enable JP'} />
        </div>
      </div>
    </div>
  );
};

export default FourBitCounter;

