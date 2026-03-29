import React from 'react';
import Led from '../Basic/LED';

const ThreeBitDisplay = ({ displayValue }) => (
  <span className="d-inline-flex align-items-center gap-0">
    {[1, 2, 3].map((i) => (
      <Led key={i} ledState={displayValue[i]} />
    ))}
  </span>
);

export default ThreeBitDisplay;

