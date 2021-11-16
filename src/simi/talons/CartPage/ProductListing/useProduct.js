import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';

export const useProduct = props => {
    const {
        item,
        mutations: { removeItemMutation, updateItemQuantityMutation },
        setActiveEditItem,
        setIsCartUpdating
    } = props;

    const flatProduct = flattenProduct(item);

    const [
        removeItem,
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

    useEffect(() => {
        if (updateItemCalled || removeItemCalled) {
            // If a product mutation is in flight, tell the cart.
            setIsCartUpdating(updateItemLoading || removeItemLoading);
        }

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [
        removeItemCalled,
        removeItemLoading,
        setIsCartUpdating,
        updateItemCalled,
        updateItemLoading
    ]);

    const [{ cartId }] = useCartContext();
    const [{ drawer }, { toggleDrawer }] = useAppContext();

    const [isFavorite, setIsFavorite] = useState(false);

    const derivedErrorMessage = useMemo(() => {
        if (!updateError && !removeItemError) return null;
        setIsCartUpdating(false)
        const errorTarget = updateError || removeItemError;

        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            return errorTarget.graphQLErrors
                .map(({ message, debugMessage }) => debugMessage ? debugMessage : message)
                .join(', ');
        }

        // A non-GraphQL error occurred.
        return errorTarget.message;
    }, [removeItemError, updateError, setIsCartUpdating]);

    const handleToggleFavorites = useCallback(() => {
        setIsFavorite(!isFavorite);
    }, [isFavorite]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);
        toggleDrawer('product.edit');
    }, [item, setActiveEditItem, toggleDrawer]);

    useEffect(() => {
        if (drawer === null) {
            setActiveEditItem(null);
        }
    }, [drawer, setActiveEditItem]);

    const handleRemoveFromCart = useCallback(
        async () => {
            await removeItem({
                variables: {
                    cartId,
                    itemId: item.id
                }
            });
            setIsCartUpdating(false)
        }, [cartId, item.id, removeItem, setIsCartUpdating]);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: item.id,
                        quantity
                    }
                });
                setIsCartUpdating(false)
            } catch (err) {
                // Do nothing. The error message is handled above.
            }
        },
        [cartId, item.id, updateItemQuantity, setIsCartUpdating]
    );

    return {
        errorMessage: derivedErrorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isEditable: !!flatProduct.options.length,
        isFavorite,
        product: flatProduct
    };
};

const flattenProduct = item => {
    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const { price } = prices;
    const { value: unitPrice, currency } = price;

    const { name, small_image } = product;
    const { url: image } = small_image;

    return { currency, image, name, options, quantity, unitPrice };
};
