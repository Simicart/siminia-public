import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, func } from 'prop-types';

import defaultClasses from './socialButtons.module.css';
import SocialIcon from '../SocialIcon';
import { FormattedMessage } from 'react-intl';

const Button = props => {
  const { label, type, url, handleLogin, buttonShape } = props;
  const classes = mergeClasses(defaultClasses, props.classes);
  const isRectangleShape = buttonShape === 'rectangle';

  const btnText = isRectangleShape ? (
    <span className={classes.text}>
      <FormattedMessage
        id={'amSocialLogin.continueWith'}
        defaultMessage={'Continue with {label}'}
        values={{ label }}
      />
    </span>
  ) : null;

  const style = {
    '--amslBtnBg': `var(--amsl-${type}-button__${
      isRectangleShape ? 'rectangle__' : ''
    }background)`
  };

  return (
    <button
      style={style}
      type="button"
      title={`Sign in with ${label}`}
      className={`${classes.button} ${classes[type]}`}
      onClick={() => handleLogin({ type, url })}
    >
      <SocialIcon type={type} />
      {btnText}
    </button>
  );
};

Button.propTypes = {
  classes: shape({
    root: string
  }),
  label: string,
  type: string,
  url: string,
  buttonShape: string,
  handleLogin: func
};

export default Button;
