import { useMemo } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useApolloClient } from '@apollo/client';

export const useMyDashboard = props => {

    const apolloClient = useApolloClient();
    const [{ isSignedIn, currentUser }] = useUserContext();

    const initialUser = useMemo(() => {
        return currentUser;
    }, [currentUser]);

    const { email, firstname, lastname } = initialUser;

    return {
        firstname,
        lastname,
        email,
        isSignedIn
    };
};
