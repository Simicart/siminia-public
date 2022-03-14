import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './socialIcon.module.css';
import { useSocialLoginContext } from '../../context';

const SocialIcon = props => {
  const { type } = props;
  const { buttonShape } = useSocialLoginContext();

  if (!type) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const style = {
    '--amslBtnBg': `var(--amsl-${type}-button__background)`,
    '--amslBtnIcon': `var(--amsl-${type}-icon__background)`
  };

  return (
    <span
      style={style}
      className={`${classes.root} ${classes[type]} ${classes[buttonShape]}`}
    >
      <span className={classes.icon} />
    </span>
  );
};

SocialIcon.propTypes = {
  classes: shape({
    root: string
  }),
  type: string
};

export default SocialIcon;
