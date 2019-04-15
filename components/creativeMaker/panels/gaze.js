import React, { useState, useEffect } from 'react';

const Gaze = props => {
  const { setPanel, handleFile } = props;
  return (
    <div className="creative-panel">
      <div>
        <label htmlFor="3dfile" className="blue-btn">
          Select Image gaze
        </label>
        <input id="3dfile" type="file" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      <div>
        <button type="button" onClick={() => setPanel(2)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Gaze;
