/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import THREEScene from '../3DScene';
import { Mutation, withApollo } from 'react-apollo';
import mutations from '../../mutations';

import Model from './panels/Model';
import Gaze from './panels/Gaze';
import Action from './panels/Action';
import DownloadXML from './panels/DownloadXML';

const Panels = [
  props => <Model {...props} />,
  props => <Gaze {...props} />,
  props => <Action {...props} />,
  props => <DownloadXML {...props} />,
];

const { editCreative, uploadModel } = mutations;

const CreativeMaker = ({ creative }) => {
  const [panel, setPanel] = useState(0);
  const [source, setSource] = useState(null);
  const [fileType, setFileType] = useState(null);

  const loadFile = event => {
    event.preventDefault();

    const file = event.target.files[0];
    if (file) {
      const type = file.name.substring(file.name.lastIndexOf('.') + 1);
      setFileType(type);

      const userImageURL = URL.createObjectURL(file);
      setSource(userImageURL);
    }
  };

  const renderPanelToggles = () => {
    if (panel > 2) return;

    const toggles = ['Model', 'Gaze', 'Action'];

    return toggles.map((toggle, i) => {
      return (
        <div
          key={toggle}
          role="panel-toggle"
          className={panel === i ? 'creative-panel-active' : ''}
          onClick={() => setPanel(i)}
        >
          {toggle}
        </div>
      );
    });
  };

  return (
    <Mutation mutation={uploadModel} onCompleted={() => console.log('size saved!')}>
      {(uploadModel, { error }) => (
        <Mutation mutation={editCreative} onCompleted={() => console.log('size saved!')}>
          {(editCreative, { error }) => (
            <div id="creative-maker">
              <div id="creative-webgl">
                <THREEScene id="creative-3d" source={source} fileType={fileType} panel={panel} />
              </div>

              <div id="creative-panels">
                <div id="creative-panels-toggle">{renderPanelToggles()}</div>

                <div id="creative-panels-content">
                  {Panels[panel]({
                    creative,
                    setPanel,
                    loadFile,
                    uploadModel,
                    editCreative,
                  })}
                </div>
              </div>
            </div>
          )}
        </Mutation>
      )}
    </Mutation>
  );
};

export default withApollo(CreativeMaker);
