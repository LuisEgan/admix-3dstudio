import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Popup extends React.PureComponent {
  closePopup = () => {
    const { togglePopup } = this.props;

    if (!togglePopup && process.env.NODE_ENV === 'development') {
      console.error('Warning! No togglePopup() function was provided to Popup');
    } else {
      togglePopup();
    }
  };

  render() {
    const { children, showPopup, id } = this.props;

    if (!showPopup) {
      return null;
    }

    return (
      <div id={id} className="popup">
        <div className="popup-inner">
          <FontAwesomeIcon icon={faTimes} onClick={this.closePopup} className="popup-x" />
          {children}
        </div>
        <div className="popup-bg" onClick={this.closePopup.bind(this)} />
      </div>
    );
  }
}

Popup.propTypes = {
  showPopup: PropTypes.bool.isRequired,
  togglePopup: PropTypes.func,
};

Popup.defaultProps = {
  showPopup: false,
};

export default Popup;
