import React, { useState } from 'react';
import { Mutation, withApollo } from 'react-apollo';
import STR from '../../../lib/utils/strFuncs';
import actions from '../panelActions';
import mutations from '../../../mutations';

import SetObjectPanel from './SetObjectPanel';

const { uploadModel } = mutations;

const SetSizePanel = ({ dispatch, setModelPanel, reScale, size, saveModel }) => {
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
            <button
              type="button"
              className="blue-btn"
              onClick={() => dispatch({ type: actions.SET_CURRENT_PANEL, payload: 1 })}
            >
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
  const {
    editCreative,
    loading,
    creative,
    loadFile,
    size,
    setSize,
    dispatch,
    reducerState: {
      file: { model: modelFile },
    },
  } = props;

  const [modelPanel, setModelPanel] = useState(modelFile ? 1 : 0);

  const onConfirm = uploadModel => () => {
    uploadModel({
      variables: {
        creative,
        size: STR.parseSize(size),
        model: modelFile,
      },
    });
    setModelPanel(1);
  };

  const reScale = e => {
    const {
      target: { value },
    } = e;
    setSize(Math.round(value));
  };

  const saveModel = () => {
    editCreative({
      variables: {
        creative,
        size: STR.parseSize(size),
      },
    });
  };

  return (
    <Mutation mutation={uploadModel} onCompleted={() => console.log('size saved!')}>
      {(uploadModel, { loading }) => (
        <div className="creative-panel">
          {ModelPanels[modelPanel]({
            file: modelFile,
            loadFile,
            setModelPanel,
            reScale,
            dispatch,
            size,
            saveModel,
            onConfirm: onConfirm(uploadModel),
          })}
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(Model);
