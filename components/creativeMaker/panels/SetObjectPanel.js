import React from 'react';

const SetObjectPanel = ({ onConfirm, onSkip, handleFile, label }) => {
  return (
    <div>
      <div>
        <label htmlFor="3dfile" className="file-label blue-btn">
          {label}
        </label>
        <input id="3dfile" type="file" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      <button className="blue-btn" onClick={() => onConfirm()}>
        Confirm
      </button>
      {onSkip && (
        <button className="white-btn" onClick={() => onSkip()}>
          Skip
        </button>
      )}
    </div>
  );
};

export default SetObjectPanel;
