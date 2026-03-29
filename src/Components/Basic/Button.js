import React from 'react';

const Button = ({ onClick, buttonState, name }) => {
  const isActive = String(buttonState) === '1';
  return (
    <button
      className={`btn btn-sm ${isActive ? 'btn-success' : 'btn-outline-secondary'} me-1 mb-1`}
      onClick={onClick}
      style={{ fontSize: '0.75rem' }}
    >
      {name}
    </button>
  );
};

export default Button;