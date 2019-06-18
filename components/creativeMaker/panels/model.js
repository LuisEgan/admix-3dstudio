import React, { useState, useEffect } from 'react';
import { Mutation, withApollo } from 'react-apollo';
import STR from '../../../lib/utils/strFuncs';
import actions from '../panelActions';
import mutations from '../../../mutations';

import SetObjectPanel from './SetObjectPanel';
import PanelFooter from '../PanelFooter';
import { PANELS } from '../../../lib/utils/constants';

const { uploadModel } = mutations;

const SetSizePanel = props => {
  const { reScale, size } = props;

  const inputStyle = { width: '100%', border: 'solid 1px #eee' };
  const inputContainerStyle = { width: '60%' };

  return (
    <React.Fragment>
      <div className="mb">
        Set the size of your object in the real world, so we can scale it for the virtual
        environment.
      </div>
      <div style={inputContainerStyle}>
        <input
          className="admix-track"
          type="range"
          min={1}
          max={300}
          onChange={reScale}
          value={size}
          style={inputStyle}
        />
      </div>
      <div style={inputContainerStyle}>
        <input className="input" value={`${size} cm`} readOnly style={inputStyle} />
      </div>
    </React.Fragment>
  );
};

const ModelPanels = [
  props => (
    <SetObjectPanel
      {...props}
      panelDescription={"Let's start by uploading a 3D model of the product you want to promote"}
      label={'Upload base 3D model'}
    />
  ),
  props => <SetSizePanel {...props} />,
];

const Model = props => {
  const {
    editCreative,
    loading3Dmodel,
    editCreativeLoading,
    handleEditCreativeOnCompleted,
    creative,
    loadFile,
    size,
    setSize,
    dispatch,
    updateChecklistDone,
    setCheckListCurrent,
    checkListCurrent,
    reducerState: {
      file: { model: modelFile },
    },
  } = props;

  // * if there's a model already loaded show the set size panel
  // * unless the user clicked on the checklist on "base model uploaded"
  const [modelPanel, setModelPanel] = useState(checkListCurrent - 1);

  useEffect(() => {
    setModelPanel(checkListCurrent - 1);
  }, [checkListCurrent]);

  const onBack = () => {
    setCheckListCurrent(checkListCurrent - 1);
    setModelPanel(0);
  };

  const reScale = e => {
    const {
      target: { value },
    } = e;
    setSize(Math.round(value));
  };

  const saveModel = () => {
    editCreative({
      variables: {
        creative,
        scale: size,
        size: STR.parseSize(size),
      },
    });
    handleEditCreativeOnCompleted(() => {
      // * Change panel to Gaze panel
      dispatch({ type: actions.SET_CURRENT_PANEL, payload: PANELS.GAZE });

      // * Update checklist
      updateChecklistDone(2);
      setCheckListCurrent(3);
    });
  };

  const uploadFile = uploadModel => e => {
    // * Load 3D model into webgl
    const modelFile = loadFile(e);

    // * Upload file to S3 bucket
    uploadModel({
      variables: {
        creative,
        scale: size,
        size: STR.parseSize(size),
        model: modelFile,
      },
    });
  };

  const handleUploadOnCompleted = () => {
    // * Change panel to Set size on Model panel
    setModelPanel(1);

    // * Update checklist
    updateChecklistDone(1);
    setCheckListCurrent(2);
  };

  return (
    <Mutation mutation={uploadModel} onCompleted={handleUploadOnCompleted}>
      {(uploadModel, { loading: uploadLoading }) => (
        <div id="creative-panel">
          <div id="creative-panel-content">
            {ModelPanels[modelPanel]({
              file: modelFile,
              uploadLoading,
              loading3Dmodel,
              editCreativeLoading,
              setModelPanel,
              reScale,
              dispatch,
              size,
              saveModel,
              loadFile: uploadFile(uploadModel),
            })}
          </div>
          <div id="creative-panel-footer">
            <PanelFooter
              hide={modelPanel === 0}
              onBack={onBack}
              onNext={saveModel}
              nextLoading={editCreativeLoading}
            />
          </div>
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(Model);
