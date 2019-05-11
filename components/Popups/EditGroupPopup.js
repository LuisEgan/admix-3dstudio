import React, { useState } from 'react';
import mutations from '../../mutations';
import queries from '../../queries';

import Form from '../Form';
import Popup from '../Popup';
import TextInput from '../inputs/TextInput';

import { checkNonEmptyValues } from '../../lib/utils/validation';

const { editGroup } = mutations;
const { groupsByCampaign } = queries;

export default props => {
  const { show, togglePopup, group, campaign } = props;

  const [loading, setLoading] = useState(false);

  const { id, name, description } = group || {};

  const initialValues = {
    name,
    description: description || '',
  };

  const validate = values => {
    let errors = {};

    errors = checkNonEmptyValues({ values, exceptions: ['description'] });

    return errors;
  };

  const onSubmit = (values, editGroup) => {
    setLoading(true);
    editGroup({
      variables: {
        group: id,
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

  const onDelete = async id => {
    try {
      const { mutate } = props;
      await mutate({ variables: { id } });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const handleCompleted = ({ editGroup }) => {
    setLoading(false);
    togglePopup();
  };

  return (
    <Popup showPopup={show} togglePopup={togglePopup}>
      <div>
        <span className="popup-title">Edit group details</span>
        <div id="campaign-new-popup-btns">
          <Form
            mutation={editGroup}
            onError={e => console.log(e)}
            initialValues={initialValues}
            validate={validate}
            onCompleted={handleCompleted}
            onSubmit={onSubmit}
          >
            <TextInput name="name" label="Group name*" />
            <TextInput name="description" label="Description*" />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                padding: '20px',
              }}
            >
              <button
                type="submit"
                className="btn gradient-btn"
                style={{ width: '40%' }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => onDelete('GROUP_ID')}
                className="btn red-btn"
                style={{ width: '40%' }}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </Form>
        </div>
      </div>
    </Popup>
  );
};
