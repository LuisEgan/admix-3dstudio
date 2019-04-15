import React, { useState, useEffect } from 'react';

const Action = props => {
  const { handleFile } = props;

  const handleGenerateXML = mutation => {
    console.log('XML');
  };

  return (
    <div className="creative-panel">
      <div>
        <label htmlFor="3dfile" className="blue-btn">
          Select Image action
        </label>
        <input id="3dfile" type="file" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      <div>
        <button type="button" onClick={() => handleGenerateXML}>
          XML
        </button>
      </div>
    </div>
  );
};

export default Action;
