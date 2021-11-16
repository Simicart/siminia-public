import { useState, useCallback } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { showToastSuccess } from 'src/simi/Helper/MessageSuccess';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

export const useCompare = (props) => {
    const { cartId, history, product_url, updateCompare, mutations: { addSimpleToCartMutation } } = props;
    const [quickView, setQuickView] = useState(false);

    const handleQuickView = useCallback((qc) => {
        setQuickView(qc);
    }, [setQuickView]);

    const handleDeleteCompare = useCallback((itemId) => {
        let listItem = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product');
        if (listItem) {
            const itemToRemove = listItem.findIndex(item => itemId === item.id);

            if (itemToRemove !== -1) {
                listItem.splice(itemToRemove, 1)
                Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'compare_product', listItem);
                listItem = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product');
                if (Array.isArray(listItem) && listItem.length === 0) {
                    localStorage.removeItem('compare_product');
                }
            }
        }
        updateCompare() // update compare from listing
        showToastSuccess(Identify.__('Remove item successfully !'))
    }, [updateCompare]);

    const [addCart, { error: addCartError, loading: loading }] = useMutation(addSimpleToCartMutation);

    const handleAddCart = useCallback(
        async item => {
            if (item.type_id === 'simple' && (!item.hasOwnProperty('options') || (item.hasOwnProperty('options') && item.options === null))) {
                showFogLoading();
                try {
                    await addCart({
                        variables: {
                            cartId,
                            sku: item.sku,
                            quantity: 1
                        }
                    });
                    hideFogLoading();
                    showToastSuccess('Add product to cart successfully!');
                } catch (error) {
                    hideFogLoading();
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                }
            } else {
                history.push(product_url);
            }
        }, []);

    let derivedErrorMessage;
    if (addCartError) {
        if (addCartError.graphQLErrors) {
            derivedErrorMessage = addCartError.graphQLErrors.map(({ message }) => message).join(', ');
        } else {
            derivedErrorMessage = addCartError.message;
        }
    }

    return {
        quickView,
        handleQuickView,
        handleDeleteCompare,
        handleAddCart,
        loading,
        derivedErrorMessage
    }

}
