import React from 'react';

const ThreeStateSwitch = ({ switchState, onClick, switchPosition }) => {
  const nextState = switchState === '1' ? '*' : switchState === '*' ? 0 : 1;
  const label = String(switchState) === '1' ? '1' : switchState === '*' ? '*' : '0';
  const variant =
    String(switchState) === '1' ? 'btn-info' : switchState === '*' ? 'btn-warning' : 'btn-outline-dark';

  return (
    <button
      className={`btn btn-sm ${variant} mx-0 px-2`}
      onClick={() => onClick(switchPosition, nextState)}
      style={{ 
        minWidth: 28, 
        fontFamily: 'monospace', 
        fontSize: '0.8rem',
        borderRadius: 4,
      }}
    >
      {label}
    </button>
  );
};

export default ThreeStateSwitch;