import React from "react";
import { Formik, Form } from "formik";

import Popup from "../Popup";
import TextInput from "../inputs/TextInput";

export default ({ show, togglePopup, group }) => {
  const { name, description } = group || {};
  
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
        <span className="popup-title">Edit group details</span>
        <div id="campaign-new-popup-btns">
          <Formik
            initialValues={{ name, description }}
            validate={validate}
            onSubmit={onSubmit}
          >
            {formProps => (
              <Form>
                <TextInput {...formProps} name="name" label="Group name*" />
                <TextInput
                  {...formProps}
                  name="description"
                  label="Description*"
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    padding: "20px",
                  }}
                >
                  <button
                    type="button"
                    className="btn gradient-btn"
                    style={{ width: "40%" }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn red-btn"
                    style={{ width: "40%" }}
                  >
                    Delete
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Popup>
  );
};
