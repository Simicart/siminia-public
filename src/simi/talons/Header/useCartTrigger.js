import { useCallback, useEffect, useState } from 'react';
import { useApolloClient, useQuery, useMutation, gql } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useWindowSize } from '@magento/peregrine';
import { useHistory, useLocation } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

/**
 * Routes to hide the mini cart on.
 */
const DENIED_MINI_CART_ROUTES = ['/checkout'];

const CHECK_USER_IS_AUTHED = gql`
    query simiCheckUserIsAuthed($cartId: String) {
        simiCheckUserIsAuthed(cart_id: $cartId) {
            token_valid
            cart_editable
        }
    }
`;

export const useCartTrigger = props => {
    const {
        mutations: { createCartMutation },
        queries: { getCartDetailsQuery, getItemCountQuery },
        storeConfig
    } = props;
    const history = useHistory();
    const location = useLocation();
    const [isHidden, setIsHidden] = useState(() =>
        DENIED_MINI_CART_ROUTES.includes(location.pathname)
    );
    const apolloClient = useApolloClient();
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const [{ isSignedIn }, { signOut }] = useUserContext();
    const [reloadInterval, setReloadInterval] = useState(1);
    const [{ cartId }] = useCartContext();

    const {
        elementRef: miniCartRef,
        expanded: miniCartIsOpen,
        setExpanded: setMiniCartIsOpen,
        triggerRef: miniCartTriggerRef
    } = useDropdown();

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const { data } = useQuery(getItemCountQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            cartId
        },
        skip: !cartId
    });

    //check token + auth active each 30s
    const { data: userIsAuthedData } = useQuery(CHECK_USER_IS_AUTHED, {
        fetchPolicy: 'no-cache',
        variables: {
            cartId,
            reloadInterval
        },
        skip: !cartId || !isSignedIn
    });

    useEffect(() => {
        if (
            userIsAuthedData &&
            userIsAuthedData.simiCheckUserIsAuthed &&
            (userIsAuthedData.simiCheckUserIsAuthed.token_valid === false ||
                userIsAuthedData.simiCheckUserIsAuthed.cart_editable === false)
        ) {
            signOut();
            setTimeout(function() {
                window.location.replace('/');
            }, 500);
        }
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setReloadInterval(reloadInterval => reloadInterval + 1);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setIsHidden(DENIED_MINI_CART_ROUTES.includes(location.pathname));
    }, [location]);

    const itemCount = data && data.cart ? data.cart.total_quantity : 0;

    const handleTriggerClick = useCallback(() => {
        // Open the mini cart.
        setMiniCartIsOpen(isOpen => !isOpen);
    }, [setMiniCartIsOpen]);

    const handleLinkClick = useCallback(() => {
        // Send the user to the cart page.
        history.push('/cart');
    }, [history]);

    return {
        handleLinkClick,
        handleTriggerClick,
        itemCount,
        isPhone,
        miniCartIsOpen,
        miniCartRef,
        hideCartTrigger: isHidden,
        setMiniCartIsOpen,
        miniCartTriggerRef
    };
};
