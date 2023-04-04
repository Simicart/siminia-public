import { useCallback, useEffect, useMemo } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';

export const useProductListingTableActions = props => {
    const {
        mutations: { massUpdateShoppingCart, massRemoveItemInCart },
        setIsCartUpdating
    } = props;


    const [
        massRemoveItem,
        {
            called: removeItemCalled,
            error: removeItemError,
            loading: removeItemLoading
        }
    ] = useMutation(massRemoveItemInCart);

  
    const [
        massUpdateItem,
        {
            loading: updateItemLoading,
            error: updateError,
            called: updateItemCalled
        }
    ] = useMutation(massUpdateShoppingCart);


    useEffect(() => {
        if (updateItemCalled || removeItemCalled) {
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

    const derivedErrorMessage = useMemo(() => {
        if (!updateError && !removeItemError) return null;

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
    }, [removeItemError, updateError]);


    const handleMassRemoveItem = useCallback(() => {
        massRemoveItem({
            variables: {
                cartId,
                itemId: 1
            }
        });
    }, [cartId, massRemoveItem]);


    const handleMassUpdateItem = useCallback(
        async (inputCartItems, deleteAll = false) => {
            try {
                await massUpdateItem({
                    variables: {
                        cartId,
                        inputCartItems
                    }
                });
                //need to use location to redirect cause the result is not right when mass delete more than 2 items
                if (deleteAll)
                    window.location.reload()
            } catch (err) {
                // Do nothing. The error message is handled above.
            }
        },
        [cartId, massUpdateItem]
    );

    return {
        errorMessage: derivedErrorMessage,
        handleMassRemoveItem,
        handleMassUpdateItem
    };

  
};
