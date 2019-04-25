import React, { useReducer } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import queries from '../queries';
import actions from '../lib/actions';
import Link from 'next/link';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';
import EditGroupPopup from '../components/Popups/EditGroupPopup';
import NewGroupPopup from '../components/Popups/NewGroupPopup';
import EditCreativePopup from '../components/Popups/EditCreativePopup';
import NewCreativePopup from '../components/Popups/NewCreativePopup';

import CogSVG from '../assets/svg/cog.svg';
import PlusSVG from '../assets/svg/cross.svg';

const { groupsByCampaign } = queries;
const { setSelected } = actions;

const imagesBank = [
  'https://i.kinja-img.com/gawker-media/image/upload/s--1JGOVben--/c_scale,f_auto,fl_progressive,q_80,w_800/twe4zfllglsnvgopqmeg.png',
  'https://media.mmo-champion.com/images/news/2013/november/Nagrand_Landscape.jpg',
  'http://vgtribune.com/VGTribune/wp-content/uploads/2015/05/env-tuskarr-full-820x380.jpg',
  'https://cdna.artstation.com/p/assets/images/images/000/133/820/large/toby-lewin-paint-318-draenor.jpg?1405392736',
  'https://i.kinja-img.com/gawker-media/image/upload/s--1JGOVben--/c_scale,f_auto,fl_progressive,q_80,w_800/twe4zfllglsnvgopqmeg.png',
];

const initialState = {
  showNewGroup: false,
  showEditGroup: false,
  showNewCreative: false,
  showEditCreative: false,
  clickedGroup: {},
};

let Groups = props => {
  const {
    data: { groupsByCampaign: groups },
    campaign,
    selectCreative,
  } = props;

  // TODO - add images to creatives (cloudinary links in db)
  groups &&
    groups.forEach(group => {
      group.creatives.forEach((creative, i) => {
        group.creatives[i].image = imagesBank[Math.floor(Math.random() * imagesBank.length)];
      });
    });

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialState,
  );

  const togglePopup = (popup, clickedOn) => {
    const { group, creative } = clickedOn || {};
    setState({
      [popup]: !state[popup],
      clickedGroup: group,
      clickedCreative: creative,
    });
  };

  const renderGroup = group => {
    const { name, creatives, id } = group;

    return (
      <div className="group" key={name}>
        <div className="group-name mb">
          {name} &nbsp; <CogSVG onClick={() => togglePopup('showEditGroup', { group })} />
        </div>
        <div className="group-creatives">
          {creatives.map(creative => {
            const { image, name } = creative;
            return (
              <div
                className="group-creative"
                key={name}
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="creative-title">
                  <span>{name}</span>
                  <CogSVG onClick={() => togglePopup('showEditCreative', { creative })} />
                </div>
              </div>
            );
          })}

          <div
            className="group-creative group-creative-new mb"
            onClick={() => togglePopup('showNewCreative', { group: id })}
          >
            <PlusSVG />
            <span>New creative</span>
          </div>
        </div>
      </div>
    );
  };

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
    ];
  };

  return (
    <App>
      <EditGroupPopup
        show={state.showEditGroup}
        togglePopup={() => togglePopup('showEditGroup', { group: state.clickedGroup })}
        group={state.clickedGroup}
      />
      <NewGroupPopup
        show={state.showNewGroup}
        togglePopup={() => togglePopup('showNewGroup')}
        campaign={campaign.id}
      />
      <EditCreativePopup
        show={state.showEditCreative}
        togglePopup={() => togglePopup('showEditCreative', { creative: state.clickedCreative })}
        creative={state.clickedCreative}
      />
      <NewCreativePopup
        show={state.showNewCreative}
        togglePopup={() => togglePopup('showNewCreative')}
        group={state.clickedGroup}
        campaign={campaign.id}
        selectCreative={selectCreative}
      />

      <div className="step-container" id="groups">
        <div id="apps-header" className="step-title">
          <Breadcrumbs breadcrumbs={setBreadcrumbs()} />
          <h3 className="st sc-h3">{campaign.name}</h3>
        </div>

        <div id="groups-content">
          {groups && groups.map(group => renderGroup(group))}
          <button className="blue-btn mb" onClick={() => togglePopup('showNewGroup')}>
            <PlusSVG /> &nbsp; New group
          </button>
        </div>
      </div>
    </App>
  );
};

const mapStateToProps = state => {
  const {
    app: { selectedCampaign: campaign },
  } = state;

  return { campaign };
};
const mapDispatchToProps = dispatch => ({
  selectGroup: groupId => {
    dispatch(setSelected({ selectItem: 'group', value: groupId }));
  },
  selectCreative: creative => {
    dispatch(setSelected({ selectItem: 'creative', value: creative }));
  },
});

const gqlOpts = {
  options: props => {
    const {
      campaign: { id: campaign },
    } = props;
    return {
      variables: { campaign },
    };
  },
};

Groups = graphql(groupsByCampaign, gqlOpts)(Groups);
Groups = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Groups);

export default Groups;
