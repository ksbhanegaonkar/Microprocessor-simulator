import React from 'react';
import Led from '../Basic/LED';

const SingleBitDisplay = ({ displayValue }) => (
  <span className="d-inline-flex align-items-center">
    <Led ledState={displayValue} />
  </span>
);

export default SingleBitDisplay;

