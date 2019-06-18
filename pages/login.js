import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { connect } from 'react-redux';
import Form from 'components/Form';
import mutations from 'mutations';
import validator from '../data/Models/validators/users';
import actions from 'lib/actions';
import App from 'components/App';
import BigImagePanel from 'components/BigImagePanel';
import TextInput from 'components/inputs/TextInput';
import Button from 'components/Button';

const { loginUser } = mutations;

const { login } = actions;

export const Login = props => {
  const [error, setError] = useState(null);

  const { login, isLoggedIn, client } = props;

  const renderFooter = () => {
    return (
      <div className="loginButton">
        <p>or</p>
        <Link prefetch href="/register">
          <a className="/register">Register</a>
        </Link>
      </div>
    );
  };

  const onSubmit = (values, mutation) => {
    mutation({
      variables: { ...values },
    });
  };

  const doLogin = ({ accessToken, name, id }) => {
    if (!accessToken) {
      setError(name ? 'Invalid password!' : 'No user found!');
      return;
    }

    login({ accessToken, id });
  };

  if (isLoggedIn) {
    Router.push('/campaigns');
    return null;
  }

  const validate = async values => {
    const errors = {};
    const { email, password } = values;

    const isEmailValid = await validator.email.validator(email);

    if (!email) {
      errors.email = 'Please enter an email';
    } else if (!isEmailValid) {
      errors.email = 'Invalid email';
    }

    if (!password) {
      errors.password = 'Please enter a password';
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  };

  return (
    <App>
      <BigImagePanel>
        <Form
          initialValues={{ email: '', password: '' }}
          onSubmit={onSubmit}
          mutation={loginUser}
          validate={validate}
          onCompleted={({ loginUser }) => {
            doLogin(loginUser);
          }}
          onError={e => console.log(e)}
        >
          <div className="form-header">
            <p>Login</p>
          </div>
          <TextInput name="email" label="Email" />
          <TextInput name="password" label="Password" type="password" />

          <Button isSubmit fullWidth>
            Login
          </Button>

          {renderFooter()}
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
  login: ({ accessToken, id }) => dispatch(login({ accessToken, id })),
});

const LoginConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

export default LoginConnected;
