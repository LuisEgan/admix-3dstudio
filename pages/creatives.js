import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import App from '../components/App';
import Breadcrumbs from '../components/Breadcrumbs';
import CreativeMaker from '../components/creativeMaker';

const fbx = '/static/models/fbx/SambaDancing.fbx';

let Creatives = props => {
  const { creative } = props;

  const [panel, setPanel] = useState(0);
  const [reachedDownload, setReachedDownload] = useState(false);

  useEffect(() => {
    if (!reachedDownload && panel === 3) {
      setReachedDownload(true);
    }
  });

  const setBreadcrumbs = () => {
    return [
      {
        title: 'My campaigns',
        route: '/campaigns',
      },
      {
        title: creative.group.name,
        route: '/groups',
      },
      {
        title: creative.name,
        route: '/creatives',
      },
    ];
  };

  return (
    <App>
      <div className="step-container" id="creatives">
        <div id="apps-header" className="step-title">
          <Breadcrumbs breadcrumbs={setBreadcrumbs()} />
          <div id="creatives-title">
            <h3 className="st sc-h3">{creative.name}</h3>
            <div className="creative-panels-toggle">
              <div className={panel < 3 ? 'creative-panel-active' : ''} onClick={() => setPanel(0)}>
                Edit
              </div>
              <div
                className={
                  panel === 3 ? 'creative-panel-active' : reachedDownload ? '' : 'disabled-btn'
                }
                onClick={() => (reachedDownload ? setPanel(3) : null)}
              >
                Download
              </div>
            </div>
          </div>
        </div>

        <div id="creatives-content">
          <CreativeMaker creative={creative} panel={panel} setPanel={setPanel} />
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

Creatives = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Creatives);

export default Creatives;
