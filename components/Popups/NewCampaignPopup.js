import React, { useState } from 'react';
import mutations from '../../mutations';
import queries from '../../queries';

import Form from '../Form';
import Popup from '../Popup';
import TextInput from '../inputs/TextInput';

import { checkNonEmptyValues } from '../../lib/utils/validation';

const { createCampaign } = mutations;
const { campaignsByUser } = queries;

const initialValues = { name: '', advertiser: '', description: '' };

export default ({ show, togglePopup, userId }) => {
  const [loading, setLoading] = useState(false);

  const validate = values => {
    let errors = {};

    errors = checkNonEmptyValues({ values, exceptions: ['description'] });

    return errors;
  };

  const onSubmit = (values, mutation) => {
    setLoading(true);
    mutation({
      variables: {
        user: userId,
        ...values,
      },
      refetchQueries: [{ query: campaignsByUser, variables: { user: userId } }],
    });
  };

  const handleCompleted = ({ createCampaign }) => {
    setLoading(false);
    togglePopup();
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
            onCompleted={handleCompleted}
            onError={e => console.log(e)}
          >
            <TextInput name="name" label="Campaign name*" />
            <TextInput name="advertiser" label="Campaign advertiser*" />
            <TextInput name="description" label="Campaign description" />
            <button type="submit" className="btn gradient-btn">
              {loading ? 'Loading...' : 'Create'}
            </button>
          </Form>
        </div>
      </div>
    </Popup>
  );
};
