import React from 'react';
import ClockPannel from './ClockPannel';
import SingleBitDisplay from './../LedDisplay/SingleBitDisplay';

const SystemClock = (props) => {
  const { ClockType, CurrentClockState, onClockModeSelect, changeClockState,
    triggerMonostableClockPulse, triggerAstableClockPulse, stopAstableClockPulse,
    onAstableClockFrequencyChange, astableClockPeriod } = props;

  return (
    <div className="card h-100">
      <div className="card-header d-flex align-items-center gap-2">
        <span>System Clock</span>
        <SingleBitDisplay displayValue={CurrentClockState === 0 ? '0' : '1'} />
        <span className={`badge ms-auto ${CurrentClockState ? 'bg-success' : 'bg-secondary'}`}>
          {CurrentClockState ? 'HIGH' : 'LOW'}
        </span>
      </div>
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <label className="form-label mb-0 text-nowrap" style={{ fontSize: '0.8rem' }}>Mode:</label>
          <select className="form-select form-select-sm" value={ClockType} onChange={onClockModeSelect}>
            <option value="A">Astable</option>
            <option value="B">Monostable</option>
            <option value="C">Bistable</option>
          </select>
        </div>
        <ClockPannel
          pannelType={ClockType}
          changeClock={changeClockState}
          triggerMonostableClockPulse={triggerMonostableClockPulse}
          triggerAstableClockPulse={triggerAstableClockPulse}
          stopAstableClockPulse={stopAstableClockPulse}
          onAstableClockFrequencyChange={onAstableClockFrequencyChange}
          astableClockPeriod={astableClockPeriod}
        />
      </div>
    </div>
  );
};

export default SystemClock;