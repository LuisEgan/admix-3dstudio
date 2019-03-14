import React from 'react';
import cookie from 'cookie';
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";

import redirect from '../lib/redirect';
import withAuth from '../lib/withAuth';
// import clockActions from "../lib/actions/clock";

import App from '../components/App';
// import Header from "../components/Header";
// import Page from "../components/Page";
// import Submit from "../components/Submit";
// import PostList from "../components/PostList";
// import withApollo from "../lib/withApollo";

// const { startClock, addCount, serverRenderClock } = clockActions;

// class Index extends React.Component {
//   // static getInitialProps({ store, isServer }) {
//   //   store.dispatch(serverRenderClock(isServer));
//   //   store.dispatch(addCount());
//
//   //   return { isServer };
//   // }
//
//   componentDidMount() {
//     // this.timer = this.props.startClock();
//   }
//
//   componentWillUnmount() {
//     clearInterval(this.timer);
//   }
//
//   render() {
//     return (
//       <App>
//         {/* <Page title="Index" />
//         <Submit />
//         <PostList /> */}
//       </App>
//     );
//   }
// }

class Index extends React.Component {
  signout = apolloClient => () => {
    document.cookie = cookie.serialize('token', '', { maxAge: -1 });
    apolloClient.cache.reset().then(() => {
      redirect({}, '/signin');
    });
  };

  render() {
    const props = this.props;
    return (
      <App>
        Hello {this.props.loggedInUser.user.name}! <br />
        <button onClick={this.signout(props.apolloClient)}>Sign out</button>
      </App>
    );
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     addCount: bindActionCreators(addCount, dispatch),
//     startClock: bindActionCreators(startClock, dispatch),
//   };
// };

// Index = connect(mapDispatchToProps)(Index);
export default withAuth(Index);
