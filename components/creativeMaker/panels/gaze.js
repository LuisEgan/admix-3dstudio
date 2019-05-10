import React, { useState, useEffect } from 'react';
import { Mutation, withApollo } from 'react-apollo';
import actions from '../panelActions';
import mutations from '../../../mutations';

import SetObjectPanel from './SetObjectPanel';

const { uploadGaze } = mutations;

const NextPanelPrompt = ({ dispatch, setGazePanel, file, skipped }) => {
  const mainLabel = () => {
    if (file && !skipped) return 'Animation uploaded';

    return 'No animation uploaded';
  };

  const checkLabel = () => {
    if (file && !skipped) return file.name;

    return 'no file';
  };

  const handleNext = () => {
    dispatch({ type: actions.SET_CURRENT_PANEL, payload: 2 });
    if (skipped) {
      dispatch({ type: actions.SET_FILE, payload: { panelName: 'gaze', panelFile: null } });
    }
  };

  return (
    <div>
      <div className="creative-checks">
        <div>
          <h3>{mainLabel()}</h3>
        </div>
        <div>
          <input type="checkbox" checked={!!file && !skipped} readOnly />
          <span>{checkLabel()}</span>
          <span onClick={() => setGazePanel(0)} className="creative-checks-edit">
            edit
          </span>
        </div>
      </div>

      <div>You'll be able to preview your animated model at the end</div>
      <div>
        <button type="button" className="blue-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

const GazePanels = [
  props => <SetObjectPanel {...props} label={'Upload animation'} />,
  props => <NextPanelPrompt {...props} />,
];

const Gaze = props => {
  const {
    loadFile,
    loading,
    creative,
    dispatch,
    setCheckListDone,
    reducerState: {
      file: { gaze: gazeFile },
    },
  } = props;

  const [gazePanel, setGazePanel] = useState(gazeFile ? 1 : 0);
  const [skipped, setSkipped] = useState(false);

  const onConfirm = uploadGaze => () => {
    if (gazeFile) {
      uploadGaze({
        variables: {
          creative,
          model: gazeFile,
        },
      });
    }

    setSkipped(false);
    setCheckListDone(3);
    setGazePanel(1);
  };

  const onSkip = () => {
    setSkipped(true);
    setCheckListDone(3);
    setGazePanel(1);
  };

  return (
    <Mutation mutation={uploadGaze} onCompleted={() => console.log('size saved!')}>
      {(uploadGaze, { loading }) => (
        <div className="creative-panel">
          {GazePanels[gazePanel]({
            file: gazeFile,
            loadFile,
            dispatch,
            setGazePanel,
            onConfirm: onConfirm(uploadGaze),
            onSkip,
            skipped,
          })}
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(Gaze);
