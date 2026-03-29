import React from 'react';
import Led from '../Basic/LED';

const FifteenBitDisplay = ({ displayValue }) => (
  <span className="d-inline-flex align-items-center gap-0">
    {Array.from({ length: 15 }, (_, i) => (
      <Led key={i} ledState={displayValue[i]} />
    ))}
  </span>
);

export default FifteenBitDisplay;

