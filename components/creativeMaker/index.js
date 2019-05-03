/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useReducer } from 'react';
import THREEScene from '../3DScene';
import { Mutation, withApollo, Query } from 'react-apollo';
import mutations from '../../mutations';

import Model from './panels/Model';
import Gaze from './panels/Gaze';
import Action from './panels/Action';
import DownloadXML from './panels/DownloadXML';

import STR from '../../lib/utils/strFuncs';
import actions from './panelActions';

const Panels = [
  props => <Model {...props} />,
  props => <Gaze {...props} />,
  props => <Action {...props} />,
  props => <DownloadXML {...props} />,
];

const { editCreative, uploadModel, creativeXML } = mutations;

const CreativeMaker = props => {
  const { dispatch, creative, reducerState } = props;
  const { currentPanelName, currentPanel, farthestPanel } = reducerState;

  let initialSize = 125;

  if (creative.size === 'small') {
    initialSize = 25;
  } else if (creative.size === 'medium') {
    initialSize = 75;
  }

  const [source, setSource] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [size, setSize] = useState(initialSize);

  const loadFile = event => {
    event.preventDefault();

    const file = event.target.files[0];
    if (file) {
      dispatch({
        type: actions.SET_FILE,
        payload: { panelName: currentPanelName, panelFile: file },
      });

      const type = file.name.substring(file.name.lastIndexOf('.') + 1);
      setFileType(type);

      const userImageURL = URL.createObjectURL(file);
      setSource(userImageURL);
    }
  };

  const renderPanelToggles = () => {
    if (currentPanel > 2) return;

    const toggles = ['Model', 'Gaze', 'Action'];

    return toggles.map((toggle, i) => {
      const panelReached = i <= farthestPanel;
      return (
        <div
          key={toggle}
          role="panel-toggle"
          className={
            currentPanel === i ? 'creative-panel-active' : panelReached ? '' : 'disabled-btn'
          }
          onClick={() =>
            panelReached ? dispatch({ type: actions.SET_CURRENT_PANEL, payload: i }) : null
          }
        >
          {toggle}
        </div>
      );
    });
  };

  return (
    <Mutation mutation={uploadModel} onCompleted={() => console.log('size saved!')}>
      {(uploadModel, { loading: uploadModelLoading }) => (
        <Mutation mutation={editCreative} onCompleted={() => console.log('size saved!')}>
          {(editCreative, { loading: editCreativeLoading }) => (
            <div id="creative-maker">
              <div id="creative-webgl">
                <THREEScene
                  id="creative-3d"
                  source={source}
                  fileType={fileType}
                  panel={currentPanel}
                />
                <div id="creative-size" className="sst">
                  {`Scale size: ${STR.parseSize(size)}`}
                </div>
              </div>

              <div id="creative-panels">
                <div className="creative-panels-toggle">{renderPanelToggles()}</div>

                <div id="creative-panels-content">
                  {Panels[currentPanel]({
                    reducerState,
                    dispatch,
                    creative: creative.id,
                    loadFile,
                    uploadModel,
                    editCreative,
                    size,
                    setSize,
                    loading: { uploadModelLoading, editCreativeLoading },
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
