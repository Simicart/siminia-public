import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './socialLogin.ggl';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useMemo } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory } from 'react-router-dom';
import { useSocialLoginContext } from '../context';
import { useEventListener } from '@magento/peregrine';

export const useSocialAccountsPage = (props = {}) => {
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { getSocAccountDataQuery, unlinkAccountMutation } = operations;

  const {
    buttons: allButtons,
    handleErrors,
    isEnabled
  } = useSocialLoginContext();
  const [{ isSignedIn }] = useUserContext();
  const history = useHistory();

  const [runQuery, { data, loading }] = useLazyQuery(getSocAccountDataQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: !isSignedIn || !isEnabled
  });

  const { amSocialLoginAccountData: linkedAccounts } = data || {};

  const [unlinkAccount, { loading: unlinkLoading }] = useMutation(
    unlinkAccountMutation
  );

  const handleUnlink = useCallback(
    async type => {
      try {
        await unlinkAccount({
          variables: { type },
          refetchQueries: [{ query: getSocAccountDataQuery }],
          awaitRefetchQueries: true
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(error);
        }
      }
    },
    [unlinkAccount, getSocAccountDataQuery]
  );

  // If the user is no longer signed in, redirect to the home page.
  useEffect(() => {
    if (!isSignedIn) {
      history.push('/');
    } else {
      runQuery();
    }
  }, [history, isSignedIn, runQuery]);

  const buttons = useMemo(() => {
    if (!allButtons || !linkedAccounts) {
      return null;
    }

    return allButtons.filter(btn =>
      linkedAccounts.every(({ type }) => type !== btn.type)
    );
  }, [linkedAccounts, allButtons]);

  const linkAccountHandler = useCallback(
    event => {
      try {
        if (!isSignedIn) {
          return null;
        }

        const { result, messages, token } = event.data || {};

        if (result === 1 && !token) {
          handleErrors(null);
          runQuery();
        } else if (messages) {
          handleErrors({
            message: messages[0]
          });
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(error);
        }
      }
    },
    [runQuery, handleErrors, isSignedIn]
  );

  useEventListener(window, 'message', linkAccountHandler);

  return {
    isEnabled,
    linkedAccounts,
    loading,
    handleUnlink,
    buttons,
    isDisabled: unlinkLoading
  };
};
