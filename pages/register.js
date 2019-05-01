import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Form from '../components/Form';
import mutations from '../mutations';

import isEmail from 'validator/lib/isEmail';

import App from '../components/App';
import BigImagePanel from '../components/BigImagePanel';
import TextInput from '../components/inputs/TextInput';

const { createUser } = mutations;

const initialValues = { name: '', email: '', password: '' };

let Register = props => {
  const [error, setError] = useState(null);

  const { login, isLoggedIn, client } = props;

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
  };

  if (isLoggedIn) {
    Router.push('/campaigns');
    return null;
  }

  return (
    <App>
      <BigImagePanel title="Register" footer={renderFooter()}>
        <Form
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
          mutation={createUser}
          onCompleted={e => console.log(e)}
          onError={e => setError(e.graphQLErrors[0].message)}
        >
          <TextInput name="name" label="Name" />
          <TextInput name="email" label="Email" />
          <TextInput name="password" label="Password" />
          <TextInput name="password2" label="Repeat password" />
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

export default Register;
