import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonTheme } from '../themes';

const Button = props => {
  const {
    icon,
    iconSpin,
    children,
    className,
    onClick,
    disabled,
    size,
    fullWidth,
    isSubmit,
    type,
  } = props;

  return (
    <ButtonTheme size={size} fullWidth={fullWidth} type={type}>
      <button
        id="filter"
        disabled={disabled}
        className={`mb unselectable ${className}`}
        type={isSubmit ? 'submit' : 'button'}
        onClick={onClick}
      >
        {icon && <FontAwesomeIcon icon={icon} className="buttonIcon" spin={iconSpin} />}
        {children}
      </button>
    </ButtonTheme>
  );
};

export default Button;
