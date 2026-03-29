import React from 'react';
import Led from '../Basic/LED';

const TenBitDisplay = ({ displayValue }) => (
  <span className="d-inline-flex align-items-center gap-0">
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
      <Led key={i} ledState={displayValue[i]} />
    ))}
  </span>
);

export default TenBitDisplay;

