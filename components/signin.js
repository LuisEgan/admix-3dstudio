import React from 'react';
import Link from 'next/link';
import cookie from 'cookie';

import mutations from '../mutations';

import redirect from '../lib/redirect';
import checkLoggedIn from '../lib/checkLoggedIn';
import { Mutation, withApollo } from 'react-apollo';

const { loginUser } = mutations;

class Signin extends React.Component {
  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    if (loggedInUser.user) {
      redirect(context, '/');
    }

    return {};
  }

  handleSubmit = (e, loginUser) => {
    e.preventDefault();
    const { email, password } = document.login;
    loginUser({ variables: { email: email.value, password: password.value } });
  };

  render() {
    const { client } = this.props;
    return (
      <Mutation
        mutation={loginUser}
        onCompleted={({ loginUser: { token } }) => {
          document.cookie = cookie.serialize('token', token, {
            maxAge: 30 * 24 * 60 * 60,
          });
          client.cache.reset().then(() => {
            redirect({}, '/');
          });
        }}
        onError={error => console.log(error)}
      >
        {(loginUser, { error }) => {
          return (
            <React.Fragment>
              <form name="login" onSubmit={e => this.handleSubmit(e, loginUser)}>
                <input name="email" type="email" placeholder="Email" />
                <input name="password" type="password" placeholder="Password" />
                <button type="submit">Login</button>
              </form>
              <hr />
              New?{' '}
              <Link prefetch href="/register">
                <a>Create account</a>
              </Link>
            </React.Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default withApollo(Signin);
