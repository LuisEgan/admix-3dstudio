import React, { useEffect } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import actions from '../../../lib/actions';

const { resetSelected } = actions;

let DownloadXML = props => {
  const { resetSelected, XMLurl, reducerState } = props;
  const { hadBeenVisited } = reducerState;

  let link;

  useEffect(() => {
    XMLurl && !hadBeenVisited.download && link.click();
  }, []);

  const handleGoToCampaigns = () => {
    resetSelected();
    Router.push('/campaigns');
  };

  return (
    <div id="creative-panel">
      <div id="creative-panel-content" className="mb" style={{ padding: '25px' }}>
        <span className="st">Beautiful!</span>
        <p>
          Your 3D ad unit has been succesfully generated and the model is safely uploaded on our
          servers. You can preview it on the left side of this page.
        </p>
        <span className="sst">Instructions</span>
        <p>
          To serve the ad within Admix inventory, download the XML file below and add it as a tag in
          your DSP.
        </p>
        <button className="white-btn" onClick={handleGoToCampaigns}>
          My campaigns
        </button>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  resetSelected: () => {
    dispatch(resetSelected());
  },
});

DownloadXML = connect(
  null,
  mapDispatchToProps,
)(DownloadXML);

export default DownloadXML;
