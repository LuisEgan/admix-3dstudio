import React, { useState, useEffect } from 'react';
import actions from '../panelActions';

import SetObjectPanel from './SetObjectPanel';

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
    uploadModel,
    loading,
    creative,
    dispatch,
    reducerState: {
      file: { gaze: gazeFile },
    },
  } = props;

  const [gazePanel, setGazePanel] = useState(gazeFile ? 1 : 0);
  const [skipped, setSkipped] = useState(false);

  const onConfirm = () => {
    if (gazeFile) {
      uploadModel({
        variables: {
          creative,
          model: gazeFile,
        },
      });
    }

    setSkipped(false);
    setGazePanel(1);
  };

  const onSkip = () => {
    setSkipped(true);
    setGazePanel(1);
  };

  return (
    <div className="creative-panel">
      {GazePanels[gazePanel]({
        file: gazeFile,
        loadFile,
        dispatch,
        setGazePanel,
        onConfirm,
        onSkip,
        skipped,
      })}
    </div>
  );
};

export default Gaze;
