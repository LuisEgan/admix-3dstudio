import React, { useState } from 'react';
import { Mutation, withApollo } from 'react-apollo';
import actions from '../panelActions';
import mutations from '../../../mutations';
import queries from '../../../queries';

import SetObjectPanel from './SetObjectPanel';

const { uploadAction } = mutations;
const { creativeXML } = queries;

const NextPanelPrompt = ({ dispatch, setActionPanel, file, skipped, genXML, XMLloading }) => {
  const mainLabel = () => {
    if (file && !skipped) return 'Animation uploaded';

    return 'No animation uploaded';
  };

  const checkLabel = () => {
    if (file && !skipped) return file.name;

    return 'no file';
  };

  const handleNext = async () => {
    await genXML();

    dispatch({ type: actions.SET_CURRENT_PANEL, payload: 3 });
    if (skipped) {
      dispatch({ type: actions.SET_FILE, payload: { panelName: 'action', panelFile: null } });
    }
  };

  return (
    <div>
      <div className="creative-checks">
        <div>
          <h3>{mainLabel()}</h3>
        </div>
        <div>
          <input type="checkbox" checked={!!file && !skipped} readOnly />
          <span>{checkLabel()}</span>
          <span onClick={() => setActionPanel(0)} className="creative-checks-edit">
            edit
          </span>
        </div>
      </div>

      <div>You'll be able to preview your animated model at the end</div>
      <div>
        <button type="button" className="blue-btn" onClick={handleNext}>
          {XMLloading ? 'Loading...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

const ActionPanels = [
  props => <SetObjectPanel {...props} label={'Upload action'} />,
  props => <NextPanelPrompt {...props} />,
];

const Action = props => {
  const {
    client,
    loadFile,
    loading,
    creative,
    dispatch,
    setXMLurl,
    reducerState: {
      file: { action: actionFile },
    },
  } = props;

  const [actionPanel, setActionPanel] = useState(actionFile ? 1 : 0);
  const [skipped, setSkipped] = useState(false);
  const [XMLloading, setXMLloading] = useState(false);

  const onConfirm = uploadAction => () => {
    if (actionFile) {
      uploadAction({
        variables: {
          creative,
          model: actionFile,
        },
      });
    }
    setSkipped(false);
    setActionPanel(1);
  };

  const onSkip = () => {
    setSkipped(true);
    setActionPanel(1);
  };

  const genXML = async () => {
    setXMLloading(true);
    try {
      // const res = await client.query({
      //   query: creativeXML,
      //   variables: { creative }
      // });
      // const url = res.data.creativeXML;
      setXMLurl(
        'https://admix.in/wp-content/uploads/2019/04/Admix.Unity_Rev1.7.1_RC1.unitypackage',
      );
    } catch (error) {
      console.error('error: ', error);
    } finally {
      setXMLloading(false);
    }
  };

  return (
    <Mutation mutation={uploadAction} onCompleted={() => console.log('size saved!')}>
      {(uploadAction, { loading }) => (
        <div className="creative-panel">
          {ActionPanels[actionPanel]({
            file: actionFile,
            loadFile,
            dispatch,
            setActionPanel,
            onConfirm: onConfirm(uploadAction),
            onSkip,
            skipped,
            genXML,
            XMLloading,
          })}
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(Action);
