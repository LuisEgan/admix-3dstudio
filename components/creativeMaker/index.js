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

const CreativeMaker = props => {
  const [panel, setPanel] = useState(0);
  const [source, setSource] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [objectScale, setObjectScale] = useState(1);
  const [objSize, setObjSize] = useState({});
  const [userSelectedHeight, setUserSelectedHeight] = useState(null);

  const handleFile = event => {
    event.preventDefault();

    let file = event.target.files[0];
    if (file) {
      const type = file.name.substring(file.name.lastIndexOf('.') + 1);
      setFileType(type);

      let userImageURL = URL.createObjectURL(file);
      setSource(userImageURL);
    }
  };

  const reScale = e => {
    const {
      target: { value },
    } = e;
    setObjectScale(value);
  };

  const modelClass = panel === 0 ? 'creative-panel-active' : '';
  const gazeClass = panel === 1 ? 'creative-panel-active' : '';
  const actionClass = panel === 2 ? 'creative-panel-active' : '';

  return (
    <div id="creative-maker">
      <div>
        <THREEScene
          id="creative-3d"
          source={source}
          fileType={fileType}
          setObjSize={setObjSize}
          panel={panel}
          // objectScale={objectScale}
        />
      </div>

      <div id="creative-panels">
        <div id="creative-panels-toggle">
          <div className={modelClass} onClick={() => setPanel(0)}>
            Model
          </div>
          <div className={gazeClass} onClick={() => setPanel(1)}>
            Gaze
          </div>
          <div className={actionClass} onClick={() => setPanel(2)}>
            Action
          </div>
        </div>

        <div id="creative-panel">
          {Panels[panel]({
            setPanel,
            handleFile,
            objSize,
            userSelectedHeight,
            setUserSelectedHeight,
          })}
        </div>
      </div>
    </div>
  );
};

export default CreativeMaker;
