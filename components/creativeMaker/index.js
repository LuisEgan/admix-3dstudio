/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import THREEScene from '../3DScene';

import Model from './panels/model';
import Gaze from './panels/gaze';
import Action from './panels/action';

const Panels = [
  props => <Model {...props} />,
  props => <Gaze {...props} />,
  props => <Action {...props} />,
];

const CreativeMaker = () => {
  const [panel, setPanel] = useState(0);
  const [source, setSource] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleFile = event => {
    event.preventDefault();

    const file = event.target.files[0];
    if (file) {
      const type = file.name.substring(file.name.lastIndexOf('.') + 1);
      setFileType(type);

      const userImageURL = URL.createObjectURL(file);
      setSource(userImageURL);
    }
  };

  const modelClass = panel === 0 ? 'creative-panel-active' : '';
  const gazeClass = panel === 1 ? 'creative-panel-active' : '';
  const actionClass = panel === 2 ? 'creative-panel-active' : '';

  return (
    <div id="creative-maker">
      <div>
        <THREEScene id="creative-3d" source={source} fileType={fileType} panel={panel} />
      </div>

      <div id="creative-panels">
        <div id="creative-panels-toggle">
          <div role="panel-toggle" className={modelClass} onClick={() => setPanel(0)}>
            Model
          </div>
          <div role="panel-toggle" className={gazeClass} onClick={() => setPanel(1)}>
            Gaze
          </div>
          <div role="panel-toggle" className={actionClass} onClick={() => setPanel(2)}>
            Action
          </div>
        </div>

        <div>
          {Panels[panel]({
            setPanel,
            handleFile,
          })}
        </div>
      </div>
    </div>
  );
};

export default CreativeMaker;
