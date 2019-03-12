import React from "react";
import { connect } from "react-redux";
import App from "../components/App";

class Campaigns extends React.Component {
  render() {
    return (
      <App>
        <div>Campaigns</div>
      </App>
    );
  }
}

export default connect()(Campaigns);
