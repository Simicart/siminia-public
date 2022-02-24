import React, {Fragment, useMemo} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Heart, Trash2} from 'react-feather';
import {gql} from '@apollo/client';
import {Link} from 'react-router-dom';
import {useProduct} from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';

import {useStyle} from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import Kebab from '@magento/venia-ui/lib/components/LegacyMiniCart/kebab';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Section from '@magento/venia-ui/lib/components/LegacyMiniCart/section';
import AddToListButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import {Quantity} from '../Quantity';

import defaultClasses from '../../../core/Cart/ProductListing/product.module.css';
import defaultClasses_1 from './CartProduct.module.css'
import {CartPageFragment} from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import {
    AvailableShippingMethodsCartFragment
} from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
import {func} from 'prop-types';
import {ConfirmPopup} from "../ConfirmPopup";
import {PriceWithColor} from "../PriceWithColor";
import {configColor} from "../../../../Config";

const IMAGE_SIZE = 100;

const HeartIcon = <Icon size={16} src={Heart}/>;

const CartProduct = props => {
    const {item} = props;

    const {formatMessage} = useIntl();
    const talonProps = useProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION, updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        }, ...props
    });
    const {
        addToWishlistProps,
        errorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        isEditable,
        product,
        isProductUpdating
    } = talonProps;

    const {
        currency, image, name, options, quantity, stockStatus, unitPrice, urlKey, urlSuffix
    } = product;
    const classes = useStyle(defaultClasses, defaultClasses_1, props.classes);

    const itemClassName = isProductUpdating ? classes.item_disabled : classes.item;

    const editItemSection = isEditable ? (<Section
        text={formatMessage({
            id: 'product.editItem', defaultMessage: 'Edit item'
        })}
        onClick={handleEditItem}
        icon="Edit2"
    />) : null;

    const itemLink = useMemo(() => resourceUrl(`/${urlKey}${urlSuffix || ''}`), [urlKey, urlSuffix]);

    const stockStatusMessage = stockStatus === 'OUT_OF_STOCK' ? formatMessage({
        id: 'product.outOfStock', defaultMessage: 'Sold out'
    }) : '';

    const optionText = [];
    if (item.configurable_options && item.configurable_options.length) {
        item.configurable_options.map((configurable_option, cfo_idx) => {
            optionText.push(<div key={cfo_idx} className={classes.optionLabel}>
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
            </div>);
        });
    }
    if (item.bundle_options && item.bundle_options.length) {
        item.bundle_options.map((bundle_option, cfo_idx) => {
            optionText.push(<div key={cfo_idx} className={classes.optionLabel}>
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
            </div>);
        });
    }
    let customizable_options;
    if (item.customizable_options && item.customizable_options.length) customizable_options = item.customizable_options; else if (item.virtual_customizable_options && item.virtual_customizable_options.length) customizable_options = item.virtual_customizable_options; else if (item.downloadable_customizable_options && item.downloadable_customizable_options.length) customizable_options = item.downloadable_customizable_options; else if (item.bundle_customizable_options && item.bundle_customizable_options.length) customizable_options = item.bundle_customizable_options;

    if (customizable_options) {
        customizable_options.map((customizable_option, cfo_idx) => {
            optionText.push(<div key={cfo_idx} className={classes.optionLabel}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: customizable_option.label
                        }}
                    />
                :
                {customizable_option.values[0].label ? (customizable_option.values[0].label) : (<span
                    dangerouslySetInnerHTML={{
                        __html: customizable_option.values[0].value
                    }}
                />)}
            </div>);
        });
    }
    if (item.links && item.links.length) {
        item.links.map((link, cfo_idx) => {
            optionText.push(<div key={cfo_idx} className={classes.optionLabel}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: link.title
                        }}
                    />
            </div>);
        });
    }
    const itemOption = Array.isArray(optionText) && optionText.length ? (
        <div className={classes.options}>{optionText.reverse()}</div>) : ('');

    const pricePiece = (
        <div>
            <span className={classes.price}>
                <span className={classes.labelPrice}/>
                <PriceWithColor currencyCode={currency} value={unitPrice}/>
                <FormattedMessage
                    id={'product.price'}
                    defaultMessage={' ea.'}
                />
            </span>
        </div>
    )
    return (
        <div className={classes.root}>
            <span className={classes.errorText}>{errorMessage}</span>
            <div className={itemClassName}>
                <Link to={itemLink} className={classes.imageContainer}>
                    <Image
                        alt={name}
                        classes={{
                            root: classes.imageRoot, image: classes.image
                        }}
                        width={IMAGE_SIZE}
                        resource={image}
                    />
                    {!!stockStatusMessage && (
                        <span className={classes.stockStatusMessage}>
                            {stockStatusMessage}
                        </span>
                    )}
                </Link>
                <div className={classes.details}>
                    <div className={classes.upperTools}>
                        <div className={classes.name}>
                            <Link to={itemLink}>{name}</Link>
                        </div>
                        <ConfirmPopup
                            trigger={
                                <Trash2 size={13} className={classes.deleteIcon} color={configColor.icon_color}/>
                            }
                            content={<FormattedMessage
                                id={'Delete Warning'}
                                defaultMessage={'Are you sure about remove\n' +
                                    ' this item from the shopping cart?'}
                            />
                            }
                            confirmCallback={handleRemoveFromCart}
                        />
                    </div>
                    <div className={classes.secondaryContainer}>
                        <div className={classes.optionContainer}>
                            {itemOption}
                        </div>
                        <div className={classes.lowerTools}>
                            {pricePiece}
                        </div>
                    </div>

                    <div className={classes.quantityContainer}>
                        <Quantity
                            itemId={item.id}
                            initialValue={quantity}
                            onChange={handleUpdateItemQuantity}
                        />
                    </div>
                </div>
            </div>
        </div>);
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
