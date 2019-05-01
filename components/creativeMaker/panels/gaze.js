import React, { useState, useEffect } from 'react';

import SetObjectPanel from './SetObjectPanel';

const NextPanelPrompt = ({ setPanel, setGazePanel, gazeFile, skipped }) => {
  const mainLabel = () => {
    if (gazeFile && !skipped) return 'Animation uploaded';

    return 'No animation uploaded';
  };

  const checkLabel = () => {
    if (gazeFile && !skipped) return gazeFile.name;

    return 'no file';
  };

  return (
    <div>
      <div className="creative-checks">
        <div>
          <h3>{mainLabel()}</h3>
        </div>
        <div>
          <input type="checkbox" checked={!!gazeFile && !skipped} readOnly />
          <span>{checkLabel()}</span>
          <span onClick={() => setGazePanel(0)} className="creative-checks-edit">
            edit
          </span>
        </div>
      </div>

      <div>You'll be able to preview your animated model at the end</div>
      <div>
        <button type="button" className="blue-btn" onClick={() => setPanel(2)}>
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
  const { setPanel, loadFile, uploadModel, editCreative } = props;

  const [gazePanel, setGazePanel] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [gazeFile, setGazeFile] = useState(null);

  const onConfirm = () => {
    if (gazeFile) {
      uploadModel({
        variables: {
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

  const handleFile = event => {
    event.preventDefault();

    const file = event.target.files[0];
    if (file) {
      setGazeFile(file);
    }
    loadFile(event);
  };

  return (
    <div className="creative-panel">
      {GazePanels[gazePanel]({
        setPanel,
        handleFile,
        setGazePanel,
        onConfirm,
        onSkip,
        skipped,
        gazeFile,
      })}
    </div>
  );
};

export default Gaze;
