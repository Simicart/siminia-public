import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { bool, shape, string } from 'prop-types';
import defaultClasses from './socialAuthentication.module.css';
import SocialButtons from '../SocialButtons';
import { useSocialLoginContext } from '../../context';
import { FormattedMessage } from 'react-intl';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const SocialAuthentication = props => {
  const { mode, isPopup, showCreateAccount } = props;
  const {
    buttons,
    isEnabled,
    buttonPosition,
    enabledModes
  } = useSocialLoginContext();

  const [{ isSignedIn }] = useUserContext();

  if (!isEnabled || !enabledModes.includes(mode) || isSignedIn) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const separator =
    mode === 'popup' ? (
      <div className={classes.separator}>
        <span className={classes.separatorIcon}>
          <FormattedMessage
            id={'amSocialLogin.separator'}
            defaultMessage={'or'}
          />
        </span>
      </div>
    ) : null;

  const rootClass = isPopup
    ? `${classes.root_popup} ${classes[buttonPosition]}`
    : `${classes.root} ${classes[mode]}`;

  return (
    <div className={rootClass}>
      {separator}
      <div className={classes.title}>
        <FormattedMessage
          id={'amSocialLogin.titleText'}
          defaultMessage={'Login with Your Social Profile'}
        />
      </div>
      <SocialButtons
        buttons={buttons}
        showCreateAccount={showCreateAccount}
        mode={mode}
      />
    </div>
  );
};

SocialAuthentication.propTypes = {
  classes: shape({
    root: string
  }),
  mode: string,
  isPopup: bool
};

export default SocialAuthentication;
