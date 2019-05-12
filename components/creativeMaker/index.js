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

import admixLogo from '../../assets/img/isologo.png';

const Panels = [
  props => <Model {...props} />,
  props => <Gaze {...props} />,
  props => <Action {...props} />,
  props => <DownloadXML {...props} />,
];

const { editCreative } = mutations;

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
  const totalChecklistSteps = checklistSteps.length;
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
  const [checkListCurrent, setCheckListCurrent] = useState(1);
  const [loading3Dmodel, setLoading3Dmodel] = useState(false);

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
    return file;
  };

  const triggerDownload = () => {
    let a = document.createElement('a');
    a.href = XMLurl;
    a.download = XMLurl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderPanelToggles = () => {
    // if (currentPanel > 2) return;

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
          {stepData => {
            const { accomplished } = stepData;

            return (
              <div className="step clickable" onClick={() => console.log(step)}>
                <img
                  style={{ opacity: accomplished ? 1 : 0.3 }}
                  width="30"
                  src={admixLogo}
                  className={checkListCurrent === i ? 'current-item' : ''}
                />
                <div>{step}</div>
              </div>
            );
          }}
        </Step>
      );
    });

    steps = [
      ...steps,
      <Step transition="scale" position={100} key="final">
        {stepData => {
          const { accomplished } = stepData;
          return (
            <div className="step">
              <button
                className={`blue-btn ${!accomplished && 'disabled-btn'}`}
                disabled={!accomplished}
                onClick={triggerDownload}
              >
                Download XML
              </button>
            </div>
          );
        }}
      </Step>,
    ];

    return steps;
  };

  const handleEditCreativeOnCompleted = callback => {
    callback && callback();
  };

  return (
    <Mutation mutation={editCreative} onCompleted={() => handleEditCreativeOnCompleted()}>
      {(editCreative, { loading: editCreativeLoading }) => (
        <div id="creative-maker">
          <div id="creative-webgl">
            <THREEScene
              id="creative-3d"
              source={source}
              fileType={fileType}
              panel={currentPanel}
              panelPreview3D={panelPreview3D}
              setLoading3Dmodel={setLoading3Dmodel}
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
                        key={`${panel} - ${i}`}
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
                // * General creative maker state
                reducerState,
                dispatch,

                // * Handle 3D model
                loadFile,
                loading3Dmodel,

                // * Edit creative
                creative: creative.id,
                editCreative,
                editCreativeLoading,
                handleEditCreativeOnCompleted,

                // * Handle size, url and checklist
                size,
                setSize,
                setXMLurl,
                XMLurl,
                setCheckListDone,
                setCheckListCurrent,
              })}
            </div>
          </div>

          <div id="creative-panels-checklist">
            <div className="creative-panels-headers sst cc">Checklist</div>

            <ProgressBar
              percent={(100 / totalChecklistSteps) * checkListDone}
              filledBackground="linear-gradient(to right, #a3d4f5, #157cc1)"
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
  );
};

export default withApollo(CreativeMaker);
