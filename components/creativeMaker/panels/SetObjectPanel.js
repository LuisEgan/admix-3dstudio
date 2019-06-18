import React, { useState } from 'react';
import Button from 'components/Button';

const SetObjectPanel = props => {
  const [fileInput, setFileInput] = useState();
  const { panelDescription, label, loadFile, uploadLoading, loading3Dmodel, skippable } = props;

  const triggerInputFile = () => fileInput.click();

  return (
    <div className="creative-set-object">
      <div className="panelDescription">
        <span>{panelDescription}</span>
      </div>
      <div>
        <Button
          size="large"
          onClick={() => triggerInputFile()}
          className={`modelButton ${(loading3Dmodel || uploadLoading) && 'disabled-btn'}`}
        >
          {loading3Dmodel ? (
            'Loading 3D model...'
          ) : uploadLoading && !skippable ? (
            'Uploading...'
          ) : (
            <span>{label}</span>
          )}
        </Button>
        <input
          ref={fileInput => setFileInput(fileInput)}
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
