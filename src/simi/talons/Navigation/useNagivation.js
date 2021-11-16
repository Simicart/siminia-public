import { useEffect } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { simiUseAwaitQuery as useAwaitQuery } from 'src/simi/Network/Query';

export const useNavigation = props => {
    const { customerQuery } = props;
    // retrieve app state from context
    const [appState, { closeDrawer }] = useAppContext();

    const [{ isSignedIn }, { getUserDetails }] = useUserContext();
    const fetchUserDetails = useAwaitQuery(customerQuery);

    // request data from server
    useEffect(() => {
        getUserDetails({ fetchUserDetails });
    }, [fetchUserDetails, getUserDetails]);

    // extract relevant data from app state
    const { drawer } = appState;
    const isOpen = drawer === 'nav';

    return {
        isOpen,
        isSignedIn
    }
}
