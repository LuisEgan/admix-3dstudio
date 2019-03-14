import React from 'react';
import redirect from './redirect';
import checkLoggedIn from './checkLoggedIn';

export default Page => {
  return class WithAuth extends React.Component {
    static displayName = `WithData(${Page.displayName})`;

    static async getInitialProps(context) {
      const { loggedInUser } = await checkLoggedIn(context.apolloClient);

      if (!loggedInUser.user) {
        redirect(context, '/signin');
      }
      return { loggedInUser };
    }

    render() {
      return <Page {...this.props} />;
    }
  };
};
