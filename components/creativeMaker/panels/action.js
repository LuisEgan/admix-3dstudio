import React, { useState } from 'react';
import { Mutation, withApollo } from 'react-apollo';
import actions from '../panelActions';
import mutations from '../../../mutations';
import queries from '../../../queries';
import { PANELS } from '../../../lib/utils/constants';

import SetObjectPanel from './SetObjectPanel';
import PanelFooter from '../PanelFooter';

const { uploadAction } = mutations;
const { creativeXML } = queries;

const Action = props => {
  const {
    client,
    loadFile,
    loading3Dmodel,
    creative,
    dispatch,
    setXMLurl,
    setCheckListDone,
    setCheckListCurrent,
    reducerState: {
      file: { action: actionFile },
    },
  } = props;

  const [XMLloading, setXMLloading] = useState(false);

  const handleNext = uploadAction => () => {
    if (actionFile) {
      uploadAction({
        variables: {
          creative,
          model: actionFile,
        },
      });
    }
  };

  const onSkip = async () => {
    actionFile &&
      dispatch({ type: actions.SET_FILE, payload: { panelName: 'action', panelFile: null } });
    dispatch({ type: actions.SET_CURRENT_PANEL, payload: PANELS.DOWNLOAD });
    await genXML();
  };

  const genXML = async () => {
    setXMLloading(true);
    setCheckListDone(5);
    setCheckListCurrent(6);
    try {
      const res = await client.query({
        query: creativeXML,
        variables: { creative },
      });
      const url = res.data.creativeXML;
      setXMLurl(url);
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setXMLloading(false);
      setCheckListDone(6);
      setCheckListCurrent(7);
    }
  };

  const handleUploadOnCompleted = async () => {
    setCheckListDone(4);
    setCheckListCurrent(5);
    await genXML();
    dispatch({ type: actions.SET_CURRENT_PANEL, payload: PANELS.DOWNLOAD });
  };

  return (
    <Mutation mutation={uploadAction} onCompleted={handleUploadOnCompleted}>
      {(uploadAction, { loading: uploadLoading }) => (
        <div id="creative-panel">
          <div id="creative-panel-content">
            <SetObjectPanel
              loadFile={loadFile}
              uploadLoading={uploadLoading}
              loading3Dmodel={loading3Dmodel}
              panelDescription={'Now set the model for action.'}
              label={'Upload action animation'}
              skippable={true}
            />
          </div>

          <div id="creative-panel-footer">
            <PanelFooter
              onBack={() => dispatch({ type: actions.SET_CURRENT_PANEL, payload: PANELS.GAZE })}
              onSkip={onSkip}
              onNext={handleNext(uploadAction)}
              nextLoading={uploadLoading || loading3Dmodel || XMLloading}
              loadedFile={actionFile}
              nextText={'Generate XML'}
            />
          </div>
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(Action);
