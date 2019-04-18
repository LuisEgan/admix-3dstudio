import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { connect } from 'react-redux';
import Form from '../components/Form';
import mutations from '../mutations';

import isEmail from 'validator/lib/isEmail';
import actions from '../lib/actions';

import App from '../components/App';
import BigImagePanel from '../components/BigImagePanel';
import TextInput from '../components/inputs/TextInput';

const { loginUser } = mutations;

const { login } = actions;

let Login = props => {
  const [error, setError] = useState(null);

  const { login, isLoggedIn, client } = props;

  const renderFooter = () => {
    return (
      <div>
        <Link prefetch href="/register">
          <a className="/register">Register</a>
        </Link>
      </div>
    );
  };

  const validate = values => {
    const errors = {};
    const { email, password } = values;

    if (!email || !isEmail(email)) {
      errors.email = 'Invalid email';
    }

    if (!password) {
      errors.password = 'Please enter a password';
    }

    return errors;
  };

  const onSubmit = (values, mutation) => {
    mutation({
      variables: { ...values },
    });
  };

  const doLogin = ({ accessToken, name }) => {
    if (!accessToken) {
      setError(name ? 'Invalid password!' : 'No user found!');
      return;
    }

    login({ accessToken });
  };

  if (isLoggedIn) {
    Router.push('/campaigns');
    return null;
  }

  return (
    <App>
      <BigImagePanel title="Login" footer={renderFooter()}>
        <Form
          initialValues={{ email: '', password: '' }}
          validate={validate}
          onSubmit={onSubmit}
          mutation={loginUser}
          onCompleted={({ loginUser }) => doLogin(loginUser)}
          onError={e => console.log(e)}
        >
          <TextInput name="email" label="Email" />
          <TextInput name="password" label="Password" />
          <button type="submit" className="btn gradient-btn">
            Submit
          </button>
        </Form>
        {error && (
          <div className="mbs asyncError" style={{ textAlign: 'center', width: '70%' }}>
            {error}
          </div>
        )}
      </BigImagePanel>
    </App>
  );
};

const mapStateToProps = state => {
  const { auth } = state;
  return { ...auth };
};

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(login({ email, password })),
});

Login = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default Login;
