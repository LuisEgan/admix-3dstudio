import React, { useState, useEffect } from 'react';
import { Mutation, withApollo } from 'react-apollo';

import mutations from '../../../mutations';

const { editCreative } = mutations;

const Model = props => {
  const { setPanel, handleFile, objSize } = props;
  const { x: originalObjHeight } = objSize;

  const [objHeight, setObjHeight] = useState(1);
  const [initializeHeight, setInitializeHeight] = useState(false);

  useEffect(() => {
    if (!initializeHeight && originalObjHeight) {
      setObjHeight(Math.round(originalObjHeight));
      setInitializeHeight(true);
    }
  });

  const reScale = e => {
    const {
      target: { value },
    } = e;
    setObjHeight(Math.round(value));
  };

  const handleSave = mutation => {
    setPanel(1);
  };

  return (
    <Mutation mutation={editCreative}>
      {(mutation, { error }) => (
        <div className="creative-panel">
          <div>
            <label htmlFor="3dfile" className="blue-btn">
              Select Image
            </label>
            <input id="3dfile" type="file" style={{ display: 'none' }} onChange={handleFile} />
          </div>
          <input
            type="range"
            min={originalObjHeight ? originalObjHeight - 100 : -100}
            max={originalObjHeight ? originalObjHeight + 100 : 100}
            value={objHeight}
            onChange={reScale}
          />
          <div>Height: {objHeight} cm</div>
          <div>
            <button type="button" onClick={() => handleSave(mutation)}>
              Save size
            </button>
          </div>
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(Model);
