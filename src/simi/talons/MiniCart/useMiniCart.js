import { useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/MiniCart/miniCart.gql';
import Identify from 'src/simi/Helper/Identify';

/**
 *
 * @param {Function} props.setIsOpen - Function to toggle the mini cart
 * @param {DocumentNode} props.operations.miniCartQuery - Query to fetch mini cart data
 * @param {DocumentNode} props.operations.removeItemMutation - Mutation to remove an item from cart
 *
 * @returns {
 *      closeMiniCart: Function,
 *      errorMessage: String,
 *      handleEditCart: Function,
 *      handleProceedToCheckout: Function,
 *      handleRemoveItem: Function,
 *      loading: Boolean,
 *      productList: Array<>,
 *      subTotal: Number,
 *      totalQuantity: Number
 *      configurableThumbnailSource: String
 *  }
 */
 const flattenData = data => {
    if (!data) return {};
    return {
        subtotal: data.cart.prices.subtotal_excluding_tax,
        total: data.cart.prices.grand_total,
        discounts: data.cart.prices.discounts,
        giftCards: data.cart.applied_gift_cards,
        taxes: data.cart.prices.applied_taxes,
        shipping: data.cart.shipping_addresses,
        rewardPoint: {  
            earnPoint: data?.cart?.earn_point,
            spentPoint: data?.cart?.spent_point
        }
    };
};


export const useMiniCart = props => {
    const { setIsOpen } = props;
    const storeConfig = Identify.getStoreConfig();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        removeItemMutation,
        miniCartQuery,
        // getStoreConfigQuery
    } = operations;

    const [{ cartId }] = useCartContext();
    const history = useHistory();

    const match = useRouteMatch('/checkout');
    const isCheckout = !!match;

    const { data: miniCartData, loading: miniCartLoading } = useQuery(
        miniCartQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: { cartId },
            skip: !cartId
        }
    );
    // const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
    //     fetchPolicy: 'cache-and-network'
    // });

    const configurableThumbnailSource = useMemo(() => {
        if (storeConfig && storeConfig.storeConfig) {
            return storeConfig.storeConfig.configurable_thumbnail_source;
        }
    }, [storeConfig]);

    const storeUrlSuffix = useMemo(() => {
        if (storeConfig && storeConfig.storeConfig) {
            return storeConfig.storeConfig.product_url_suffix;
        }
    }, [storeConfig]);

    const [
        removeItem,
        {
            loading: removeItemLoading,
            called: removeItemCalled,
            error: removeItemError
        }
    ] = useMutation(removeItemMutation);

    const productList = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData.cart.items;
        }
    }, [miniCartData, miniCartLoading]);

    const closeMiniCart = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const handleRemoveItem = useCallback(
        async id => {
            try {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: id
                    }
                });
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, removeItem]
    );

    const handleProceedToCheckout = useCallback(() => {
        setIsOpen(false);
        history.push('/checkout');
    }, [history, setIsOpen]);

    const handleEditCart = useCallback(() => {
        setIsOpen(false);
        history.push('/cart');
    }, [history, setIsOpen]);

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([removeItemError]),
        [removeItemError]
    );

    return {
        closeMiniCart,
        errorMessage: derivedErrorMessage,
        handleEditCart,
        handleProceedToCheckout,
        handleRemoveItem,
        loading: miniCartLoading || (removeItemCalled && removeItemLoading),
        productList,
        configurableThumbnailSource,
        storeUrlSuffix,
        flatData: flattenData(miniCartData),
        isCheckout
    };
};
