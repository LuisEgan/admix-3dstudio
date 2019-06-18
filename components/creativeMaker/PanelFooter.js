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
            className={`white-btn skip-btn ${nextLoading && 'disabled-btn'}`}
            style={{ textAlign: 'right' }}
            disabled={nextLoading}
          >
            Skip >
          </button>
        ) : (
          <Button
            onClick={onNext}
            className={`campaign-buttons ${nextLoading && 'disabled-btn'}`}
            disabled={nextLoading}
          >
            {nextLoading ? 'Loading...' : nextText || 'Save and Next >'}
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};

export default PanelFooter;
