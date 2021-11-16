import { useCallback, useEffect, useState, useMemo } from 'react';
import { simiUseQuery } from 'src/simi/Network/Query';
import Identify from 'src/simi/Helper/Identify';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useCartPage = props => {
    const {
        queries: { getCartDetails }
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }] = useCartContext();

    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const { called, data, loading, error } = simiUseQuery(getCartDetails, {
        fetchPolicy: 'cache-and-network',
        // Don't make this call if we don't have a cartId
        skip: !cartId,
        variables: { cartId },
        errorPolicy: 'all'
    });

    const errors = useMemo(() => {
        const errors = [];

        if (error && error.graphQLErrors) {
            error.graphQLErrors.forEach(({ message }) => {
                errors.push(message);
            });
        }
        try {
            const storeConfig = Identify.getStoreConfig();
            const saleConfig = storeConfig.simiStoreConfig.config.sales;
            if (data && parseInt(saleConfig.sales_minimum_order_active)) {
                const grandTotal = data.cart.prices.grand_total.value;
                const minOrderAmt = parseFloat(
                    saleConfig.sales_minimum_order_amount
                );
                if (grandTotal && grandTotal < minOrderAmt) {
                    errors.push(saleConfig.sales_minimum_order_description);
                }
            }
        } catch (err) {}
        return errors;
    }, [error, data]);

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    useEffect(() => {
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [loading]);

    const hasItems = !!(data && data.cart && data.cart.total_quantity);
    const shouldShowLoadingIndicator = called && loading && !hasItems;

    return {
        hasItems,
        handleSignIn,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        cart: data && data.cart ? data.cart : null,
        errors,
        queryError: error
    };
};
