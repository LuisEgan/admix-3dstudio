import React, { useState, useEffect } from 'react';

import SetObjectPanel from './SetObjectPanel';

const SetSizePanel = ({ setPanel, setModelPanel, reScale, size, saveModel }) => {
  const [sizeSet, setSizeSet] = useState(false);

  const handleSave = () => {
    saveModel();
    setSizeSet(true);
  };

  return (
    <div>
      <div className="creative-checks">
        <div>
          <input type="checkbox" checked={true} readOnly />
          <span>Import model</span>
          <span onClick={() => setModelPanel(0)} className="creative-checks-edit">
            edit
          </span>
        </div>
        <div>
          <input type="checkbox" checked={sizeSet} readOnly />
          <span>Set size</span>
          <span onClick={() => setSizeSet(false)} className="creative-checks-edit">
            edit
          </span>
        </div>
      </div>
      {!sizeSet && (
        <React.Fragment>
          <div style={{ display: 'flex', flexFlow: 'column' }}>
            <input type="range" min={1} max={300} onChange={reScale} value={size} />
            <input value={`${size} cm`} readOnly />
          </div>
          <div>
            <button type="button" className="blue-btn" onClick={handleSave}>
              Save size
            </button>
          </div>
        </React.Fragment>
      )}

      {sizeSet && (
        <React.Fragment>
          <div>Your base model is ready to go. Now, set animated states.</div>
          <div>
            <button type="button" className="blue-btn" onClick={() => setPanel(1)}>
              Next
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const ModelPanels = [
  props => <SetObjectPanel {...props} label={'Select 3D model'} />,
  props => <SetSizePanel {...props} />,
];

const Model = props => {
  const { creative, setPanel, loadFile, uploadModel, editCreative } = props;

  const [modelFile, setModelFile] = useState(null);
  const [modelPanel, setModelPanel] = useState(0);
  const [size, setSize] = useState(1);

  const reScale = e => {
    const {
      target: { value },
    } = e;
    setSize(Math.round(value));
  };

  const handleFile = event => {
    event.preventDefault();

    const file = event.target.files[0];
    if (file) {
      setModelFile(file);
    }
    loadFile(event);
  };

  const saveModel = () => {
    editCreative({
      variables: {
        creative,
        size: `${size}`,
      },
    });
    // setPanel(1);
  };

  const onConfirm = () => {
    uploadModel({
      variables: {
        model: modelFile,
      },
    });
    setModelPanel(1);
  };

  return (
    <div className="creative-panel">
      {ModelPanels[modelPanel]({
        setModelPanel,
        reScale,
        handleFile,
        setPanel,
        size,
        onConfirm,
        saveModel,
      })}
    </div>
  );
};

export default Model;
