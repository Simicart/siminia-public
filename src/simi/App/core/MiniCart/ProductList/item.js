import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { string, number, shape, func, arrayOf, oneOf } from 'prop-types';
import { Trash2 as DeleteIcon } from 'react-feather';
import { Link } from 'react-router-dom';

import Price from '@magento/venia-ui/lib/components/Price';
import { useItem } from '@magento/peregrine/lib/talons/MiniCart/useItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import ProductOptions from './productOptions';
import Image from '@magento/venia-ui/lib/components/Image';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { useStyle } from '@magento/venia-ui/lib/classify';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';

import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
import { gql } from '@apollo/client';

import defaultClasses from './item.module.css';
import Quantity from '../../Cart/ProductListing/quantity';
import { useQuantity } from '../../../../talons/MiniCart/useQuantity';
import { configColor } from 'src/simi/Config';
import { taxConfig } from '../../../../Helper/Pricing';

const Item = props => {
    const {
        classes: propClasses,
        product,
        id,
        quantity,
        configurable_options,
        downloadable_customizable_options,
        bundle_options,
        customizable_options,
        handleRemoveItem,
        prices,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix,
        item
    } = props;
    const merchantTaxConfig = taxConfig();
    const showExcludedTax =
        merchantTaxConfig &&
        merchantTaxConfig.tax_cart_display_price &&
        parseInt(merchantTaxConfig.tax_cart_display_price) === 1;
    const { formatMessage } = useIntl();
    const talonProps = useQuantity({
        operations: {
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });

    const { handleUpdateItemQuantity } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);
    const itemLink = useMemo(
        () => resourceUrl(`/${product.url_key}${storeUrlSuffix || ''}`),
        [product.url_key, storeUrlSuffix]
    );
    const stockStatusText =
        product.stock_status === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'productList.outOfStock',
                  defaultMessage: 'Out-of-stock'
              })
            : '';

    const { isDeleting, removeItem } = useItem({
        id,
        handleRemoveItem
    });

    const rootClass = isDeleting ? classes.root_disabled : classes.root;
    const configured_variant = configuredVariant(configurable_options, product);

    return (
        <div className={rootClass}>
            <Link
                className={classes.thumbnailContainer}
                to={itemLink}
                onClick={closeMiniCart}
            >
                <Image
                    alt={product.name}
                    classes={{
                        root: classes.thumbnail
                    }}
                    width={100}
                    resource={
                        configurableThumbnailSource === 'itself' &&
                        configured_variant &&
                        configured_variant.thumbnail &&
                        configured_variant.thumbnail.url
                            ? configured_variant.thumbnail.url
                            : product.thumbnail.url
                    }
                />
            </Link>
            <Link
                className={classes.name}
                to={itemLink}
                onClick={closeMiniCart}
            >
                {product.name}
            </Link>
            <ProductOptions
                options={
                    configurable_options ||
                    downloadable_customizable_options ||
                    bundle_options ||
                    customizable_options
                }
                classes={{
                    options: classes.options
                }}
            />
            {/* <span className={classes.quantity}>
                <FormattedMessage
                    id={'productList.quantity'}
                    defaultMessage={'Qty :'}
                    values={{ quantity }}
                />
            </span> */}
            <div className={classes.quantity}>
                <Quantity
                    itemId={item.id}
                    initialValue={quantity}
                    onChange={handleUpdateItemQuantity}
                />
                <button
                    onClick={removeItem}
                    type="button"
                    className={classes.deleteButton}
                    disabled={isDeleting}
                >
                    <Icon
                        size={16}
                        src={DeleteIcon}
                        classes={{
                            icon: classes.editIcon
                        }}
                    />
                </button>
            </div>
            <span
                style={{ color: configColor.price_color }}
                className={classes.price}
            >
                {showExcludedTax || !item.prices.row_total_including_tax ? (
                    <Price
                        currencyCode={prices.price.currency}
                        value={prices.price.value}
                    />
                ) : (
                    <Price
                        currencyCode={prices.row_total_including_tax.currency}
                        value={prices.row_total_including_tax.value}
                    />
                )}
                <FormattedMessage
                    id={'productList.each'}
                    defaultMessage={' ea.'}
                />
            </span>
            <span className={classes.stockStatus}>{stockStatusText}</span>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        editButton: string,
        editIcon: string
    }),
    product: shape({
        name: string,
        thumbnail: shape({
            url: string
        })
    }),
    id: string,
    quantity: number,
    configurable_options: arrayOf(
        shape({
            id: number,
            option_label: string,
            value_id: number,
            value_label: string
        })
    ),
    handleRemoveItem: func,
    prices: shape({
        price: shape({
            value: number,
            currency: string
        })
    }),
    configured_variant: shape({
        thumbnail: shape({
            url: string
        })
    }),
    configurableThumbnailSource: oneOf(['parent', 'itself'])
};

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
