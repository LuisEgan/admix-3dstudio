import React from 'react';
import { Formik, Form } from 'formik';

import Popup from '../Popup';
import AdmixForm from '../Form';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';

const initialValues = {
  name: '',
  description: '',
  iab: '',
  size: '',
};

export default ({ show, togglePopup }) => {
  const validate = values => {
    const errors = {};

    for (let input in initialValues) {
      if (values[input] === '') {
        errors[input] = 'We need this';
      }
    }

    return errors;
  };

  const onSubmit = values => {
    console.log('values: ', values);
  };

  return (
    <Popup showPopup={show} togglePopup={togglePopup}>
      <div>
        <span className="popup-title">New creative</span>
        <div id="campaign-new-popup-btns">
          <AdmixForm>
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
          </AdmixForm>
          <Formik validate={validate} onSubmit={onSubmit} initialValues={initialValues}>
            {formProps => (
              <Form>
                <TextInput {...formProps} name="name" label="Creative name*" />
                <TextInput {...formProps} name="description" label="Description" />
                <SelectInput
                  {...formProps}
                  name="iab"
                  label="IAB"
                  options={[{ label: 'opt1', value: 1 }, { label: 'opt2', value: 2 }]}
                />
                <SelectInput
                  {...formProps}
                  name="size"
                  label="Creative size in the real world"
                  options={[{ label: 'opt1', value: 1 }, { label: 'opt2', value: 2 }]}
                />
                <button type="submit" className="btn gradient-btn">
                  Create
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Popup>
  );
};
