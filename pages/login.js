import React, { Component } from "react";
import Router from "next/router";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import isEmail from "validator/lib/isEmail";
import actions from "../lib/actions";

import App from "../components/App";
import BigImagePanel from "../components/BigImagePanel";
import TextInput from "../components/inputs/TextInput";

const { login } = actions;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onSubmit = this.onSubmit.bind(this);
  }

  renderFooter() {
    return (
      <div>
        <span>Text</span>
      </div>
    );
  }

  validate(values) {
    const errors = {};
    const { email, password } = values;

    if (!email || !isEmail(email)) {
      errors.email = "Invalid email";
    }

    if (!password) {
      errors.password = "Please enter a password";
    }

    return errors;
  }

  onSubmit(values) {
    const { login } = this.props;
    const { email, password } = values;
    login(email, password);
  }

  render() {
    const { isLoggedIn } = this.props;

    if (isLoggedIn) {
      Router.push("/campaigns");
      return null;
    }

    return (
      <App>
        <BigImagePanel title="Login" footer={this.renderFooter()}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={this.validate}
            onSubmit={this.onSubmit}
          >
            {formProps => (
              <Form>
                <TextInput name="email" label="Email" {...formProps} />
                <TextInput name="password" label="Password" {...formProps} />
                <button
                  type="submit"
                  className="btn gradient-btn"
                  disabled={formProps.isSubmitting}
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </BigImagePanel>
      </App>
    );
  }
}

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
