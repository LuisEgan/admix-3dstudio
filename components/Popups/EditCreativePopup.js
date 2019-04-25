import React from 'react';
import { graphql } from 'react-apollo';
import mutations from '../../mutations';

import Form from '../Form';
import Popup from '../Popup';
import TextInput from '../inputs/TextInput';

const { createUser, loginUser } = mutations;

export default graphql(loginUser)(props => {
  const { show, togglePopup, creative } = props;
  const { name, description } = creative || {};

  const validate = values => {
    const errors = {};

    for (let input in values) {
      if (!values[input] || values[input] === '') {
        errors[input] = 'We need this';
      }
    }

    return errors;
  };

  const onSubmit = (values, mutation) => {
    console.log('mutation: ', mutation);
    console.log('values: ', values);
    // mutation(values);
  };

  const onDelete = async id => {
    try {
      const { mutate } = props;
      await mutate({ variables: { id } });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <Popup showPopup={show} togglePopup={togglePopup}>
      <div>
        <span className="popup-title">Edit creative details</span>
        <div id="campaign-new-popup-btns">
          <Form
            initialValues={{ name, description }}
            validate={validate}
            onSubmit={onSubmit}
            mutation={createUser}
            onError={e => console.log(e)}
          >
            <TextInput name="name" label="Group name*" />
            <TextInput name="description" label="Description*" />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                padding: '20px'
              }}
            >
              <button type="submit" className="btn gradient-btn" style={{ width: '40%' }}>
                Save
              </button>
              <button
                type="button"
                onClick={() => onDelete('CREATIVE_ID')}
                className="btn red-btn"
                style={{ width: '40%' }}
              >
                Delete
              </button>
            </div>
          </Form>
        </div>
      </div>
    </Popup>
  );
});
