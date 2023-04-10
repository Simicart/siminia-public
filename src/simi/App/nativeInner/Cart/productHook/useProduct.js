import {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {useMutation, useQuery} from '@apollo/client';
import {useCartContext} from '@magento/peregrine/lib/context/cart';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CartPage/ProductListing/product.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import {deriveErrorMessage} from "../../../../../override/deriveErrorMessage";

/**
 * Similar to magento useProduct, but handleRemoveFromCart and handleUpdateItemQuantity
 * throw error if failed, instead of always behaves successfully
 */

export const useProduct = props => {
    const {
        item,
        cartItems,
        setActiveEditItem,
        setIsCartUpdating,
        wishlistConfig
    } = props;

    const findId = cartItems.filter((ele, ind) => ele.product.sku === item.product.sku)
    console.log(findId[0]?.id)

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        removeItemMutation,
        updateItemQuantityMutation,
        getStoreConfigQuery
    } = operations;

    const {formatMessage} = useIntl();

    const {data: storeConfigData} = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const configurableThumbnailSource = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.configurable_thumbnail_source;
        }
    }, [storeConfigData]);

    const storeUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    const flatProduct = flattenProduct(
        item,
        configurableThumbnailSource,
        storeUrlSuffix
    );

    const [
        removeItemFromCart,
        {
            called: removeItemCalled,
            error: removeItemError,
            loading: removeItemLoading
        }
    ] = useMutation(removeItemMutation);

    const [
        updateItemQuantity,
        {
            loading: updateItemLoading,
            error: updateError,
            called: updateItemCalled
        }
    ] = useMutation(updateItemQuantityMutation);

    const [{cartId}] = useCartContext();

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const isProductUpdating = useMemo(() => {
        if (updateItemCalled || removeItemCalled) {
            return removeItemLoading || updateItemLoading;
        } else {
            return false;
        }
    }, [
        updateItemCalled,
        removeItemCalled,
        removeItemLoading,
        updateItemLoading
    ]);

    const derivedErrorMessage = useMemo(() => {
        return (
            (displayError &&
                deriveErrorMessage([updateError, removeItemError])) ||
            ''
        );
    }, [displayError, removeItemError, updateError]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);

        // If there were errors from removing/updating the product, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [item, setActiveEditItem]);

    const handleRemoveFromCart = useCallback(async () => {
        try {
            await removeItemFromCart({
                variables: {
                    cartId,
                    itemId: findId[0].id
                }
            });
            return null
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
            throw err
        }
    }, [cartId, item, cartItems, removeItemFromCart]);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: findId[0].id,
                        quantity
                    }
                });
                return null
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
                throw err
            }
        },
        [cartId, item, cartItems, updateItemQuantity]
    );

    useEffect(() => {
        setIsCartUpdating(isProductUpdating);

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [setIsCartUpdating, isProductUpdating]);

    const addToWishlistProps = {
        afterAdd: handleRemoveFromCart,
        buttonText: () =>
            formatMessage({
                id: 'product.saveForLater',
                defaultMessage: 'Save for later'
            }),
        item: {
            quantity: item.quantity,
            selected_options: item.configurable_options
                ? item.configurable_options.map(
                    option => option.configurable_product_option_value_uid
                )
                : [],
            sku: item.product.sku
        },
        storeConfig: wishlistConfig
    };

    return {
        addToWishlistProps,
        errorMessage: derivedErrorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        isEditable: !!flatProduct.options.length,
        product: flatProduct,
        isProductUpdating
    };
};

const flattenProduct = (item, configurableThumbnailSource, storeUrlSuffix) => {
    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const configured_variant = configuredVariant(options, product);

    const {price} = prices;
    const {value: unitPrice, currency} = price;

    const {
        name,
        small_image,
        stock_status: stockStatus,
        url_key: urlKey
    } = product;
    const {url: image} =
        configurableThumbnailSource === 'itself' && configured_variant
            ? configured_variant.small_image
            : small_image;

    return {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix: storeUrlSuffix
    };
};
