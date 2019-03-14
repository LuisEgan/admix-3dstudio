import React from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";

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
    let newState = {};

    newState.displayError = !!errors[name] && (hasBlurred || submitCount > 0);

    return newState;
  }

  forceFocus() {
    this.input.focus();
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

  render() {
    let { label, icon, guideline, name, type, errors } = this.props;

    const { focused, displayError, touched } = this.state;
    const inputStyle =
      displayError
        ? { borderColor: "red" }
        : focused
        ? { borderColor: "#14B9BE" }
        : {};

    const guidelineStyle = touched
      ? displayError
        ? { color: "red" }
        : { color: "green" }
      : {};

    return (
      <div className="input mb" onClick={this.forceFocus}>
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
