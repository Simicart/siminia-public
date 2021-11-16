import { useEffect, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const usePriceSummary = props => {
    const {
        queries: { getPriceSummary }
    } = props;

    const [{ cartId }] = useCartContext();
    const history = useHistory();
    // We don't want to display "Estimated" or the "Proceed" button in checkout.
    const match = useRouteMatch('/checkout.html');
    const isCheckout = !!match;

    const { error, loading, data } = useQuery(getPriceSummary, {
        fetchPolicy: 'cache-and-network',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    useEffect(() => {
        if (error) {
            console.error('GraphQL Error:', error);
        }
    }, [error]);

    const handleProceedToCheckout = useCallback(() => {
        history.push('/checkout');
    }, [history]);

    return {
        handleProceedToCheckout,
        hasError: !!error,
        hasItems: data && !!data.cart.items.length,
        isCheckout,
        isLoading: !!loading,
        cartPrices: (data && data.cart) ? data.cart.prices : null,
        cartShipping: (data && data.cart && data.cart.shipping_addresses &&
            data.cart.shipping_addresses[0] && data.cart.shipping_addresses[0].selected_shipping_method) ?
            data.cart.shipping_addresses[0].selected_shipping_method : null
    };
};
