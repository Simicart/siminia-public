import React, { useEffect } from 'react';

import { useMyAccount } from 'src/simi/talons/MyAccount/useMyAccount';
import { SIGN_OUT as SIGN_OUT_MUTATION } from '@magento/peregrine/lib/talons/Header/accountMenu.gql';

const Logout = props => {
    const { history } = props;

    const { handleSignOut, isSignedIn } = useMyAccount({
        signOutMutation: SIGN_OUT_MUTATION
    });

    useEffect(() => {
        if (isSignedIn) {
            handleSignOut();
        } else {
            history.push('/');
        }
    }, [isSignedIn, handleSignOut]);

    return null;
};

export default Logout;
