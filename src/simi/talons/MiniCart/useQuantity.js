import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CartPage/ProductListing/product.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useQuantity = props => {
    const {
        item,
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        updateItemQuantityMutation,
    } = operations;  
    const [
        updateItemQuantity,
        {
            loading: updateItemLoading,
            error: updateError,
            called: updateItemCalled
        }
    ] = useMutation(updateItemQuantityMutation);

    const [{ cartId }] = useCartContext();

    const [displayError, setDisplayError] = useState(false);
    const derivedErrorMessage = useMemo(() => {
        return (
            (displayError &&
                deriveErrorMessage([updateError])) ||
            ''
        );
    }, [displayError, updateError]);


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
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
            }
        },
        [cartId, item.id, updateItemQuantity]
    );

    return {
        errorMessage: derivedErrorMessage,
        handleUpdateItemQuantity,
    };
};
