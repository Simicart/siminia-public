import { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Header/accountMenu.gql';

/**
 * The useAccountMenu talon complements the AccountMenu component.
 *
 * @param {Object} props
 * @param {DocumentNode} props.operations.signOutMutation - Mutation to be called for signout.
 * @param {Boolean} props.accountMenuIsOpen - Boolean to notify if the account menu dropdown is open.
 * @param {Function} props.setAccountMenuIsOpen - Function to set the value of accountMenuIsOpen
 *
 * @returns {Object}    talonProps
 * @returns {String}    talonProps.view - Current view.
 * @returns {String}  talonProps.username - Username of the current user trying to login / logged in.
 * @returns {Boolean}   talonProps.isUserSignedIn - Boolean to notify if the user is signed in.
 * @returns {Function}  talonProps.handleSignOut - Function to handle the signout workflow.
 * @returns {Function}  talonProps.handleForgotPassword - Function to handle forgot password workflow.
 * @returns {Function}  talonProps.handleCreateAccount - Function to handle create account workflow.
 * @returns {Function}  talonProps.setUsername - Function to set the username.
 */

export const useAccountMenu = props => {
    const { accountMenuIsOpen, setAccountMenuIsOpen } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { signOutMutation } = operations;

    const [view, setView] = useState('SIGNIN');
    const [username, setUsername] = useState('');

    const history = useHistory();
    const location = useLocation();
    const [revokeToken] = useMutation(signOutMutation);
    const [{ isSignedIn: isUserSignedIn }, { signOut }] = useUserContext();

    const handleSignOut = useCallback(async () => {
        setView('SIGNIN');
        setAccountMenuIsOpen(false);

        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });

        window.location.replace('/');
        // Refresh the page as a way to say "re-initialize". An alternative
        // would be to call apolloClient.resetStore() but that would require
        // a large refactor.
        //history.go(0);
    }, [history, revokeToken, setAccountMenuIsOpen, signOut]);

    const handleForgotPassword = useCallback(() => {
        setView('FORGOT_PASSWORD');
    }, []);

    const handleCancel = useCallback(() => {
        setView('SIGNIN');
    }, []);

    const handleCreateAccount = useCallback(() => {
        setView('CREATE_ACCOUNT');
    }, []);

    const handleAccountCreation = useCallback(() => {
        setView('ACCOUNT');
    }, []);

    // Close the Account Menu on page change.
    // This includes even when the page "changes" to the current page.
    // This can happen when clicking on a link to a page you're already on, for example.
    useEffect(() => {
        setAccountMenuIsOpen(false);
    }, [location, setAccountMenuIsOpen]);

    // Update view based on user status everytime accountMenuIsOpen has changed.
    useEffect(() => {
        if (isUserSignedIn) {
            setView('ACCOUNT');
        } else {
            setView('SIGNIN');
        }
    }, [accountMenuIsOpen, isUserSignedIn]);

    return {
        handleAccountCreation,
        handleCreateAccount,
        handleForgotPassword,
        handleCancel,
        handleSignOut,
        updateUsername: setUsername,
        username,
        view
    };
};
