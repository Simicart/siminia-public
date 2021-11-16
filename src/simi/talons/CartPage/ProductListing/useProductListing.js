import { useEffect, useState } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useProductListing = props => {
    const {
        queries: { getProductListing }
    } = props;

    const [{ cartId }] = useCartContext();
    const [activeEditItem, setActiveEditItem] = useState(null);

    const [
        fetchProductListing,
        { called, data, error, loading }
    ] = useLazyQuery(getProductListing);

    useEffect(() => {
        if (cartId) {
            fetchProductListing({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchProductListing]);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    let items = [];
    if (called && !error && !loading) {
        items = data.cart.items;
    }

    return {
        activeEditItem,
        isLoading: !!loading,
        items,
        setActiveEditItem
    };
};
