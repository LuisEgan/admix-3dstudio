import React, { useReducer, useEffect } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';
import CreativeMaker from '../components/creativeMaker';

import actions from '../components/creativeMaker/panelActions';

const panelNames = ['model', 'gaze', 'action', 'download'];

const initialPanel = 0;
const initialState = {
  currentPanel: initialPanel,
  currentPanelName: panelNames[initialPanel],
  currentChecklistItem: 1,
  farthestPanel: initialPanel,
  lastPanel: initialPanel,
  panelPreview3D: initialPanel,
  visited: { model: true, gaze: false, action: false, download: false },
  hadBeenVisited: { model: true, gaze: false, action: false, download: false },
  file: { model: null, gaze: null, action: null },
};

const reducer = (state, action) => {
  const { type, payload } = action;
  const { panelName, panelFile } = payload;
  // console.warn('type: ', type);
  // console.warn('payload: ', payload);
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
        hadBeenVisited: { ...state.visited, [panelNames[state.lastPanel]]: true },
      };

    case actions.SET_PREVIEW_3D:
      return { ...state, panelPreview3D: payload };

    case actions.SET_CURRENT_CHECKLIST_ITEM:
      return { ...state, currentChecklistItem: payload };

    case actions.SET_FILE:
      return { ...state, file: { ...state.file, [panelName]: panelFile } };

    default:
  }
};

let Creatives = props => {
  const { campaign, creative } = props;

  const [reducerState, dispatch] = useReducer(reducer, initialState);

  let returnToCampaigns = false;
  if (!Object.entries(campaign).length) {
    returnToCampaigns = true;
  }

  useEffect(() => {
    if (returnToCampaigns) {
      Router.push('/campaigns');
    }
  }, []);

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
        title: creative.group && creative.group.name,
        route: '/groups',
      },
      {
        title: creative.name,
        route: '/creatives',
      },
    ];
  };

  if (returnToCampaigns) return null;
  return (
    <App>
      <div className="step-container" id="creatives">
        <div id="apps-header" className="step-title">
          <Breadcrumbs breadcrumbs={setBreadcrumbs()} />
          <div id="creative-title">
            <h3 className="st sc-h3">{creative.name}</h3>
          </div>
        </div>

        <div id="creative-content">
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
