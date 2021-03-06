import React, { useReducer } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import queries from 'queries';
import actions from 'lib/actions';
import Link from 'next/link';

import App from 'components/App';
import Breadcrumbs from 'components/Breadcrumbs';
import EditGroupPopup from 'components/Popups/EditGroupPopup';
import NewGroupPopup from 'components/Popups/NewGroupPopup';
import EditCreativePopup from 'components/Popups/EditCreativePopup';
import NewCreativePopup from 'components/Popups/NewCreativePopup';
import Button from 'components/Button';

import PlusSVG from '../assets/svg/cross.svg';

import { GroupsTheme } from 'themes';

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
    data: { loading, groupsByCampaign: groups },
    campaign,
    selectCreative,
  } = props;

  // TODO - add images to creatives (cloudinary links in db)
  groups &&
    groups.forEach(group => {
      group.creatives.forEach((creative, i) => {
        const imageIndex = i < imagesBank.length ? i : i % imagesBank.length;
        group.creatives[i].image = imagesBank[imageIndex];
      });
    });

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialState,
  );

  const handleSelectCreative = creative => () => {
    selectCreative(creative);
    Router.push('/creatives');
  };

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
        <div className="group-container mb">
          <span className="group-name">{name}</span>
          <FontAwesomeIcon
            icon={faCog}
            className="editGroup"
            onClick={() => togglePopup('showEditGroup', { group })}
          />
        </div>
        <div className="group-creatives">
          {creatives.map(creative => {
            const { image, name } = creative;
            creative.group = { name: group.name, id: group.id };
            return (
              <div
                className="group-creative"
                key={name}
                style={{ backgroundImage: `url(${image})` }}
                onClick={handleSelectCreative(creative)}
              >
                <div className="creative-title mb">
                  <span>{name}</span>
                  <FontAwesomeIcon
                    icon={faCog}
                    onClick={e => {
                      e.stopPropagation();
                      togglePopup('showEditCreative', { creative });
                    }}
                  />
                </div>
              </div>
            );
          })}

          <div
            className="group-creative group-creative-new mb"
            onClick={() => togglePopup('showNewCreative', { group: id })}
          >
            <FontAwesomeIcon icon={faPlus} size="3x" />
            <span className="title">New creative</span>
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
    <GroupsTheme>
      <App>
        <EditGroupPopup
          show={state.showEditGroup}
          togglePopup={() => togglePopup('showEditGroup', { group: state.clickedGroup })}
          group={state.clickedGroup}
          campaign={campaign.id}
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
          campaign={campaign.id}
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
            {loading && (
              <div>
                <FontAwesomeIcon className="loading" icon={faSpinner} spin />
                Loading...
              </div>
            )}
            {groups && groups.map(group => renderGroup(group))}
            {groups && (
              <Button icon={faPlus} onClick={() => togglePopup('showNewGroup')} size="large">
                New group
              </Button>
            )}
          </div>
        </div>
      </App>
    </GroupsTheme>
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
