import React from 'react';
import mutations from '../../mutations';

import Popup from '../Popup';
import Form from '../Form';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';

const { createCreative } = mutations;

const initialValues = {
  name: '',
  description: '',
  iab: '',
  size: '',
};

const sizeValues = [
  { label: 'Small (fits in a 0.5 x 0.5 x 0.5)', value: 'small' },
  { label: 'Medium (fits in a 1 x 1 x 1)', value: 'medium' },
  { label: 'Large (size over 1 x 1 x 1)', value: 'large' },
];

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

  const onSubmit = (values, mutation) => {
    mutation({
      variables: {
        user: '5caeb59ffaefa83e7085dff1',
        ...values,
      },
      // refetchQueries: [{ query: campaigns }],
    });
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
            mutation={createCreative}
            onError={e => console.log(e)}
          >
            <TextInput name="name" label="Creative name*" />
            <TextInput name="description" label="Description" />
            <SelectInput
              name="iab"
              label="IAB"
              options={[{ label: 'opt1', value: 1 }, { label: 'opt2', value: 2 }]}
            />
            <SelectInput name="size" label="Creative size in the real world" options={sizeValues} />
            <button type="submit" className="btn gradient-btn">
              Create
            </button>
          </Form>
        </div>
      </div>
    </Popup>
  );
};
