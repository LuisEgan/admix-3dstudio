import React, { Component } from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import isEmail from 'validator/lib/isEmail';
import actions from '../lib/actions';

import App from '../components/App';
import BigImagePanel from '../components/BigImagePanel';
import TextInput from '../components/inputs/TextInput';

const { login } = actions;

let Login = ({ login, isLoggedIn }) => {
  const renderFooter = () => {
    return (
      <div>
        <span>Text</span>
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

  const onSubmit = values => {
    const { email, password } = values;
    login(email, password);
  };

  if (isLoggedIn) {
    Router.push('/campaigns');
    return null;
  }

  return (
    <App>
      <BigImagePanel title="Login" footer={renderFooter()}>
        <Formik initialValues={{ email: '', password: '' }} validate={validate} onSubmit={onSubmit}>
          {formProps => (
            <Form>
              <TextInput name="email" label="Email" {...formProps} />
              <TextInput name="password" label="Password" {...formProps} />
              <button type="submit" className="btn gradient-btn" disabled={formProps.isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
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
