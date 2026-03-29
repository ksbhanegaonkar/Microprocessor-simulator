import React from 'react';

const Bus = ({ currentValue, dec2bin }) => {
  const binaryValue = dec2bin(currentValue);

  return (
    <div className="card h-100" style={{ minWidth: 80 }}>
      <div className="card-header text-center py-2">
        <span>BUS</span>
        <div>
          <span className="badge bg-info mt-1" style={{ fontFamily: 'monospace' }}>
            0x{(parseInt(currentValue, 10).toString(16)).padStart(2, '0').toUpperCase()}
          </span>
        </div>
      </div>
      <div
        className="card-body p-2 d-flex flex-column align-items-center justify-content-center gap-1"
        style={{
          background: 'linear-gradient(180deg, rgba(88,166,255,0.05) 0%, rgba(88,166,255,0.02) 100%)',
        }}
      >
        <div className="d-flex flex-column align-items-center gap-1" style={{ flex: 1 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', opacity: 0.8 }}>
              <span style={{ width: 18, textAlign: 'right', fontFamily: 'monospace' }}>D{7 - i}</span>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: binaryValue[i] === '1' ? 'var(--led-on)' : 'var(--led-off)',
                  boxShadow: binaryValue[i] === '1' ? '0 0 6px var(--led-on)' : 'none',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.15s',
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {binaryValue}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>
          {currentValue}
        </div>
      </div>
    </div>
  );
};

export default Bus;
