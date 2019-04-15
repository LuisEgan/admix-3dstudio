import React, { useReducer } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import queries from '../queries';
import actions from '../lib/actions';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';
import EditGroupPopup from '../components/Popups/EditGroupPopup';
import NewGroupPopup from '../components/Popups/NewGroupPopup';
import EditCreativePopup from '../components/Popups/EditCreativePopup';
import NewCreativePopup from '../components/Popups/NewCreativePopup';

import CogSVG from '../assets/svg/cog.svg';
import PlusSVG from '../assets/svg/cross.svg';

const { groupById } = queries;
const { setSelected } = actions;

const dbGroups = [
  {
    name: 'Group 1',
    creatives: [
      {
        image:
          'https://i.kinja-img.com/gawker-media/image/upload/s--1JGOVben--/c_scale,f_auto,fl_progressive,q_80,w_800/twe4zfllglsnvgopqmeg.png',
        name: 'Creative 1',
      },
      {
        image: 'https://media.mmo-champion.com/images/news/2013/november/Nagrand_Landscape.jpg',
        name: 'Creativesaaaaaaaaaaa aaaaaa aaaaaaaaaaaaaaaa a2',
      },
      {
        image:
          'http://vgtribune.com/VGTribune/wp-content/uploads/2015/05/env-tuskarr-full-820x380.jpg',
        name: 'Creative 3',
      },
    ],
  },
  {
    name: 'Group 2',
    creatives: [
      {
        image:
          'https://cdna.artstation.com/p/assets/images/images/000/133/820/large/toby-lewin-paint-318-draenor.jpg?1405392736',
        name: 'Creativesaaaaaa  aaaaaaaaaaaaaa a2',
      },
      {
        image:
          'https://i.kinja-img.com/gawker-media/image/upload/s--1JGOVben--/c_scale,f_auto,fl_progressive,q_80,w_800/twe4zfllglsnvgopqmeg.png',
        name: 'Creative x',
      },
      {
        image:
          'http://vgtribune.com/VGTribune/wp-content/uploads/2015/05/env-tuskarr-full-820x380.jpg',
        name: 'Creative 3234',
      },
      {
        image: 'https://media.mmo-champion.com/images/news/2013/november/Nagrand_Landscape.jpg',
        name: 'Creativesaaaaaaaa aaaaaa aaaaaaaaaaaaaaaaa a2',
      },
    ],
  },
];

const initialState = {
  showNewGroup: false,
  showEditGroup: false,
  showNewCreative: false,
  showEditCreative: false,
  clickedGroup: {},
};

let Groups = props => {
  // console.log('props: ', props);
  const {
    data: { groups },
  } = props;

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
    const { name, creatives } = group;

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
            onClick={() => togglePopup('showNewCreative')}
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
        title: 'NatGeo Mars Season 2',
        route: '/groups',
      },
      {
        title: 'Edit',
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
      <NewGroupPopup show={state.showNewGroup} togglePopup={() => togglePopup('showNewGroup')} />
      <EditCreativePopup
        show={state.showEditCreative}
        togglePopup={() => togglePopup('showEditCreative', { creative: state.clickedCreative })}
        creative={state.clickedCreative}
      />
      <NewCreativePopup
        show={state.showNewCreative}
        togglePopup={() => togglePopup('showNewCreative')}
      />

      <div className="step-container" id="groups">
        <div id="apps-header" className="step-title">
          <Breadcrumbs breadcrumbs={setBreadcrumbs()} />
          <h3 className="st sc-h3">Groups</h3>
        </div>

        <div id="groups-content">
          {dbGroups.map(group => renderGroup(group))}
          <button className="blue-btn mb" onClick={() => togglePopup('showNewGroup')}>
            <PlusSVG /> &nbsp; New group
          </button>
        </div>
      </div>
    </App>
  );
};

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  selectGroup: groupId => {
    dispatch(setSelected({ selectItem: 'group', value: groupId }));
  },
});

const gqlOpts = {
  options: props => {
    console.log('props: ', props);
    return {
      // variables: { id },
    };
  },
};

Groups = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Groups);
Groups = graphql(groupById, gqlOpts)(Groups);

export default Groups;
