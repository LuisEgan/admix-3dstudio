import React, { useReducer } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import queries from 'queries';
import actions from 'lib/actions';

import App from 'components/App';
import Button from 'components/Button';
import NewCampaignPopup from 'components/Popups/NewCampaignPopup';

import AdmixLoading from 'components/SVG/AdmixLoading';
import { CampaignsTheme } from 'themes';

const { campaignsByUser } = queries;
const { setSelected } = actions;

const initialState = {
  showContent: true,
  selectedCampaign: {},
  showPopupNewCampaign: false,
};

let Campaigns = props => {
  const {
    data: { loading, campaignsByUser: campaigns },
    userId,
  } = props;

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialState,
  );

  const selectCampaign = ({ campaign, redirectTo }) => {
    const { selectCampaign } = props;
    selectCampaign(campaign);
    Router.push(redirectTo);
  };

  const togglePopup = popup => {
    setState({
      [popup]: !state[popup],
    });
  };

  const renderCampaigns = () => {
    if (loading)
      return (
        <div>
          <FontAwesomeIcon className="loading" icon={faSpinner} spin />
          Loading...
        </div>
      );

    return (campaigns || []).map(campaign => {
      const { id, name, advertiser } = campaign;

      return (
        <div className={`campaign-select-container mb`} key={id}>
          <div id="campaign-select-info" className="text-truncate">
            <div className="engine-logo">
              <img src="https://pbs.twimg.com/media/DxDZAEwWwAEM3C3.jpg" alt="pic" />
            </div>
            <div className="campaign-name">{name}</div>
            <div className="campaign-status mb cc">{advertiser}</div>
          </div>
          <div id="campaign-select-buttons">
            <div />

            <div>
              <div className="campaign-buttons">
                <button onClick={() => selectCampaign({ campaign, redirectTo: '/groups' })}>
                  Edit
                </button>
                {/* <button onClick={() => selectCampaign({ campaign, redirectTo: '/groups' })}>
                  {<SetupSVG />}
                </button>
                <button onClick={() => selectCampaign({ campaign, redirectTo: '/' })}>
                  {<InfoSVG />}
                </button>

                <button onClick={() => selectCampaign({ campaign, redirectTo: '/' })}>
                  {<ReportSVG />}
                </button> */}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const { showContent, showPopupNewCampaign } = state;

  return (
    <CampaignsTheme>
      <App>
        <div className="step-container" id="campaigns">
          <NewCampaignPopup
            show={showPopupNewCampaign}
            togglePopup={() => togglePopup('showPopupNewCampaign')}
            userId={userId}
          />

          <div id="apps-header" className="step-title">
            <h3 className="st sc-h3">My campaigns</h3>
          </div>

          <div id="apps-buttons">
            <Button icon={faPlus} onClick={() => togglePopup('showPopupNewCampaign')}>
              New campaign
            </Button>
          </div>

          {!showContent && <AdmixLoading loadingText="Loading" />}

          {showContent && renderCampaigns()}
        </div>
      </App>
    </CampaignsTheme>
  );
};

const mapStateToProps = state => {
  const {
    auth: { userId },
  } = state;

  return { userId };
};
const mapDispatchToProps = dispatch => ({
  selectCampaign: campaign => {
    dispatch(setSelected({ selectItem: 'campaign', value: campaign }));
  },
});

const gqlOpts = {
  options: props => {
    const { userId: user } = props;
    return {
      variables: { user },
    };
  },
};

Campaigns = graphql(campaignsByUser, gqlOpts)(Campaigns);
Campaigns = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Campaigns);

export default Campaigns;
