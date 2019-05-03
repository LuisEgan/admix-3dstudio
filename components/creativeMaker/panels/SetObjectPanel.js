import React from 'react';

const SetObjectPanel = ({ onConfirm, onSkip, loadFile, file, label }) => {
  return (
    <div>
      <div>
        <label htmlFor="3dfile" className="file-label blue-btn">
          {label}
        </label>
        <input id="3dfile" type="file" style={{ display: 'none' }} onChange={loadFile} />
      </div>
      <button
        className={`blue-btn ${!file && !onSkip ? 'disabled-btn' : ''}`}
        onClick={() => onConfirm()}
        disabled={!file && !onSkip}
      >
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
