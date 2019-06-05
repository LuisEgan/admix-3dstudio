import React, { useState } from 'react';
import mutations from '../../mutations';
import queries from '../../queries';

import Form from '../Form';
import Popup from '../Popup';
import TextInput from '../inputs/TextInput';

import { checkNonEmptyValues } from '../../lib/utils/validation';

const { createGroup } = mutations;
const { groupsByCampaign } = queries;

const initialValues = {
  name: '',
  description: '',
};

export default ({ show, togglePopup, campaign }) => {
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
  };

  const handleCompleted = ({ createCampaign }) => {
    setLoading(false);
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
            onCompleted={handleCompleted}
            onError={e => console.log(e)}
          >
            <TextInput name="name" label="Group name*" />
            <TextInput name="description" label="Description" />
            <button type="submit" className="btn gradient-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Create'}
            </button>
          </Form>
        </div>
      </div>
    </Popup>
  );
};
