import React, { useState } from 'react';
import { Mutation, withApollo } from 'react-apollo';
import actions from '../panelActions';
import mutations from '../../../mutations';

import SetObjectPanel from './SetObjectPanel';
import PanelFooter from '../PanelFooter';
import { PANELS } from '../../../lib/utils/constants';

const { uploadGaze } = mutations;

const Gaze = props => {
  const {
    loadFile,
    loading3Dmodel,
    creative,
    dispatch,
    updateChecklistDone,
    setCheckListCurrent,
    reducerState: {
      file: { gaze: gazeFile },
    },
  } = props;

  const handleNext = uploadGaze => () => {
    // * Upload file to S3 bucket
    if (gazeFile) {
      uploadGaze({
        variables: {
          creative,
          model: gazeFile,
        },
      });
    }
  };

  const onSkip = () => {
    gazeFile &&
      dispatch({ type: actions.SET_FILE, payload: { panelName: 'gaze', panelFile: null } });
    dispatch({ type: actions.SET_CURRENT_PANEL, payload: PANELS.ACTION });
    updateChecklistDone(3);
    setCheckListCurrent(4);
  };

  const handleUploadOnCompleted = () => {
    dispatch({ type: actions.SET_CURRENT_PANEL, payload: PANELS.ACTION });
    updateChecklistDone(3);
    setCheckListCurrent(4);
  };

  return (
    <Mutation mutation={uploadGaze} onCompleted={handleUploadOnCompleted}>
      {(uploadGaze, { loading: uploadLoading }) => (
        <div id="creative-panel">
          <div id="creative-panel-content">
            <SetObjectPanel
              loadFile={loadFile}
              uploadLoading={uploadLoading}
              loading3Dmodel={loading3Dmodel}
              panelDescription={'Now set the model for gaze.'}
              label={'Upload gaze animation'}
              skippable={true}
            />
          </div>

          <div id="creative-panel-footer">
            <PanelFooter
              onBack={() => dispatch({ type: actions.SET_CURRENT_PANEL, payload: PANELS.MODEL })}
              onSkip={onSkip}
              onNext={handleNext(uploadGaze)}
              nextLoading={uploadLoading || loading3Dmodel}
              loadedFile={gazeFile}
            />
          </div>
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(Gaze);
