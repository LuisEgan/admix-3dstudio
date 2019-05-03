import React, { useState } from 'react';
import actions from '../panelActions';

import SetObjectPanel from './SetObjectPanel';

const NextPanelPrompt = ({ dispatch, setActionPanel, file, skipped }) => {
  const mainLabel = () => {
    if (file && !skipped) return 'Animation uploaded';

    return 'No animation uploaded';
  };

  const checkLabel = () => {
    if (file && !skipped) return file.name;

    return 'no file';
  };

  const handleNext = () => {
    dispatch({ type: actions.SET_CURRENT_PANEL, payload: 3 });
    if (skipped) {
      dispatch({ type: actions.SET_FILE, payload: { panelName: 'action', panelFile: null } });
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
          <span onClick={() => setActionPanel(0)} className="creative-checks-edit">
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

const ActionPanels = [
  props => <SetObjectPanel {...props} label={'Upload action'} />,
  props => <NextPanelPrompt {...props} />,
];

const Action = props => {
  const {
    loadFile,
    uploadModel,
    loading,
    creative,
    dispatch,
    reducerState: {
      file: { action: actionFile },
    },
  } = props;

  const [actionPanel, setActionPanel] = useState(actionFile ? 1 : 0);
  const [skipped, setSkipped] = useState(false);

  const onConfirm = () => {
    if (actionFile) {
      uploadModel({
        variables: {
          creative,
          model: actionFile,
        },
      });
    }
    setSkipped(false);
    setActionPanel(1);
  };

  const onSkip = () => {
    setSkipped(true);
    setActionPanel(1);
  };

  return (
    <div className="creative-panel">
      {ActionPanels[actionPanel]({
        file: actionFile,
        loadFile,
        dispatch,
        setActionPanel,
        onConfirm,
        onSkip,
        skipped,
      })}
    </div>
  );
};

export default Action;
