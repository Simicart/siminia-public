import { useState , useEffect } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { simiUseQuery } from 'src/simi/Network/Query';

export const useMiniCart = props => {
    const {
        queries: { getCartDetails }
    } = props;
    const [{ cartId }] = useCartContext();
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const [activeEditItem, setActiveEditItem] = useState(null);
    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const { called, data, loading } = simiUseQuery(getCartDetails, {
        fetchPolicy: 'cache-and-network',
        // Don't make this call if we don't have a cartId
        skip: !cartId,
        variables: { cartId }
    });


    useEffect(() => {
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [loading]);


    const hasItems = !!(data && data.cart.total_quantity);
    const shouldShowLoadingIndicator = called && loading && !hasItems;

    return {
        hasItems,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        cart: (data && data.cart) ? data.cart: null,
        isOpen : drawer === 'cart',
        closeDrawer,
        activeEditItem,
        setActiveEditItem
    };
};
