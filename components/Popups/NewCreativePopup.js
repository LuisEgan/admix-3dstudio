import React from "react";
import { Formik, Form } from "formik";

import Popup from "../Popup";
import TextInput from "../inputs/TextInput";

export default ({ show, togglePopup }) => {
  const validate = values => {
    const errors = {};
    const { email, password } = values;

    if (!email || !isEmail(email)) {
      errors.email = "Invalid email";
    }

    if (!password) {
      errors.password = "Please enter a password";
    }

    return errors;
  };

  const onSubmit = values => {
    console.log("values: ", values);
  };

  return (
    <Popup showPopup={show} togglePopup={togglePopup}>
      <div>
        <span className="popup-title">New creative</span>
        <div id="campaign-new-popup-btns">
          <Formik validate={validate} onSubmit={onSubmit}>
            {formProps => (
              <Form>
                <TextInput {...formProps} name="name" label="Creative name*" />
                <TextInput
                  {...formProps}
                  name="description"
                  label="Description"
                />
                <button type="button" className="btn gradient-btn">
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
