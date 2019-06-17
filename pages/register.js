import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Form from '../components/Form';
import mutations from '../mutations';

import validator from '../data/Models/validators/users';
import { parseErrors } from '../lib/utils/parsers';

import App from '../components/App';
import BigImagePanel from '../components/BigImagePanel';
import TextInput from '../components/inputs/TextInput';

const { createUser } = mutations;

const initialValues = { name: '', email: '', password: '' };

let Register = props => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  let messageContainer;

  const { isLoggedIn } = props;

  if (isLoggedIn) {
    Router.push('/campaigns');
    return null;
  }

  const renderFooter = () => {
    return (
      <div className="loginButton">
        <p>or</p>
        <Link prefetch href="/login">
          <a className="/login">Login</a>
        </Link>
      </div>
    );
  };

  const validate = async values => {
    const errors = {};
    const { name, email, password, password2 } = values;

    const isEmailValid = await validator.email.validator(email);

    if (!name) {
      errors.name = 'Please enter a name';
    }

    if (!email) {
      errors.email = 'Please enter an email';
    } else if (!isEmailValid) {
      errors.email = 'Invalid email';
    }

    if (!password) {
      errors.password = 'Please enter a password';
    }

    if (password2 && password !== password2) {
      errors.password2 = 'Both passwords should match';
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  };

  const onSubmit = (values, mutation) => {
    mutation({
      variables: {
        ...values,
      },
    });
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };

  const handleOnCompleted = res => {
    const {
      createUser: { id },
    } = res;
    if (id) setMessage('User created!');
  };

  return (
    <App>
      <BigImagePanel>
        <Form
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
          mutation={createUser}
          onCompleted={handleOnCompleted}
          onError={e => {
            setMessage(e.graphQLErrors[0].message);
            setError(true);
          }}
        >
          <div className="form-header">
            <p>Register</p>
          </div>
          <TextInput name="name" label="Name" />
          <TextInput name="email" label="Email" />
          <TextInput name="password" label="Password" type="password" />
          <TextInput name="password2" label="Repeat password" type="password" />
          <div
            ref={i => (messageContainer = i)}
            className={`mbs ${error ? 'asyncError' : 'asyncSuccess'}`}
            style={{ textAlign: 'center', margin: '10px 0' }}
          >
            {message && parseErrors(message)}
          </div>
          <button type="submit" className="btn gradient-btn">
            Register
          </button>
          {renderFooter()}
        </Form>
      </BigImagePanel>
    </App>
  );
};

export default Register;
