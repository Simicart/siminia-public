import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { bool, func, shape, string } from 'prop-types';

import defaultClasses from './linkedAccount.module.css';
import Button from '@magento/venia-ui/lib/components/Button';
import { FormattedMessage } from 'react-intl';
import SocialIcon from '../SocialIcon';

const LinkedAccount = props => {
  const { type, name, handleUnlink, isDisabled } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <li className={classes.root}>
      <SocialIcon type={type} classes={{ root: classes.icon }} />
      <span className={classes.name}>{name}</span>
      <Button
        type="button"
        priority="high"
        disabled={isDisabled}
        onClick={() => handleUnlink(type)}
      >
        <FormattedMessage
          id={'amSocialLogin.unlink'}
          defaultMessage={'Unlink'}
        />
      </Button>
    </li>
  );
};

LinkedAccount.propTypes = {
  classes: shape({
    root: string
  }),
  type: string,
  name: string,
  handleUnlink: func,
  isDisabled: bool
};

LinkedAccount.defaultProps = {
  name: ''
};

export default LinkedAccount;
