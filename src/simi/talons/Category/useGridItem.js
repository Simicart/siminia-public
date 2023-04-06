import React, { useState, useCallback, useMemo } from 'react';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';
import { useWindowSize, useToasts } from '@magento/peregrine';
import Identify from 'src/simi/Helper/Identify';
import { ADD_PRODUCT_TO_CART } from 'src/simi/talons/ProductFullDetail/productFullDetail.gql';
import { useIntl } from 'react-intl';
import Icon from '@magento/venia-ui/lib/components/Icon';
import {
    Check as CheckIcon,
    AlertCircle as AlertCircleIcon
} from 'react-feather';

const SuccessIc = <Icon src={CheckIcon} attrs={{ width: 18 }} />;
const ErrIc = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

export const useGridItem = props => {
    const { updateCompare, handleLink, cartId, location } = props;
    // const giftCardLocation = {
    //     ...location,
    //     pathname: `giftcard${location.pathname}`
    // };
    const giftCardLocation = useMemo(() => {
        return { ...location, pathname: `giftcard${location.pathname}` };
    }, [location]);

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const [quickView, setQuickView] = useState(false);
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const handleQuickView = useCallback(
        state => {
            setQuickView(state);
        },
        [setQuickView]
    );

    const addProductToCompareList = item => {
        const compareLocal =
            Identify.getDataFromStoreage(
                Identify.LOCAL_STOREAGE,
                'compare_product'
            ) || null;
        let compareProducts;

        if (compareLocal) {
            compareProducts = compareLocal;
        } else {
            compareProducts = [];
        }
        compareProducts.push(item);
        Identify.storeDataToStoreage(
            Identify.LOCAL_STOREAGE,
            'compare_product',
            compareProducts
        );
        addToast({
            type: 'info',
            icon: SuccessIc,
            message: formatMessage({
                id: 'Product has added to your compare list!'
            }),
            timeout: 3000
        });
        if (updateCompare) {
            updateCompare();
        }
    };

    const handleAddCompare = item => {
        const compareLocal =
            Identify.getDataFromStoreage(
                Identify.LOCAL_STOREAGE,
                'compare_product'
            ) || null;

        if (compareLocal) {
            const checkItemExist = compareLocal.find(
                ({ id }) => id === item.id
            );
            if (checkItemExist) {
                addToast({
                    type: 'info',
                    icon: SuccessIc,
                    message: formatMessage({
                        id: 'Product has already added!'
                    }),
                    timeout: 3000
                });
            } else {
                addProductToCompareList(item);
            }
        } else {
            addProductToCompareList(item);
        }
    };

    const [addCart, { error: addCartError, loading: loading }] = useMutation(
        ADD_PRODUCT_TO_CART
    );

    const handleAddCart = useCallback(
        async (item, quantity = 1) => {
            if (
                item.type_id === 'simple' &&
                (!Object.prototype.hasOwnProperty.call(item, 'options') ||
                    (Object.prototype.hasOwnProperty.call(item, 'options') &&
                        item.options === null))
            ) {
                try {
                    const { data: addProductsToCartData } = await addCart({
                        variables: {
                            cartId,
                            product: [{ sku: item.sku, quantity }]
                        }
                    });

                    if (
                        addProductsToCartData &&
                        addProductsToCartData.addProductsToCart &&
                        addProductsToCartData.addProductsToCart.user_errors &&
                        Array.isArray(
                            addProductsToCartData.addProductsToCart.user_errors
                        ) &&
                        addProductsToCartData.addProductsToCart.user_errors
                            .length > 0
                    ) {
                        const messages = addProductsToCartData.addProductsToCart.user_errors.map(
                            user_error => user_error.message
                        );

                        addToast({
                            type: 'error',
                            icon: ErrIc,
                            message: messages.join(', '),
                            timeout: 3000
                        });
                    } else {
                        addToast({
                            type: 'info',
                            icon: SuccessIc,
                            message:
                                item.name +
                                ' ' +
                                formatMessage({
                                    id: 'was added to your shopping cart'
                                }),
                            timeout: 3000
                        });
                    }
                } catch (error) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                    addToast({
                        type: 'error',
                        icon: ErrIc,
                        message: formatMessage({
                            id: 'Some errors occured. Please try again later'
                        }),
                        timeout: 3000
                    });
                }
            } else {
                if (item.__typename === 'BssGiftCardProduct')
                    handleLink(giftCardLocation);
                else handleLink(location);
            }
        },
        [
            addCart,
            cartId,
            addToast,
            formatMessage,
            handleLink,
            giftCardLocation,
            location
        ]
    );

    let derivedErrorMessage;
    if (addCartError) {
        if (addCartError.graphQLErrors) {
            derivedErrorMessage = addCartError.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
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
};
