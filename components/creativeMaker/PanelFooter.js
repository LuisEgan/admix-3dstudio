import React from 'react';
import Button from 'components/Button';

export let PanelFooter = props => {
  const { onBack, onNext, onSkip, hide, nextLoading, loadedFile, nextText } = props;

  if (hide || (!onBack && !onNext)) return null;

  return (
    <React.Fragment>
      <div>
        <button onClick={onBack} className="white-btn skip-btn">{`< Back`}</button>
      </div>
      <div>
        {onSkip && !loadedFile ? (
          <button
            onClick={onSkip}
            className={`white-btn next-btn ${nextLoading && 'disabled-btn'}`}
            disabled={nextLoading}
          >
            Skip >
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={nextLoading}
            className={`white-btn next-btn ${nextLoading && 'disabled-btn'}`}
          >
            {`Next >`}
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default PanelFooter;
