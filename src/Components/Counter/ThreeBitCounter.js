import React from 'react';
import ThreeBitDisplay from './../LedDisplay/ThreeBitDisplay';
import SingleBitDisplay from './../LedDisplay/SingleBitDisplay';

const ThreeBitCounter = ({ currentCounterValue, dec2binFourBit }) => {
  const tStates = [0, 1, 2, 3, 4, 5];

  return (
    <div className="card h-100">
      <div className="card-header d-flex align-items-center gap-2">
        <span>T-State Counter</span>
        <ThreeBitDisplay displayValue={dec2binFourBit(currentCounterValue)} />
        <span className="badge bg-info ms-auto">T{currentCounterValue}</span>
      </div>
      <div className="card-body p-3">
        <div className="d-flex gap-2 justify-content-center">
          {tStates.map((t) => (
            <div key={t} className="text-center">
              <div style={{ fontSize: '0.7rem', marginBottom: 4, opacity: 0.7 }}>T{t}</div>
              <SingleBitDisplay displayValue={currentCounterValue === t ? 1 : 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeBitCounter;

