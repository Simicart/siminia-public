import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, array, func, bool } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import LinkedAccount from './linkedAccount';
import defaultClasses from './socialAccountsPage.module.css';

const LinkedAccounts = props => {
  const { accounts, handleUnlink, isDisabled } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  if (!Array.isArray(accounts) || !accounts.length) {
    return null;
  }

  const list = accounts.map(acc => (
    <LinkedAccount
      key={acc.type}
      isDisabled={isDisabled}
      handleUnlink={handleUnlink}
      {...acc}
    />
  ));

  return (
    <div className={classes.accountsBlock}>
      <div className={classes.accountsHeading}>
        <FormattedMessage
          id={'amSocialLogin.linkedAccounts'}
          defaultMessage={'Linked accounts'}
        />
      </div>

      <ul className={classes.accountsList}>{list}</ul>
    </div>
  );
};

LinkedAccounts.propTypes = {
  classes: shape({
    root: string
  }),
  accounts: array,
  handleUnlink: func,
  isDisabled: bool
};

export default LinkedAccounts;
