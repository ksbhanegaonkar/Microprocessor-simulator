import React, { useState } from 'react';

const TriStateBuffer = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="d-flex align-items-center gap-2">
      <span className={`badge ${isOpen ? 'bg-warning text-dark' : 'bg-success'}`}>
        {isOpen ? 'OPEN' : 'CLOSED'}
      </span>
      <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Buffer' : 'Open Buffer'}
      </button>
    </div>
  );
};

export default TriStateBuffer;
