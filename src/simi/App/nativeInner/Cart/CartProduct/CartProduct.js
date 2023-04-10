import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { VscTrash } from 'react-icons/vsc';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useProduct } from '../productHook';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Section from '@magento/venia-ui/lib/components/LegacyMiniCart/section';
import { Quantity } from '../Quantity';
import { useMutation } from '@apollo/client'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from '../../../core/Cart/ProductListing/product.module.css';
import defaultClasses_1 from './CartProduct.module.css';
import { CartPageFragment } from 'src/simi/App/nativeInner/CartCore/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
import { ConfirmPopup } from '../ConfirmPopup';
import { PriceWithColor } from '../PriceWithColor';
import { configColor } from '../../../../Config';
import { bottomNotificationType } from '../bottomNotificationHook';
import { taxConfig } from '../../../../Helper/Pricing';
import { XCircle } from 'react-feather';

import ADD_PRODUCT_TO_CART from '../../../../../abenson-cart/talons/useAddProductToCart';

const IMAGE_SIZE = 100;

const CartProduct = props => {
    const { item, makeNotification } = props;
    const [check, setCheck] = useState(true)

    const [
        addProductToCart,
        { loading }
    ] = useMutation(ADD_PRODUCT_TO_CART);

    const cart_id = JSON.parse(
        localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')
    ).value;

    const merchantTaxConfig = taxConfig();
    const showExcludedTax =
        merchantTaxConfig &&
        merchantTaxConfig.tax_cart_display_price &&
        parseInt(merchantTaxConfig.tax_cart_display_price) === 1;

    const { formatMessage } = useIntl();
    const talonProps = useProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });
    const {
        addToWishlistProps,
        errorMessage,
        handleEditItem,
        handleRemoveFromCart: _handleRemoveFromCart,
        handleUpdateItemQuantity: _handleUpdateItemQuantity,
        isEditable,
        product,
        isProductUpdating
    } = talonProps;

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            return (
                _handleUpdateItemQuantity(quantity)
                    .then(_ => {
                        makeNotification({
                            text: formatMessage({
                                id: 'cart.successUpdateQuantity',
                                defaultMessage: 'Successfully updated quantity'
                            }),
                            type: bottomNotificationType.SUCCESS
                        });
                    })
                    // this will override error display from network
                    .catch(_ => {
                        makeNotification({
                            text: formatMessage({
                                id: 'cart.failureUpdateQuantity',
                                defaultMessage: 'Failed to update quantity'
                            }),
                            type: bottomNotificationType.FAIL
                        });
                    })
            );
        },
        [_handleUpdateItemQuantity, makeNotification, formatMessage]
    );

    const handleRemoveFromCart = useCallback(async () => {
        return (
            _handleRemoveFromCart()
                .then(_ => {
                    makeNotification({
                        text: formatMessage({
                            id: 'cart.successRemoveProduct',
                            defaultMessage: 'Successfully removed product'
                        }),
                        type: bottomNotificationType.SUCCESS
                    });
                })
                // this will override error display from network
                .catch(_ => {
                    makeNotification({
                        text: formatMessage({
                            id: 'cart.failureRemoveProduct',
                            defaultMessage: 'Failed to remove product'
                        }),
                        type: bottomNotificationType.FAIL
                    });
                })
        );
    }, [_handleRemoveFromCart, makeNotification, formatMessage]);

    const {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix
    } = product;
    const classes = useStyle(defaultClasses, defaultClasses_1, props.classes);

    const handleAddToCart = useCallback(async () => {
        let options = []
        if (item.__typename === 'ConfigurableCartItem') {
            for (let i = 0; i < product.options.length; i++) {
                options.push(product.options[i].configurable_product_option_value_uid)
            }
        }
        return (
            addProductToCart({
                variables: {
                    cartId: cart_id.slice(1, cart_id.length - 1),
                    cartItems: [{
                        sku: item.product.sku,
                        quantity: product.quantity,
                        ...(item.__typename === 'ConfigurableCartItem' && {
                            selected_options: options
                        })
                    }]
                }
            }).then(_ => {
                    makeNotification({
                        text: formatMessage({
                            id: 'Successfully add product',
                            defaultMessage: 'Successfully add product'
                        }),
                        type: bottomNotificationType.SUCCESS
                    });
                })
                // this will override error display from network
                .catch(_ => {
                    makeNotification({
                        text: formatMessage({
                            id: 'Failed to add product',
                            defaultMessage: 'Failed to add product'
                        }),
                        type: bottomNotificationType.FAIL
                    });
                })
        );
    }, [addProductToCart, makeNotification, formatMessage]);

    const itemClassName = isProductUpdating
        ? classes.item_disabled
        : classes.item;

    const editItemSection = isEditable ? (
        <Section
            text={formatMessage({
                id: 'product.editItem',
                defaultMessage: 'Edit item'
            })}
            onClick={handleEditItem}
            icon="Edit2"
        />
    ) : null;

    const itemLink = useMemo(
        () => resourceUrl(`/${urlKey}${urlSuffix || ''}`),
        [urlKey, urlSuffix]
    );

    const stockStatusMessage =
        stockStatus === 'OUT_OF_STOCK'
            ? formatMessage({
                id: 'product.outOfStock',
                defaultMessage: 'Sold out'
            })
            : '';

    const optionText = [];
    if (item.configurable_options && item.configurable_options.length) {
        item.configurable_options.map((configurable_option, cfo_idx) => {
            optionText.push(
                <div key={cfo_idx} className={classes.optionLabel}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: configurable_option.option_label
                        }}
                    />
                    :
                    <span
                        dangerouslySetInnerHTML={{
                            __html: configurable_option.value_label
                        }}
                    />
                </div>
            );
        });
    }
    if (item.bundle_options && item.bundle_options.length) {
        item.bundle_options.map((bundle_option, cfo_idx) => {
            optionText.push(
                <div key={cfo_idx} className={classes.optionLabel}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: bundle_option.label
                        }}
                    />
                    :
                    <span
                        dangerouslySetInnerHTML={{
                            __html: bundle_option.values[0].label
                        }}
                    />
                    (
                    <span
                        dangerouslySetInnerHTML={{
                            __html: bundle_option.values[0].quantity
                        }}
                    />
                    )
                </div>
            );
        });
    }
    let customizable_options;
    if (item.customizable_options && item.customizable_options.length)
        customizable_options = item.customizable_options;
    else if (
        item.virtual_customizable_options &&
        item.virtual_customizable_options.length
    )
        customizable_options = item.virtual_customizable_options;
    else if (
        item.downloadable_customizable_options &&
        item.downloadable_customizable_options.length
    )
        customizable_options = item.downloadable_customizable_options;
    else if (
        item.bundle_customizable_options &&
        item.bundle_customizable_options.length
    )
        customizable_options = item.bundle_customizable_options;

    if (customizable_options) {
        customizable_options.map((customizable_option, cfo_idx) => {
            optionText.push(
                <div key={cfo_idx} className={classes.optionLabel}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: customizable_option.label
                        }}
                    />
                    :
                    {customizable_option.values[0].label ? (
                        customizable_option.values[0].label
                    ) : (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: customizable_option.values[0].value
                            }}
                        />
                    )}
                </div>
            );
        });
    }
    if (item.giftcard_options && item.giftcard_options.length) {
        const gcOptions = item.giftcard_options.slice(2, item.giftcard_options.length)
        gcOptions.map((gcOption, index) => {
            optionText.push(
                <div key={index} className={classes.optionLabel}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: gcOption.code
                        }}
                    />
                    :
                    <span
                        dangerouslySetInnerHTML={{
                            __html: gcOption.value
                        }}
                    />
                </div>
            );
        })
    }

    if (item.links && item.links.length) {
        item.links.map((link, cfo_idx) => {
            optionText.push(
                <div key={cfo_idx} className={classes.optionLabel}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: link.title
                        }}
                    />
                </div>
            );
        });
    }
    const itemOption =
        Array.isArray(optionText) && optionText.length ? (
            <div className={classes.options}>{optionText.reverse()}</div>
        ) : (
            ''
        );

    const pricePiece = (
        <div>
            <span className={classes.price}>
                <span className={classes.labelPrice} />
                <PriceWithColor currencyCode={item.prices.price.currency} value={item.prices.price.value} />
                {/* {showExcludedTax || !item.prices.row_total_including_tax ? (
                    <PriceWithColor currencyCode={currency} value={unitPrice} />
                ) : (
                    <PriceWithColor
                        currencyCode={
                            item.prices.row_total_including_tax.currency
                        }
                        value={item.prices.row_total_including_tax.value}
                    />
                )} */}

                {/* <FormattedMessage
                    id={'product.price'}
                    defaultMessage={' ea.'}
                /> */}
            </span>
        </div>
    );

    const pricePieceTotal = (
        <div>
            <span className={classes.price}>
                <span className={classes.labelPrice} />
                {showExcludedTax || !item.prices.row_total_including_tax ? (
                    <PriceWithColor currencyCode={item.prices.row_total.currency} value={item.prices.row_total.value} color='#383D45' />
                ) : (
                    <PriceWithColor
                        currencyCode={
                            item.prices.row_total_including_tax.currency
                        }
                        value={item.prices.row_total_including_tax.value}
                        color='#383D45'
                    />
                )}

                {/* <FormattedMessage
                    id={'product.price'}
                    defaultMessage={' ea.'}
                /> */}
            </span>
        </div>
    )

    useEffect(() => {
        if (errorMessage) {
            makeNotification({
                text: errorMessage,
                type: bottomNotificationType.FAIL
            });
        }
    }, [errorMessage, makeNotification]);

    return (
        <div className={classes.root}>
            {loading && <div className={classes.loading}>
                {fullPageLoadingIndicator}
            </div>}
            {/*<span className={classes.errorText}>{errorMessage}</span>*/}
            {!!!stockStatusMessage && (<input type='checkbox' className={classes.checkItem} defaultChecked={check}
                onChange={() => {
                    if (check) {
                        handleRemoveFromCart()
                    }
                    else {
                        handleAddToCart()
                    }
                    setCheck(prev => !prev)
                }}></input>)}
            {!!stockStatusMessage && (<div className={classes.stockMessage}>
                <XCircle size={16}></XCircle>
                <p>Out of stock</p>
            </div>)}
            {!!stockStatusMessage && (<ConfirmPopup
                trigger={
                    <VscTrash
                        size={20}
                        className={classes.deleteIconStock}
                        color={configColor.icon_color}
                    />
                }
                content={
                    <FormattedMessage
                        id={'Delete Warning'}
                        defaultMessage={
                            'Are you sure about remove\n' +
                            ' this item from the shopping cart?'
                        }
                    />
                }
                confirmCallback={handleRemoveFromCart}
            />)}

            <div className={!!stockStatusMessage ? classes.item_out_stock : check ? itemClassName : classes.itemUncheck}>
                <Link to={itemLink} className={classes.imageContainer}>
                    <Image
                        alt={name}
                        classes={{
                            root: classes.imageRoot,
                            image: classes.image,
                            placeholder_layoutOnly: `${classes.placeholder_layoutOnly
                                } ${classes.placeholder}`
                        }}
                        width={IMAGE_SIZE}
                        resource={image}
                    />
                </Link>

                <div className={classes.details}>
                    <div className={classes.upperTools}>
                        <div className={classes.name}>
                            <Link to={itemLink}>{name}</Link>
                        </div>
                        {!!!stockStatusMessage && (<ConfirmPopup
                            trigger={
                                <VscTrash
                                    size={20}
                                    className={classes.deleteIcon}
                                    color={configColor.icon_color}
                                />
                            }
                            content={
                                <FormattedMessage
                                    id={'Delete Warning'}
                                    defaultMessage={
                                        'Are you sure about remove\n' +
                                        ' this item from the shopping cart?'
                                    }
                                />
                            }
                            confirmCallback={handleRemoveFromCart}
                        />)}
                    </div>

                    <div className={classes.secondaryContainer}>
                        {!!!stockStatusMessage && (<div className={classes.optionContainer}>
                            {itemOption}
                        </div>)}
                        {/*<div className={classes.lowerTools}>{pricePiece}</div>*/}
                    </div>

                    <div className={!!stockStatusMessage || !check ? classes.quantityOutStock : classes.quantityContainer}>
                        {!!!stockStatusMessage && check && (<Quantity
                            itemId={item.id}
                            initialValue={quantity}
                            onChange={handleUpdateItemQuantity}
                        />)}
                        <div className={classes.lowerTools}>{pricePieceTotal}</div>
                    </div>

                    {/*<div className={classes.priceTotal}>   
                    </div>*/}
                </div>
            </div>
        </div>
    );
};

export default CartProduct;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: Int!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
            @connection(key: "removeItemFromCart") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $itemId, quantity: $quantity }]
            }
        ) @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
