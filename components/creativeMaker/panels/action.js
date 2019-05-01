import React, { useState } from 'react';

import SetObjectPanel from './SetObjectPanel';

const NextPanelPrompt = ({ setPanel, setActionPanel, actionFile, skipped }) => {
  const mainLabel = () => {
    if (actionFile && !skipped) return 'Animation uploaded';

    return 'No animation uploaded';
  };

  const checkLabel = () => {
    if (actionFile && !skipped) return actionFile.name;

    return 'no file';
  };

  return (
    <div>
      <div className="creative-checks">
        <div>
          <h3>{mainLabel()}</h3>
        </div>
        <div>
          <input type="checkbox" checked={!!actionFile && !skipped} readOnly />
          <span>{checkLabel()}</span>
          <span onClick={() => setActionPanel(0)} className="creative-checks-edit">
            edit
          </span>
        </div>
      </div>

      <div>You'll be able to preview your animated model at the end</div>
      <div>
        <button type="button" className="blue-btn" onClick={() => setPanel(3)}>
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
  const { setPanel, loadFile, uploadModel, editCreative } = props;

  const [actionPanel, setActionPanel] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [actionFile, setActionFile] = useState(null);

  const onConfirm = () => {
    if (actionFile) {
      uploadModel({
        variables: {
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

  const handleFile = event => {
    event.preventDefault();

    const file = event.target.files[0];
    if (file) {
      setActionFile(file);
    }
    loadFile(event);
  };

  return (
    <div className="creative-panel">
      {ActionPanels[actionPanel]({
        setPanel,
        handleFile,
        setActionPanel,
        onConfirm,
        onSkip,
        skipped,
        actionFile,
      })}
    </div>
  );
};

export default Action;
