import React, { useEffect } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import actions from '../../../lib/actions';

const { resetSelected } = actions;

let DownloadXML = props => {
  const { resetSelected, XMLurl } = props;
  let link;

  useEffect(() => {
    XMLurl && link.click();
  }, []);

  const handleGoToCampaigns = () => {
    resetSelected();
    Router.push('/campaigns');
  };

  return (
    <div className="creative-panel">
      <div>
        <div>
          <h3>Beautiful!</h3>
          <br />
          <br />
          <div>
            Your 3D ad unit has been succesfully generated and the model is safely uploaded on our
            servers. You can preview it on the left side of this page.
            <br />
            <br />
            <h5>Instructions</h5>
            <br />
            <span>
              To serve the ad within Admix inventory, download the XML file below and add it as a
              tag in your DSP.
            </span>
          </div>
        </div>
        <div>
          <a ref={i => (link = i)} className="blue-btn" href={XMLurl} target="_blank">
            Download XML again
          </a>

          <br />
          <br />

          <button className="white-btn" onClick={handleGoToCampaigns}>
            My campaigns
          </button>
        </div>
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
