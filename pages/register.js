import React from "react";
import Link from "next/link";
import { gql } from "apollo-boost";
import { Mutation, withApollo } from "react-apollo";

import mutations from "../mutations";

import redirect from "../lib/redirect";
import checkLoggedIn from "../lib/checkLoggedIn";

const { createUser } = mutations;

class RegisterUser extends React.Component {
  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    if (loggedInUser.user) {
      redirect(context, "/");
    }

    return {};
  }

  handleSubmit = (e, registerUser) => {
    e.preventDefault();
    const { name, email, password, company } = document.register;
    registerUser({
      variables: {
        name: name.value,
        email: email.value,
        password: password.value,
        company: company.value,
      },
    });
  };

  render() {
    const { client } = this.props;

    return (
      <Mutation
        mutation={createUser}
        onCompleted={() => {
          client.cache.reset().then(() => {
            redirect({}, "/signin");
          });
        }}
        onError={error => console.dir(error)}
      >
        {(registerUser, { loading, error }) => {
          error && console.log("error.message: ", error);

          return (
            <React.Fragment>
              <form
                name="register"
                onSubmit={e => this.handleSubmit(e, registerUser)}
              >
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <input type="text" name="company" placeholder="Company" />
                <button type="submit">Create Account</button>
                {error && <div>D: - {JSON.stringify(error)}</div>}
              </form>
              <hr />
              Already have an account?{" "}
              <Link prefetch href="/signin">
                <a>Sign in</a>
              </Link>
            </React.Fragment>
          );
        }}
      </Mutation>
    );
  }
}

export default withApollo(RegisterUser);
