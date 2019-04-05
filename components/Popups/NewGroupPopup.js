import React from 'react';
import mutations from '../../mutations';

import Form from '../Form';
import Popup from '../Popup';
import TextInput from '../inputs/TextInput';

const { createUser } = mutations;

const initialValues = {
  name: '',
  description: ''
};

export default ({ show, togglePopup }) => {
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

  return (
    <Popup showPopup={show} togglePopup={togglePopup}>
      <div>
        <span className="popup-title">Create new group</span>
        <div id="campaign-new-popup-btns">
          <Form
            validate={validate}
            initialValues={initialValues}
            onSubmit={onSubmit}
            mutation={createUser}
            onError={e => console.log(e)}
          >
            <TextInput name="name" label="Group name*" />
            <TextInput name="description" label="Description*" />
            <button type="submit" className="btn gradient-btn">
              Create
            </button>
          </Form>
        </div>
      </div>
    </Popup>
  );
};
