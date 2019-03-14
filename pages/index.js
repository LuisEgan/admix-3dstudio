import React from "react";
import Router from "next/router";

class Index extends React.Component {

  componentDidMount() {
    Router.push("/login")
  }

  signout = apolloClient => () => {
    document.cookie = cookie.serialize('token', '', { maxAge: -1 });
    apolloClient.cache.reset().then(() => {
      redirect({}, '/signin');
    });
  };

  render() {
    return null
    // Hello {this.props.loggedInUser.user.name}! <br />
    // <button onClick={this.signout(props.apolloClient)}>Sign out</button>

  }
}

export default Index;
// export default withAuth(Index);
