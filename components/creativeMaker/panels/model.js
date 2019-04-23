import React, { useState, useEffect } from 'react';
import { Mutation, withApollo } from 'react-apollo';

import mutations from '../../../mutations';

const { editCreative } = mutations;

const SetObjectPanel = ({ setModelPanel, handleFile }) => {
  return (
    <div>
      <div>
        <label htmlFor="3dfile" className="file-label blue-btn">
          Select 3D model
        </label>
        <input id="3dfile" type="file" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      <button className="blue-btn" onClick={() => setModelPanel(1)}>
        Confirm model
      </button>
    </div>
  );
};

const SetSizePanel = ({ setPanel, setModelPanel, reScale, objHeight, saveModel }) => {
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
          <input type="checkbox" checked={sizeSet} />
          <span>Set size</span>
          <span onClick={() => setSizeSet(false)} className="creative-checks-edit">
            edit
          </span>
        </div>
      </div>
      {!sizeSet && (
        <React.Fragment>
          <div style={{ display: 'flex', flexFlow: 'column' }}>
            <input type="range" min={1} max={300} onChange={reScale} value={objHeight} />
            <input value={`${objHeight} cm`} readOnly={true} />
          </div>
          <div>
            <button type="button" onClick={handleSave}>
              Save size
            </button>
          </div>
        </React.Fragment>
      )}

      {sizeSet && (
        <React.Fragment>
          <div>Your base model is ready to go. Now, set animated states.</div>
          <div>
            <button type="button" onClick={() => setPanel(1)}>
              Next
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const ModelPanels = [props => <SetObjectPanel {...props} />, props => <SetSizePanel {...props} />];

const Model = props => {
  const { setPanel, handleFile } = props;

  const [modelPanel, setModelPanel] = useState(0);
  const [objHeight, setObjHeight] = useState(1);

  const reScale = e => {
    const {
      target: { value },
    } = e;
    setObjHeight(Math.round(value));
  };

  const saveModel = mutation => () => {
    console.log('saved!');
    // setPanel(1);
  };

  return (
    <Mutation mutation={editCreative}>
      {(mutation, { error }) => (
        <div className="creative-panel">
          {ModelPanels[modelPanel]({
            setModelPanel,
            reScale,
            handleFile,
            setPanel,
            objHeight,
            saveModel: saveModel(mutation),
          })}
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(Model);
