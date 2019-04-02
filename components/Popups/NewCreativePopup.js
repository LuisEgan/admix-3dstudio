import React from 'react';
import mutations from '../../mutations';

import Popup from '../Popup';
import Form from '../Form';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';

const { createUser } = mutations;

const initialValues = {
  name: '',
  description: '',
  iab: '',
  size: '',
};

export default ({ show, togglePopup }) => {
  const validate = values => {
    const errors = {};

    // for (let input in initialValues) {
    //   if (values[input] === '') {
    //     errors[input] = 'We need this';
    //   }
    // }

    return errors;
  };

  const onSubmit = (values, mutation) => {
    console.log('mutation: ', mutation);
    console.log('values: ', values);
    mutation(values);
  };

  return (
    <Popup showPopup={show} togglePopup={togglePopup}>
      <div>
        <span className="popup-title">New creative</span>
        <div id="campaign-new-popup-btns">
          <Form
            validate={validate}
            onSubmit={onSubmit}
            initialValues={initialValues}
            mutation={createUser}
            onError={e => console.log(e)}
          >
            <TextInput name="name" label="Creative name*" />
            <TextInput name="description" label="Description" />
            <SelectInput
              name="iab"
              label="IAB"
              options={[{ label: 'opt1', value: 1 }, { label: 'opt2', value: 2 }]}
            />
            <SelectInput
              name="size"
              label="Creative size in the real world"
              options={[{ label: 'opt1', value: 1 }, { label: 'opt2', value: 2 }]}
            />
            <button type="submit" className="btn gradient-btn">
              Create
            </button>
          </Form>
        </div>
      </div>
    </Popup>
  );
};
