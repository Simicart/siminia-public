import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from './socialAccountsPage.module.css';
import { useSocialAccountsPage } from '../../talons/useSocialAccountsPage';
import { Title } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import LinkedAccounts from './linkedAccounts';
import SocialButtons from '../SocialButtons';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';

const SocialAccountsPage = props => {
  const {
    linkedAccounts,
    loading,
    handleUnlink,
    buttons,
    isDisabled,
    isEnabled
  } = useSocialAccountsPage();

  const { formatMessage } = useIntl();

  if (!isEnabled) {
    return (
      <ErrorView
        message={formatMessage({
          id: 'magentoRoute.routeError',
          defaultMessage:
            "Looks like the page you were hoping to find doesn't exist. Sorry about that."
        })}
      />
    );
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const title = formatMessage({
    id: 'amSocialLogin.socialAccountsTitle',
    defaultMessage: 'My Social Accounts'
  });

  if (loading) {
    return fullPageLoadingIndicator;
  }

  return (
    <div className={classes.root}>
      <Title>{title}</Title>
      <h1 className={classes.heading}>{title}</h1>

      <div className={classes.content}>
        <LinkedAccounts
          accounts={linkedAccounts}
          isDisabled={isDisabled}
          handleUnlink={handleUnlink}
        />

        <div className={classes.accountsBlock}>
          <div className={classes.accountsHeading}>
            <FormattedMessage
              id={'amSocialLogin.linkNewAccounts'}
              defaultMessage={'Link new accounts'}
            />
          </div>
          <SocialButtons buttons={buttons} mode={'account'} />
        </div>
      </div>
    </div>
  );
};

SocialAccountsPage.propTypes = {
  classes: shape({
    root: string
  })
};

export default SocialAccountsPage;
