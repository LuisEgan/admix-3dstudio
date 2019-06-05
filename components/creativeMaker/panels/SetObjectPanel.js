import React from 'react';

const SetObjectPanel = props => {
  const { panelDescription, label, loadFile, uploadLoading, loading3Dmodel, skippable } = props;

  return (
    <div className="creative-set-object">
      <div>{panelDescription}</div>
      <div>
        <label
          htmlFor="3dfile"
          className={`file-label blue-btn ${uploadLoading && 'disabled-btn'}`}
        >
          {loading3Dmodel
            ? 'Loading 3D model...'
            : uploadLoading && !skippable
            ? 'Uploading...'
            : label}
        </label>
        <input
          id="3dfile"
          type="file"
          style={{ display: 'none' }}
          onChange={loadFile}
          disabled={uploadLoading}
        />
      </div>
      <div>
        Formats supported: fbx <br /> Max polycount: 3000 | Max size: 5Mb
      </div>
    </div>
  );
};

export default SetObjectPanel;
