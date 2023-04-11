import { useCallback, useState} from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useApolloClient, useMutation } from '@apollo/client';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { useHistory } from 'react-router-dom';
import { clearCatalogDataFromCache } from 'src/simi/Apollo/clearCatalogDataFromCache'

const DEFAULT_TITLE = 'My Account';
const UNAUTHED_TITLE = 'Signing Out';
const UNAUTHED_SUBTITLE = 'Please wait...';

export const useMyAccount = props => {

    const apolloClient = useApolloClient();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const { signOutMutation } = props;
    const [{ isSignedIn, currentUser }, { signOut }] = useUserContext();
    const [revokeToken] = useMutation(signOutMutation);
    const history = useHistory();

    const { email, firstname, lastname } = currentUser;
    const name = `${firstname} ${lastname}`.trim() || DEFAULT_TITLE;
    const title = email ? name : UNAUTHED_TITLE;
    const subtitle = email ? email : UNAUTHED_SUBTITLE;

    const handleSignOut = useCallback(async () => {
        showFogLoading();
        setIsSigningOut(true);

        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });
        await clearCartDataFromCache(apolloClient);
        await clearCustomerDataFromCache(apolloClient);
        await clearCatalogDataFromCache(apolloClient)
 
        // Refresh the page as a way to say "re-initialize". An alternative
        // would be to call apolloClient.resetStore() but that would require
        // a large refactor.
        history.go(0);
        hideFogLoading();
    }, [apolloClient, history, revokeToken, signOut]);

    return {
        handleSignOut,
        subtitle,
        title,
        isSignedIn,
        isSigningOut
    };
};
