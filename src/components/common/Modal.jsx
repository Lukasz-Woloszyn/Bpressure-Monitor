import React from 'react';
import './common.scss';

export default function Modal({ title, onConfirm, onCancel }) {
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };
  return (
    <div className="modal" onClick={handleBackgroundClick}>
      <div className="modal-content">
        <h3>{title}</h3>
        <div className="modal-actions">
          <button className="yes-button" onClick={onConfirm}>Yes</button>
          <button className="no-button" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}