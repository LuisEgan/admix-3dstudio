import React, { useState, useEffect, useReducer } from 'react';
import { connect } from 'react-redux';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';
import CreativeMaker from '../components/creativeMaker';

import actions from '../components/creativeMaker/panelActions';

const panelNames = ['model', 'gaze', 'action', 'download'];

const initialState = {
  currentPanel: 0,
  currentPanelName: panelNames[0],
  farthestPanel: 0,
  lastPanel: 0,
  panelPreview3D: 0,
  visited: { model: true, gaze: false, action: false, download: false },
  file: { model: null, gaze: null, action: null },
};

const reducer = (state, action) => {
  const { type, payload } = action;
  console.warn('type: ', type);
  switch (type) {
    case actions.SET_CURRENT_PANEL:
      const { currentPanel, farthestPanel } = state;
      return {
        ...state,
        currentPanel: payload,
        currentPanelName: panelNames[payload],
        lastPanel: currentPanel,
        farthestPanel: payload > farthestPanel ? payload : farthestPanel,
        visited: { ...state.visited, [panelNames[payload]]: true },
      };

    case actions.SET_PREVIEW_3D:
      return { ...state, panelPreview3D: payload };

    case actions.SET_FILE:
      const { panelName, panelFile } = payload;
      return { ...state, file: { ...state.file, [panelName]: panelFile } };

    default:
  }
};

let Creatives = props => {
  const { campaign, creative } = props;

  const [reducerState, dispatch] = useReducer(reducer, initialState);
  console.log('reducerState: ', reducerState);

  const { currentPanel, farthestPanel } = reducerState;

  const setBreadcrumbs = () => {
    return [
      {
        title: 'My campaigns',
        route: '/campaigns',
      },
      {
        title: campaign.name,
        route: '/groups',
      },
      {
        title: creative.group.name,
        route: '/groups',
      },
      {
        title: creative.name,
        route: '/creatives',
      },
    ];
  };

  return (
    <App>
      <div className="step-container" id="creatives">
        <div id="apps-header" className="step-title">
          <Breadcrumbs breadcrumbs={setBreadcrumbs()} />
          <div id="creatives-title">
            <h3 className="st sc-h3">{creative.name}</h3>
            <div className="creative-panels-toggle">
              <div
                className={currentPanel < 3 ? 'creative-panel-active' : ''}
                onClick={() => dispatch({ type: actions.SET_CURRENT_PANEL, payload: 0 })}
              >
                Edit
              </div>
              <div
                className={
                  currentPanel === 3
                    ? 'creative-panel-active'
                    : farthestPanel === 3
                    ? ''
                    : 'disabled-btn'
                }
                onClick={() =>
                  farthestPanel === 3
                    ? dispatch({ type: actions.SET_CURRENT_PANEL, payload: 3 })
                    : null
                }
              >
                Download
              </div>
            </div>
          </div>
        </div>

        <div id="creatives-content">
          <CreativeMaker reducerState={reducerState} dispatch={dispatch} creative={creative} />
        </div>
      </div>
    </App>
  );
};

const mapStateToProps = state => {
  const {
    app: { selectedCampaign: campaign, selectedCreative: creative },
  } = state;

  return { campaign, creative };
};

Creatives = connect(mapStateToProps)(Creatives);

export default Creatives;
