/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import THREEScene from '../3DScene';
import { Mutation, withApollo } from 'react-apollo';
import { ProgressBar, Step } from 'react-step-progress-bar';
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

const { editCreative, uploadModel } = mutations;

const checklistSteps = [
  'campaign setup',
  'base model uploaded',
  'model size set',
  'gaze animation set',
  'action animation set',
  'ad generated',
];

const CreativeMaker = props => {
  const { dispatch, creative, reducerState } = props;
  const { currentPanelName, currentPanel, farthestPanel, panelPreview3D } = reducerState;
  const panelsNames = ['Model', 'Gaze', 'Action'];
  const totalChecklistSteps = checklistSteps.length + 1;
  const stepPositions = [...checklistSteps.map((s, i) => (100 / totalChecklistSteps) * i), 100];

  let initialSize = 125;

  if (creative.size === 'small') {
    initialSize = 25;
  } else if (creative.size === 'medium') {
    initialSize = 75;
  }

  const [source, setSource] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [size, setSize] = useState(initialSize);
  const [XMLurl, setXMLurl] = useState('');
  const [checkListDone, setCheckListDone] = useState(0);

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

    return panelsNames.map((toggle, i) => {
      const panelReached = i <= farthestPanel;
      return (
        <div
          key={toggle}
          role="panel-toggle"
          className={currentPanel === i ? 'creative-panel-active' : ''}
          onClick={() =>
            panelReached ? dispatch({ type: actions.SET_CURRENT_PANEL, payload: i }) : null
          }
        >
          {toggle}
        </div>
      );
    });
  };

  const renderChecklistSteps = () => {
    let steps = checklistSteps.map((step, i) => {
      return (
        <Step transition="scale" key={step} position={(100 / totalChecklistSteps) * i}>
          {({ accomplished }) => (
            <div className="step">
              <img
                style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                width="30"
                src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851"
              />
              <div>{step}</div>
            </div>
          )}
        </Step>
      );
    });

    steps = [
      ...steps,
      <Step transition="scale">
        {({ accomplished }) => (
          <div className="step">
            <button
              className={`blue-btn ${checkListDone < 7 && 'disabled-btn'}`}
              disabled={checkListDone !== 7}
            >
              Download XML
            </button>
          </div>
        )}
      </Step>,
    ];

    return steps;
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
                  panelPreview3D={panelPreview3D}
                />
                <div id="creative-size" className="sst">
                  {currentPanel !== 3 ? (
                    <div id="creative-size-text" className="mb">{`Scale size: ${STR.parseSize(
                      size,
                    )}`}</div>
                  ) : (
                    <React.Fragment>
                      {panelsNames.map((panel, i) => {
                        return (
                          <button
                            key={panel}
                            onClick={() => dispatch({ type: actions.SET_PREVIEW_3D, payload: i })}
                            className={panelPreview3D === i ? 'blue-btn' : 'white-btn'}
                          >
                            {`Preview ${panel}`}
                          </button>
                        );
                      })}
                    </React.Fragment>
                  )}
                </div>
              </div>

              <div id="creative-panels">
                <div className="creative-panels-headers">{renderPanelToggles()}</div>

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
                    setXMLurl,
                    XMLurl,
                    setCheckListDone,
                  })}
                </div>
              </div>

              <div id="creatives-panels-checklist">
                <div className="creative-panels-headers sst cc">Checklist</div>

                <ProgressBar
                  percent={(100 / totalChecklistSteps) * checkListDone}
                  filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
                  className="progressBar"
                  stepPositions={stepPositions}
                  height={2} // height because the bar is rotated 90deg
                >
                  {renderChecklistSteps()}
                </ProgressBar>
              </div>
            </div>
          )}
        </Mutation>
      )}
    </Mutation>
  );
};

export default withApollo(CreativeMaker);
