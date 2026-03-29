import React, { useEffect, useRef } from 'react';

const ClockPannel = ({ pannelType, changeClock, triggerMonostableClockPulse,
  triggerAstableClockPulse, stopAstableClockPulse, onAstableClockFrequencyChange, astableClockPeriod }) => {

  const prevType = useRef(pannelType);

  useEffect(() => {
    if (prevType.current === 'A' && pannelType !== 'A') {
      stopAstableClockPulse();
    }
    prevType.current = pannelType;
  }, [pannelType, stopAstableClockPulse]);

  if (pannelType === 'A') {
    return (
      <div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <label className="form-label mb-0 text-nowrap" style={{ fontSize: '0.8rem' }}>Period:</label>
          <select className="form-select form-select-sm" value={astableClockPeriod} onChange={onAstableClockFrequencyChange}>
            <option value="1000">1s</option>
            <option value="500">0.5s</option>
            <option value="250">0.25s</option>
            <option value="125">0.125s</option>
          </select>
        </div>
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-success" onClick={triggerAstableClockPulse}>
            Start
          </button>
          <button className="btn btn-sm btn-danger" onClick={stopAstableClockPulse}>
            Stop (HLT)
          </button>
        </div>
      </div>
    );
  }

  if (pannelType === 'B') {
    return (
      <div>
        <button className="btn btn-sm btn-warning" onClick={triggerMonostableClockPulse}>
          Trigger Pulse
        </button>
      </div>
    );
  }

  if (pannelType === 'C') {
    return (
      <div>
        <button className="btn btn-sm btn-info" onClick={changeClock}>
          Toggle State
        </button>
      </div>
    );
  }

  return null;
};

export default ClockPannel;