import React from 'react';

const Switch = ({ switchState, onClick, switchPosition }) => {
  const isOn = String(switchState) === '1';
  return (
    <button
      className={`btn btn-sm ${isOn ? 'btn-info' : 'btn-outline-dark'} mx-0 px-2`}
      onClick={() => onClick(switchPosition, isOn ? 0 : 1)}
      style={{ 
        minWidth: 28, 
        fontFamily: 'monospace', 
        fontSize: '0.8rem',
        borderRadius: 4,
      }}
    >
      {isOn ? '1' : '0'}
    </button>
  );
};

export default Switch;