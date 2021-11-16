import { useCallback, useEffect, useState } from 'react';
import { useApolloClient, useQuery, useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useWindowSize } from '@magento/peregrine';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { gql } from '@apollo/client';

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
        storeConfig,
        isBasicTheme
    } = props;
    const history = useHistory()
    const apolloClient = useApolloClient();
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const [{ isSignedIn }, { signOut }] = useUserContext();
    const [reloadInterval, setReloadInterval] = useState(1)
    const [{ cartId }, { getCartDetails }] = useCartContext();
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
        skip: (!cartId || !isSignedIn),
    });

    useEffect(() => {
        if (
            userIsAuthedData && userIsAuthedData.simiCheckUserIsAuthed &&
            (userIsAuthedData.simiCheckUserIsAuthed.token_valid === false || userIsAuthedData.simiCheckUserIsAuthed.cart_editable === false)
        ) {
            signOut();
            setTimeout(function () {
                window.location.replace('/');
            }, 500);
        }
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setReloadInterval(reloadInterval => reloadInterval + 1);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const itemCount = (data && data.cart) ? data.cart.total_quantity : 0;

    const handleClick = useCallback(async () => {
        if (isBasicTheme && history) {
            history.push('/cart.html');
        } else if (isPhone && history)
            history.push('/cart.html');
        else
            toggleDrawer('cart')
    }, [history, isPhone, toggleDrawer, isBasicTheme]);

    return {
        handleClick,
        itemCount,
        isPhone
    };
};
