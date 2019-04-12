import React, { useState } from 'react';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';
import CreativeMaker from '../components/creativeMaker';

const fbx = '/static/models/fbx/SambaDancing.fbx';

const Creatives = props => {
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
          <CreativeMaker />
        </div>
      </div>
    </App>
  );
};

export default Creatives;
