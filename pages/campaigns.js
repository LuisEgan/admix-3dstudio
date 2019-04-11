import React, { useReducer } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Router from 'next/router';
import queries from '../queries';

import App from '../components/App';
import NewCampaignPopup from '../components/Popups/NewCampaignPopup';

import AdmixLoading from '../components/SVG/AdmixLoading';
import SetupSVG from '../assets/svg/setup.svg';
import InfoSVG from '../assets/svg/info.svg';
import ReportSVG from '../assets/svg/report.svg';

const { campaigns: campaignsQuery } = queries;

const campaignsArr = {
  as1209ejaw0s4jf3490: {
    name: 'NatGeo Mars Season 2',
    status: 'Live',
    owner: 'National Geographic',
  },
  dfb434tfg3qer5g345v: {
    name: 'NatGeo Mars Season 2',
    status: 'Live',
    owner: 'National Geographic',
  },
  '45y4ghbwwec3qervw34': {
    name: 'NatGeo Mars Season 2',
    status: 'Live',
    owner: 'National Geographic',
  },
  '4hy356ujh647uj456hw4': {
    name: 'NatGeo Mars Season 2',
    status: 'Live',
    owner: 'National Geographic',
  },
};

const initialState = {
  showContent: true,
  selectedCampaign: {},
  showPopupNewCampaign: false,
};

let Campaigns = props => {
  const {
    data: { campaigns },
  } = props;

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialState,
  );

  const selectCampaign = ({ cid, redirectTo }) => {
    Router.push(redirectTo);
  };

  const togglePopup = popup => {
    setState({
      [popup]: !state[popup],
    });
  };

  const renderCampaigns = () => {
    return campaigns.map(campaign => {
      const { name, id } = campaign;

      return (
        <div className={`campaign-select-container mb`} key={id}>
          <div id="campaign-select-info" className="text-truncate">
            <div className="engine-logo">
              <img src="https://pbs.twimg.com/media/DxDZAEwWwAEM3C3.jpg" alt="pic" />
            </div>
            <div className="campaign-name">{name}</div>
          </div>
          <div id="campaign-select-buttons">
            <div>
              <div className="campaign-status mb" />
            </div>

            <div>
              <div className="campaign-buttons">
                <button onClick={() => selectCampaign({ cid, redirectTo: '/groups' })}>
                  {<SetupSVG />}
                </button>
                <button onClick={() => selectCampaign({ cid, redirectTo: '/' })}>
                  {<InfoSVG />}
                </button>

                <button onClick={() => selectCampaign({ cid, redirectTo: '/' })}>
                  {<ReportSVG />}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const { showContent, showPopupNewCampaign } = state;

  return (
    <App>
      <div className="step-container" id="campaigns">
        <NewCampaignPopup
          show={showPopupNewCampaign}
          togglePopup={() => togglePopup('showPopupNewCampaign')}
        />

        <div id="apps-header" className="step-title">
          <h3 className="st sc-h3">My apps</h3>
        </div>

        <div id="apps-buttons">
          <button
            id="filter"
            className="mb unselectable blue-btn"
            type="button"
            onClick={() => togglePopup('showPopupNewCampaign')}
          >
            + &nbsp; <span>New campaign</span>
          </button>
        </div>

        {!showContent && <AdmixLoading loadingText="Loading" />}

        {showContent && renderCampaigns()}
      </div>
    </App>
  );
};

const mapStateToProps = state => state;

Campaigns = connect(mapStateToProps)(Campaigns);
Campaigns = graphql(campaignsQuery)(Campaigns);

export default Campaigns;
