import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

class Input extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    rootstyle: PropTypes.object,
    label: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    showErrors: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      displayError: false,
      touched: false,
    };

    this.forceFocus = this.forceFocus.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { name, errors, submitCount } = props;
    const { hasBlurred } = state;
    const newState = {};

    newState.displayError = errors && !!errors[name] && (hasBlurred || submitCount > 0);

    return newState;
  }

  onFocus() {
    const { onFocus } = this.props;
    this.setState({ focused: true, touched: true }, () => {
      onFocus && onFocus();
    });
  }

  onBlur() {
    const { onBlur } = this.props;
    this.setState({ focused: false, hasBlurred: true }, () => {
      onBlur && onBlur();
    });
  }

  forceFocus() {
    this.input.focus();
  }

  render() {
    const { label, icon, guideline, name, type, errors } = this.props;
    const { focused, displayError, touched } = this.state;

    if(!errors) return null;

    let inputStyle = {};
    let guidelineStyle = {};

    if (displayError) {
      inputStyle = { borderColor: 'red' };
    } else {
      inputStyle = focused ? { borderColor: '#14B9BE' } : {};
    }

    if (touched) {
      guidelineStyle = displayError ? { color: 'red' } : { color: 'green' };
    }

    return (
      <div className="input mb" role="input" onClick={this.forceFocus}>
        <div className="input-label">
          <span className="input-label">{label}</span>
        </div>
        <div className="input-body" style={inputStyle}>
          {icon && <div id="input-icon">{icon}</div>}
          <div>
            <Field
              type={type}
              name={name}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              innerRef={i => {
                this.input = i;
              }}
            />
          </div>
          {displayError && <span className="asyncError">{errors[name]}</span>}
        </div>
        <div className="input-guideline" style={guidelineStyle}>
          {guideline}
        </div>
      </div>
    );
  }
}

export default Input;
