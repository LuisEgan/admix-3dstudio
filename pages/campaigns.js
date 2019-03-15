import React, { Component } from "react";
import { connect } from "react-redux";
import Router from "next/router";

import App from "../components/App";
import NewCampaignPopup from "../components/Popups/NewCampaignPopup";

import AdmixLoading from "../components/SVG/AdmixLoading";
import SetupSVG from "../assets/svg/setup.svg";
import InfoSVG from "../assets/svg/info.svg";
import ReportSVG from "../assets/svg/report.svg";

const campaigns = {
  as1209ejaw0s4jf3490: {
    name: "NatGeo Mars Season 2",
    status: "Live",
    owner: "National Geographic",
  },
  dfb434tfg3qer5g345v: {
    name: "NatGeo Mars Season 2",
    status: "Live",
    owner: "National Geographic",
  },
  "45y4ghbwwec3qervw34": {
    name: "NatGeo Mars Season 2",
    status: "Live",
    owner: "National Geographic",
  },
  "4hy356ujh647uj456hw4": {
    name: "NatGeo Mars Season 2",
    status: "Live",
    owner: "National Geographic",
  },
};
class Campaigns extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      showContent: true,
      selectedCampaign: {},
      showPopupNewCampaign: false,
    };
  }

  selectCampaign = ({ cid, redirectTo }) => {
    console.log("cid: ", cid);
    Router.push(redirectTo);
  };

  togglePopup = popup => {
    this.setState({ [popup]: !this.state[popup] });
  };

  renderCampaigns() {
    const toRender = [];

    for (let cid in campaigns) {
      const { name, status, owner } = campaigns[cid];

      const itemToRender = (
        <div className={`campaign-select-container mb`} key={cid}>
          <div id="campaign-select-info" className="text-truncate">
            <div className="engine-logo">
              <img
                src="https://pbs.twimg.com/media/DxDZAEwWwAEM3C3.jpg"
                alt="pic"
              />
            </div>
            <div className="campaign-name">{name}</div>
          </div>
          <div id="campaign-select-buttons">
            <div>
              <div className="campaign-status mb" />
            </div>

            <div>
              <div className="campaign-buttons">
                <button
                  onClick={() =>
                    this.selectCampaign({ cid, redirectTo: "/groups" })
                  }
                >
                  {<SetupSVG />}
                </button>
                <button
                  onClick={() => this.selectCampaign({ cid, redirectTo: "/" })}
                >
                  {<InfoSVG />}
                </button>

                <button
                  onClick={() => this.selectCampaign({ cid, redirectTo: "/" })}
                >
                  {<ReportSVG />}
                </button>
              </div>
            </div>
          </div>
        </div>
      );

      toRender.push(itemToRender);
    }

    return toRender;
  }

  render() {
    const { showContent, showPopupNewCampaign } = this.state;

    return (
      <App>
        <div className="step-container" id="campaigns">
          <NewCampaignPopup
            show={showPopupNewCampaign}
            togglePopup={() => this.togglePopup("showPopupNewCampaign")}
          />

          <div id="apps-header" className="step-title">
            <h3 className="st sc-h3">My apps</h3>
          </div>

          <div id="apps-buttons">
            <button
              id="filter"
              className="mb unselectable blue-btn"
              type="button"
              onClick={() => this.togglePopup("showPopupNewCampaign")}
            >
              +<span>New campaign</span>
            </button>
          </div>

          {!showContent && <AdmixLoading loadingText="Loading" />}

          {showContent && this.renderCampaigns()}
        </div>
      </App>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Campaigns);
