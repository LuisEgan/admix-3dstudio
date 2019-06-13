/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import THREEScene from '../3DScene';
import { Mutation, withApollo } from 'react-apollo';
import { ProgressBar, Step } from 'react-step-progress-bar';
import mutations from 'mutations';

import Model from './panels/model';
import Gaze from './panels/gaze';
import Action from './panels/action';
import DownloadXML from './panels/DownloadXML';

import STR from 'lib/utils/strFuncs';
import actions from './panelActions';

import admixLogo from '../../assets/img/isologo.png';
import ChecklistPending from '../../assets/svg/checked-NO.svg';
import ChecklistDone from '../../assets/svg/checked-YES.svg';
import { PANELS } from 'lib/utils/constants';
import Button from 'components/Button';

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

const panelsNames = ['Model', 'Gaze', 'Action'];
let initialSize = 125;

const CreativeMaker = props => {
  const { dispatch, creative, reducerState } = props;
  const { currentPanelName, currentPanel, farthestPanel, panelPreview3D } = reducerState;
  const totalChecklistSteps = checklistSteps.length;
  const stepPositions = [...checklistSteps.map((s, i) => (100 / totalChecklistSteps) * i), 100];

  if (creative.size === 'small') {
    initialSize = 25;
  } else if (creative.size === 'medium') {
    initialSize = 75;
  }

  const [source, setSource] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [size, setSize] = useState(initialSize);
  const [XMLurl, setXMLurl] = useState('');
  const [accomplished, setAccomplished] = useState(false);

  // * check list steps done
  const [checkListDone, setCheckListDone] = useState(0);
  // * panel view according to checklist
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

    const _handleToggleOnClick = (toggle, panelReached) => {
      let newChecklistCurrent;

      switch (toggle) {
        case 1:
          newChecklistCurrent = 3;
          break;
        case 2:
          newChecklistCurrent = 4;
          break;
        default:
          newChecklistCurrent = 2;
      }

      if (panelReached) {
        dispatch({ type: actions.SET_CURRENT_PANEL, payload: toggle });
        setCheckListCurrent(newChecklistCurrent);
      }
    };

    return panelsNames.map((toggle, i) => {
      const panelReached = i <= farthestPanel;
      const toggleStyle = panelReached ? {} : { color: '#f2f2f2' };

      return (
        <div
          key={toggle}
          role="panel-toggle"
          className={`panel-toggle ${currentPanel === i ? 'creative-panel-active' : ''}`}
          style={toggleStyle}
          onClick={() => _handleToggleOnClick(i, panelReached)}
        >
          <span className="panel-toggle-text">{toggle}</span>
          {i !== panelsNames.length - 1 && <div className="panel-toggle-arrow" />}
        </div>
      );
    });
  };

  const renderChecklistSteps = () => {
    const _handleStepOnClick = stepNum => {
      if (checkListDone + 1 < stepNum || stepNum === 0) return;

      setCheckListCurrent(stepNum);

      let newPanel = null;

      switch (stepNum) {
        case 3:
          newPanel = PANELS.GAZE;
          break;
        case 4:
        case 5:
          newPanel = PANELS.ACTION;
          break;
        default:
          newPanel = 0;
      }

      dispatch({ type: actions.SET_CURRENT_PANEL, payload: newPanel });
    };

    let steps = checklistSteps.map((step, i) => {
      return (
        <Step transition="scale" key={step} position={(100 / totalChecklistSteps) * i}>
          {stepData => {
            return (
              <div className="step clickable" onClick={() => _handleStepOnClick(i)}>
                {/* <img
                  style={{ opacity: accomplished ? 1 : 0.3 }}
                  width="30"
                  src={checklistPending}

                /> */}
                {i <= checkListDone ? (
                  <ChecklistDone className={checkListCurrent === i ? 'current-item' : ''} />
                ) : (
                  <ChecklistPending className={checkListCurrent === i ? 'current-item' : ''} />
                )}
                <div>{step}</div>
              </div>
            );
          }}
        </Step>
      );
    });

    steps = [
      ...steps,
      <Step position={100} key="final">
        {stepData => {
          const { accomplished } = stepData;
          setAccomplished(accomplished);
          return <div className="step" />;
        }}
      </Step>,
    ];

    return steps;
  };

  const updateChecklistDone = newChecklistItemNum => {
    // * update checklist only if the new check hasn't been done
    if (checkListDone < newChecklistItemNum) setCheckListDone(newChecklistItemNum);
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
                        size="small"
                        onClick={() => dispatch({ type: actions.SET_PREVIEW_3D, payload: i })}
                        className={`white-btn preview-btn ${
                          panelPreview3D === i ? '' : 'inactive-btn'
                        }`}
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

                // * Handle size and url
                size,
                setSize,
                setXMLurl,
                XMLurl,

                // * Handle checklist
                checkListCurrent,
                updateChecklistDone,
                setCheckListCurrent,
              })}
            </div>
          </div>

          <div id="creative-panels-checklist">
            <div className="creative-panels-headers cc">
              <b>Checklist</b>
            </div>

            <ProgressBar
              percent={(100 / totalChecklistSteps) * checkListDone}
              filledBackground="linear-gradient(to right, #a3d4f5, #157cc1)"
              className="progressBar"
              stepPositions={stepPositions}
              height={2} // height because the bar is rotated 90deg
            >
              {renderChecklistSteps()}
            </ProgressBar>
            <div className="downloadXMLContainer">
              <Button
                className={`downloadXML ${!accomplished && 'disabled-btn'}`}
                disabled={!accomplished}
                onClick={triggerDownload}
              >
                {currentPanel === PANELS.DOWNLOAD && !accomplished ? 'Loading...' : 'Download XML'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(CreativeMaker);
