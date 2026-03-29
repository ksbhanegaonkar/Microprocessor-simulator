import React from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import FourBitDisplay from './../LedDisplay/FourBitDisplay';

const SixteenByteRAMDataDisplay = ({ dec2bin, dec2binFourBit, ramData, closePopup }) => (
  <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">RAM Data (16 Bytes)</h5>
          <button type="button" className="btn-close btn-close-white" onClick={closePopup} />
        </div>
        <div className="modal-body p-0">
          <table className="table table-sm table-hover mb-0" style={{ fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th className="text-center" style={{ width: 60 }}>Addr</th>
                <th className="text-center">Binary Addr</th>
                <th className="text-center" style={{ width: 60 }}>Value</th>
                <th className="text-center">Binary Value</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 16 }, (_, i) => (
                <tr key={i}>
                  <td className="text-center font-monospace">{i}</td>
                  <td className="text-center"><FourBitDisplay displayValue={dec2binFourBit(i)} /></td>
                  <td className="text-center font-monospace fw-bold">{ramData[i]}</td>
                  <td className="text-center"><EightBitDisplay displayValue={dec2bin(ramData[i])} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button className="btn btn-sm btn-secondary" onClick={closePopup}>Close</button>
        </div>
      </div>
    </div>
  </div>
);

export default SixteenByteRAMDataDisplay;
