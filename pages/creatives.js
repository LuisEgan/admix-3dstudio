import React, { useState } from 'react';
import { connect } from 'react-redux';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';
import CreativeMaker from '../components/creativeMaker';

const fbx = '/static/models/fbx/SambaDancing.fbx';

let Creatives = props => {
  const { creative } = props;

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
      <div className="step-container" id="creatives">
        <div id="apps-header" className="step-title">
          <Breadcrumbs breadcrumbs={setBreadcrumbs()} />
          <h3 className="st sc-h3">Groups</h3>
        </div>

        <div id="creatives-content">
          <CreativeMaker creative={creative} />
        </div>
      </div>
    </App>
  );
};

const mapStateToProps = state => {
  const {
    app: { selectedCreative: creative },
  } = state;

  return { creative };
};
const mapDispatchToProps = dispatch => ({});

const gqlOpts = {
  options: props => {
    const { campaign } = props;
    return {
      variables: { campaign },
    };
  },
};

// Creatives = graphql(groupsByCampaign, gqlOpts)(Groups);
Creatives = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Creatives);

export default Creatives;
