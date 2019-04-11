import React from 'react';
import mutations from '../../mutations';
import queries from '../../queries';

import Form from '../Form';
import Popup from '../Popup';
import TextInput from '../inputs/TextInput';

const { createCampaign } = mutations;
const { campaigns } = queries;

const initialValues = { name: '', advertiser: '', description: '' };

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
    mutation({
      variables: {
        user: '5c903dd7ea674f2b443f6491',
        ...values,
      },
      refetchQueries: [{ query: campaigns }],
    });
  };

  return (
    <Popup showPopup={show} togglePopup={togglePopup}>
      <div>
        <span className="popup-title">Create new campaign</span>
        <div id="campaign-new-popup-btns">
          <Form
            initialValues={initialValues}
            validate={validate}
            onSubmit={onSubmit}
            mutation={createCampaign}
            onError={e => console.log(e)}
          >
            <TextInput name="name" label="Campaign name*" />
            <TextInput name="advertiser" label="Campaign advertiser*" />
            <TextInput name="description" label="Campaign description*" />
            <button type="submit" className="btn gradient-btn">
              Create
            </button>
          </Form>
        </div>
      </div>
    </Popup>
  );
};
