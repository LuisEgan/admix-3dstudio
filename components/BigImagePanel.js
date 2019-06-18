import React, { Component } from 'react';
import PropTypes from 'prop-types';

import admixLogo from '../assets/img/logo.png';

class BigImagePanel extends Component {
  static propTypes = {
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { title, children, footer } = this.props;

    return (
      <div id="bigImagePanel">
        <div>
          <div id="bigImagePanel-header">
            <img src={admixLogo} alt="admix" />
          </div>

          <div id="bigImagePanel-title" className="st">
            <div>{title}</div>
          </div>

          <div id="bigImagePanel-forms">{children}</div>

          <div id="bigImagePanel-nav" className="mb">
            {footer}
          </div>
        </div>

        {/* Big right image */}
        <div className="bg-back-forth" />
      </div>
    );
  }
}

export default BigImagePanel;
