import React from 'react';
import mutations from '../../mutations';
import queries from '../../queries';

import Form from '../Form';
import Popup from '../Popup';
import TextInput from '../inputs/TextInput';

const { createGroup } = mutations;
const { groupsByCampaign } = queries;

const initialValues = {
  name: '',
  description: '',
};

export default ({ show, togglePopup, campaign }) => {
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
        campaign,
        ...values,
      },
      refetchQueries: [
        {
          query: groupsByCampaign,
          variables: { campaign },
        },
      ],
      awaitRefetchQueries: true,
    });
    togglePopup();
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
            mutation={createGroup}
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
