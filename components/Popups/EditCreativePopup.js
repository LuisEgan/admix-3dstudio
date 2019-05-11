import React, { useState } from 'react';
import mutations from '../../mutations';
import queries from '../../queries';

import Form from '../Form';
import Popup from '../Popup';
import TextInput from '../inputs/TextInput';

import { checkNonEmptyValues } from '../../lib/utils/validation';

const { editCreative } = mutations;
const { groupsByCampaign } = queries;

export default props => {
  const { show, togglePopup, creative, campaign } = props;
  const { name, description } = creative || {};

  const [loading, setLoading] = useState(false);

  const validate = values => {
    let errors = {};

    errors = checkNonEmptyValues({ values, exceptions: ['description'] });

    return errors;
  };

  const onSubmit = (values, editCreative) => {
    setLoading(true);
    editCreative({
      variables: {
        creative: creative.id,
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

  const onDelete = async id => {
    try {
      const { mutate } = props;
      await mutate({ variables: { id } });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const handleCompleted = ({ editCreative }) => {
    setLoading(false);
    togglePopup();
  };

  return (
    <Popup showPopup={show} togglePopup={togglePopup}>
      <div>
        <span className="popup-title">Edit creative details</span>
        <div id="campaign-new-popup-btns">
          <Form
            initialValues={{ name, description }}
            validate={validate}
            onSubmit={onSubmit}
            mutation={editCreative}
            onCompleted={handleCompleted}
            onError={e => console.log(e)}
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
                onClick={() => onDelete('CREATIVE_ID')}
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
