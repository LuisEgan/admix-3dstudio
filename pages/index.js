import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import clockActions from "../lib/actions/clock";

import App from "../components/App";
import Header from "../components/Header";
import Page from "../components/Page";
import Submit from "../components/Submit";
import PostList from "../components/PostList";
import withApollo from "../lib/withApollo";

const { startClock, addCount, serverRenderClock } = clockActions;

class Index extends React.Component {
  // static getInitialProps({ store, isServer }) {
  //   store.dispatch(serverRenderClock(isServer));
  //   store.dispatch(addCount());

  //   return { isServer };
  // }

  componentDidMount() {
    // this.timer = this.props.startClock();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <App>
        {/* <Page title="Index" />
        <Submit />
        <PostList /> */}
      </App>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addCount: bindActionCreators(addCount, dispatch),
    startClock: bindActionCreators(startClock, dispatch),
  };
};

Index = connect(mapDispatchToProps)(Index);
export default Index;
