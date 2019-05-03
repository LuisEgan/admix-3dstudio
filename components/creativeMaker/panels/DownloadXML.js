import React from 'react';

const DownloadXML = props => {
  const { XMLurl } = props;
  console.log('XMLurl: ', XMLurl);

  const handleDownload = () => {};

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
          <a className="blue-btn" href={XMLurl}>
            Download XML
          </a>
        </div>
      </div>
    </div>
  );
};

export default DownloadXML;
