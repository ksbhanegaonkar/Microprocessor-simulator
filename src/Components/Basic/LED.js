import React from 'react';

const LED = ({ ledState }) => {
  const isOn = ledState === '1' || ledState === 1;
  const isDontCare = ledState === '*';

  const style = {
    width: 14,
    height: 14,
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 2px',
    border: '1px solid rgba(255,255,255,0.15)',
    backgroundColor: isDontCare
      ? 'var(--led-dont-care)'
      : isOn
      ? 'var(--led-on)'
      : 'var(--led-off)',
    boxShadow: isOn
      ? '0 0 8px var(--led-on), 0 0 2px var(--led-on)'
      : isDontCare
      ? '0 0 6px var(--led-dont-care)'
      : 'inset 0 1px 3px rgba(0,0,0,0.4)',
    transition: 'all 0.15s ease',
  };

  return <span style={style} title={String(ledState)} />;
};

export default LED;