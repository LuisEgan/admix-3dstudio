import React, { useState } from 'react';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';

import THREEScene from '../components/3DScene';

const fbx = '/static/models/fbx/SambaDancing.fbx';

const Groups = props => {
  const [source, setSource] = useState(null);

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

  const handleFile = event => {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];
    let userImageURL = URL.createObjectURL(file);
    setSource(userImageURL);

    reader.onloadend = () => {};
  };

  return (
    <App>
      <div className="step-container" id="creatives">
        <div id="apps-header" className="step-title">
          <Breadcrumbs breadcrumbs={setBreadcrumbs()} />
          <h3 className="st sc-h3">Groups</h3>
        </div>

        <div id="creatives-content">
          <THREEScene id="creative-3d" source={source} />
          <input type="file" onChange={handleFile} /> File
        </div>
      </div>
    </App>
  );
};

export default Groups;
