import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Form from '../components/Form';
import mutations from '../mutations';

import isEmail from 'validator/lib/isEmail';
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

  const { login, isLoggedIn, client } = props;

  if (isLoggedIn) {
    Router.push('/campaigns');
    return null;
  }

  const renderFooter = () => {
    return (
      <div>
        <Link prefetch href="/login">
          <a className="/login">Login</a>
        </Link>
      </div>
    );
  };

  const validate = values => {
    const errors = {};
    const { name, email, password, password2 } = values;

    if (!name) {
      errors.name = 'Please enter a name';
    }

    if (!email || !isEmail(email)) {
      errors.email = 'Invalid email';
    }

    if (!password) {
      errors.password = 'Please enter a password';
    }

    if (password2 && password !== password2) {
      errors.password2 = 'Both passwords should match';
    }

    return errors;
  };

  const onSubmit = (values, mutation) => {
    mutation({
      variables: {
        ...values,
      },
    });
    // messageContainer.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };

  const handleOnCompleted = res => {
    console.log('createUser: ', createUser);
    const {
      createUser: { id },
    } = res;
    if (id) setMessage('User created!');
  };

  return (
    <App>
      <BigImagePanel title="Register" footer={renderFooter()}>
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
          <TextInput name="name" label="Name" />
          <TextInput name="email" label="Email" />
          <TextInput name="password" label="Password" />
          <TextInput name="password2" label="Repeat password" />
          <div
            ref={i => (messageContainer = i)}
            className={`mbs ${error ? 'asyncError' : 'asyncSuccess'}`}
            style={{ textAlign: 'center', margin: '10px 0' }}
          >
            {message && parseErrors(message)}
          </div>
          <button type="submit" className="btn gradient-btn">
            Submit
          </button>
        </Form>
      </BigImagePanel>
    </App>
  );
};

export default Register;
