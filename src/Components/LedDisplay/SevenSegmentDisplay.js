import React from 'react';
import Button from '../Basic/Button';

const SevenSegmentDisplay = ({ displayValue, toggleOutputDisplayInputEnable, outputDisplayInputEnable }) => (
  <div className="card h-100">
    <div className="card-header d-flex align-items-center gap-2">
      <span>Output Display</span>
      <span className={`badge ${outputDisplayInputEnable === 1 ? 'bg-success' : 'bg-secondary'} ms-auto`}>
        OI: {outputDisplayInputEnable}
      </span>
    </div>
    <div className="card-body d-flex align-items-center justify-content-between p-3">
      <Button
        onClick={toggleOutputDisplayInputEnable}
        buttonState={outputDisplayInputEnable}
        name={outputDisplayInputEnable === 1 ? 'Disable OI' : 'Enable OI'}
      />
      <div
        style={{
          fontFamily: "'Orbitron', 'Courier New', monospace",
          fontSize: '3rem',
          fontWeight: 700,
          color: 'var(--led-on)',
          textShadow: '0 0 20px var(--led-on), 0 0 40px rgba(0,255,65,0.3)',
          backgroundColor: '#0a0a0a',
          padding: '8px 20px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          minWidth: 100,
          textAlign: 'center',
        }}
      >
        {displayValue}
      </div>
    </div>
  </div>
);

export default SevenSegmentDisplay;

