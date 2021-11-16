import { useState, useCallback } from 'react';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';
import { useWindowSize } from '@magento/peregrine';
import Identify from 'src/simi/Helper/Identify';
import { showToastMessage } from 'src/simi/Helper/Message';
import { showToastSuccess } from 'src/simi/Helper/MessageSuccess';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

export const useGridItem = props => {
    const {
        updateCompare,
        handleLink,
        cartId,
        location,
        mutations: { addSimpleToCartMutation }
    } = props;

    const [quickView, setQuickView] = useState(false);
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const handleQuickView = useCallback((state) => {
        setQuickView(state);
    }, [setQuickView]);

    const addProductToCompareList = (item) => {
        const compareLocal = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product') || null;
        let compareProducts;

        if (compareLocal) {
            compareProducts = compareLocal;
        } else {
            compareProducts = [];
        }
        compareProducts.push(item);
        Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'compare_product', compareProducts);
        showToastSuccess(Identify.__('Product has added to your compare list !'));
        if (updateCompare) {
            updateCompare();
        }
    };

    const handleAddCompare = useCallback((item) => {
        const compareLocal = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product') || null;

        if (compareLocal) {
            const checkItemExist = compareLocal.find(({ id }) => id === item.id);
            if (checkItemExist) {
                showToastMessage(Identify.__('Product has already added!'));
            } else {
                addProductToCompareList(item);
            }
        } else {
            addProductToCompareList(item);
        }
    }, [addProductToCompareList]);

    const [addCart, { error: addCartError, loading: loading }] = useMutation(addSimpleToCartMutation);

    const handleAddCart = useCallback(
        async (item, quantity = 1) => {
            if (item.type_id === 'simple' && (!item.hasOwnProperty('options') || (item.hasOwnProperty('options') && item.options === null))) {
                showFogLoading();
                try {
                    await addCart({
                        variables: {
                            cartId,
                            sku: item.sku,
                            quantity
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
                handleLink(location);
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
        isPhone,
        handleAddCompare,
        handleAddCart,
        loading,
        derivedErrorMessage
    };
}
