import React from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import SingleBitDisplay from '../LedDisplay/SingleBitDisplay';
import Button from '../Basic/Button';

const Accumulator = ({
  currentValue, dec2bin, firstOperandValue, secondOperandValue,
  addSubtractFlag, accumulatorOutputEnable, toggleAccumulatorOutputEnable,
  toggleAddSubtractFlag, carryValue, zeroValue
}) => (
  <div className="card h-100">
    <div className="card-header d-flex align-items-center gap-2">
      <span>ALU / Accumulator</span>
      <EightBitDisplay displayValue={dec2bin(currentValue)} />
      <span className="badge bg-info ms-auto">{currentValue}</span>
    </div>
    <div className="card-body p-3">
      <div className="row g-2 mb-2" style={{ fontSize: '0.8rem' }}>
        <div className="col-6 d-flex align-items-center gap-1">
          <span className="text-muted">Op1:</span>
          <span className="fw-bold">{firstOperandValue}</span>
          <EightBitDisplay displayValue={dec2bin(firstOperandValue)} />
        </div>
        <div className="col-6 d-flex align-items-center gap-1">
          <span className="text-muted">Op2:</span>
          <span className="fw-bold">{secondOperandValue}</span>
          <EightBitDisplay displayValue={dec2bin(secondOperandValue)} />
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-2">
        <span className="d-flex align-items-center gap-1">
          <span style={{ fontSize: '0.75rem' }}>Carry:</span>
          <SingleBitDisplay displayValue={carryValue === 0 ? '0' : '1'} />
        </span>
        <span className="d-flex align-items-center gap-1">
          <span style={{ fontSize: '0.75rem' }}>Zero:</span>
          <SingleBitDisplay displayValue={zeroValue === 0 ? '0' : '1'} />
        </span>
        <span className={`badge ${addSubtractFlag ? 'bg-warning text-dark' : 'bg-primary'}`}>
          {addSubtractFlag ? 'SUB' : 'ADD'}
        </span>
        <span className={`badge ${accumulatorOutputEnable ? 'bg-success' : 'bg-secondary'}`}>
          OUT: {accumulatorOutputEnable}
        </span>
      </div>
      <div className="d-flex flex-wrap gap-1">
        <Button onClick={toggleAccumulatorOutputEnable} buttonState={accumulatorOutputEnable}
          name={accumulatorOutputEnable === 1 ? 'Disable Output' : 'Enable Output'} />
        <Button onClick={toggleAddSubtractFlag} buttonState={addSubtractFlag}
          name={addSubtractFlag === 1 ? 'Mode: Add' : 'Mode: Subtract'} />
      </div>
    </div>
  </div>
);

export default Accumulator;