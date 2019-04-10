import React, { useState } from 'react';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';

import THREEScene from '../components/3DScene';

const fbx = '/static/models/fbx/SambaDancing.fbx';

const Creatives = props => {
  const [source, setSource] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [objectScale, setObjectScale] = useState(1);

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

    let file = event.target.files[0];
    if (file) {
      const type = file.name.substring(file.name.lastIndexOf('.') + 1);
      setFileType(type);

      let userImageURL = URL.createObjectURL(file);
      setSource(userImageURL);
    }
  };

  const reScale = e => {
    const {
      target: { value },
    } = e;
    setObjectScale(value);
  };

  return (
    <App>
      <div className="step-container" id="creatives">
        <div id="apps-header" className="step-title">
          <Breadcrumbs breadcrumbs={setBreadcrumbs()} />
          <h3 className="st sc-h3">Groups</h3>
        </div>

        <div id="creatives-content">
          <THREEScene
            id="creative-3d"
            source={source}
            fileType={fileType}
            objectScale={objectScale}
          />
          <input type="file" onChange={handleFile} /> File
          <input type="range" min="-100" max="100" value={objectScale} onChange={reScale} />
        </div>
      </div>
    </App>
  );
};

export default Creatives;
