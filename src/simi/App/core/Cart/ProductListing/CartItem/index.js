import React from 'react';
import Image from 'src/simi/BaseComponents/Image';
import { configColor } from 'src/simi/Config';
import { HOPrice as Price, taxConfig } from 'src/simi/Helper/Pricing';
import { logoUrl, productUrlSuffix } from 'src/simi/Helper/Url';
import ReactHTMLParse from 'react-html-parser';
import Identify from 'src/simi/Helper/Identify';
import { useProduct } from 'src/simi/talons/CartPage/ProductListing/useProduct';
import { CartPageFragment } from 'src/simi/App/core/Cart/cartPageFragments.gql';
import { AvailableShippingMethodsCartFragment } from '../../PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql';
import gql from 'graphql-tag';
import { showToastMessage } from 'src/simi/Helper/Message';

require('./cartItem.scss');

const reduceVal = qty_id => {
    const qtyField = $(`#${qty_id}`);
    const qty = parseInt(qtyField.val()) - 1;
    if (qty) {
        qtyField.val(qty);
    }
};

const increaseVal = qty_id => {
    const qtyField = $(`#${qty_id}`);
    const qty = parseInt(qtyField.val()) + 1;
    qtyField.val(qty);
};

const CartItem = props => {
    const {
        currencyCode,
        item,
        handleLink,
        miniOrMobile,
        setIsCartUpdating,
        setActiveEditItem
    } = props;
    const product = item.product ? item.product : {};

    const talonProps = useProduct({
        item,
        mutations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        setActiveEditItem,
        setIsCartUpdating
    });

    const {
        errorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isEditable,
        isFavorite
    } = talonProps;

    const optionText = [];

    if (errorMessage) {
        showToastMessage(errorMessage);
    }
    if (item.configurable_options && item.configurable_options.length) {
        item.configurable_options.map((configurable_option, cfo_idx) => {
            optionText.push(
                <div key={cfo_idx}>
                    <span>
                        {ReactHTMLParse(configurable_option.option_label)}
                    </span>{' '}
                    : {ReactHTMLParse(configurable_option.value_label)}
                </div>
            );
        });
    }
    if (item.bundle_options && item.bundle_options.length) {
        item.bundle_options.map((bundle_option, cfo_idx) => {
            optionText.push(
                <div key={cfo_idx}>
                    <span>{ReactHTMLParse(bundle_option.label)}</span> :{' '}
                    {ReactHTMLParse(bundle_option.values[0].label)} (
                    {bundle_option.values[0].quantity})
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
                <div key={cfo_idx}>
                    <span>{ReactHTMLParse(customizable_option.label)}</span> :{' '}
                    {customizable_option.values[0].label
                        ? customizable_option.values[0].label
                        : ReactHTMLParse(customizable_option.values[0].value)}
                </div>
            );
        });
    }

    if (item.links && item.links.length) {
        item.links.map((link, cfo_idx) => {
            optionText.push(
                <div key={cfo_idx}>
                    <span>{ReactHTMLParse(link.title)}</span>
                </div>
            );
        });
    }

    const itemOption =
        Array.isArray(optionText) && optionText.length ? (
            <div className="item-options">{optionText.reverse()}</div>
        ) : (
            ''
        );

    const stockWarning =
        !product.stock_status ||
        product.stock_status !== 'IN_STOCK' ||
        (item.simi_cart_item_data &&
            item.simi_cart_item_data.stock_status === false) ? (
            <div className="outstock-warning">
                {Identify.__('The requested qty is not available')}
            </div>
        ) : (
            ''
        );
    const taxC = taxConfig();
    const tax_cart_display_price = parseInt(taxC.tax_cart_display_price); // 1 - exclude, 2 - include, 3 - both
    let rowTotal = 0;
    if (
        item.prices &&
        item.prices.row_total &&
        item.prices.row_total_including_tax
    ) {
        rowTotal =
            tax_cart_display_price == 1
                ? item.prices.row_total.value
                : item.prices.row_total_including_tax.value;
    }
    const subtotal = rowTotal ? (
        <Price currencyCode={currencyCode} value={rowTotal} />
    ) : (
        ''
    );

    const itemSubTotal = <div className="item-subtotal">{subtotal}</div>;

    const cartItemImage = (
        <div
            role="presentation"
            onClick={() => {
                handleLink(`/${product.url_key}${productUrlSuffix()}`);
            }}
            className="img-cart-container"
        >
            <Image
                src={
                    product.small_image && product.small_image.url
                        ? product.small_image.url
                        : logoUrl()
                }
                alt={item.product.name}
            />
        </div>
    );
    const cartItemName = (
        <div
            className="item-name"
            role="presentation"
            style={{ color: configColor.content_color }}
            onClick={() => {
                handleLink(`/${product.url_key}${productUrlSuffix()}`);
            }}
        >
            {ReactHTMLParse(product.name)}
        </div>
    );
    if (miniOrMobile)
        return (
            <div className={`simicart-siminia-cart-item miniOrMobile`}>
                {cartItemImage}
                <div className="cart-item-detail">
                    {cartItemName}
                    {itemSubTotal}
                    {itemOption}
                    {stockWarning}
                    <div className="item-qty">
                        {/* add key to reload quantity field of minicart tiem when add product to cart from outside */}
                        <input
                            key={item.quantity}
                            min={1}
                            type="number"
                            pattern="[1-9]*"
                            defaultValue={item.quantity}
                            onBlur={event => {
                                if (
                                    parseInt(event.target.value, 10) !==
                                    parseInt(item.quantity, 10)
                                ) {
                                    handleUpdateItemQuantity(
                                        parseInt(event.target.value, 10)
                                    );
                                }
                            }}
                        />
                    </div>
                    <div className="item-action">
                        <div
                            role="button"
                            tabIndex="0"
                            className="item-delete"
                            onClick={handleRemoveFromCart}
                            onKeyUp={handleRemoveFromCart}
                        >
                            <i className="icon-trash" />
                        </div>
                    </div>
                </div>
            </div>
        );

    const quantityInputId = `cart_item_qty_input_${item.id}`;

    return (
        <tr className="simicart-siminia-cart-item">
            <td className="td-item-info">
                <div className="cart-item-info">
                    {cartItemImage}
                    <div className="name-and-option">
                        {cartItemName}
                        {itemOption}
                        {stockWarning}
                    </div>
                    <div className="item-action">
                        <div
                            role="button"
                            tabIndex="0"
                            className="item-delete"
                            onClick={handleRemoveFromCart}
                            onKeyUp={handleRemoveFromCart}
                        >
                            <i className="icon-trash" />
                        </div>
                    </div>
                </div>
            </td>
            <td className="td-item-price">
                {/* item.prices.price.value is not changing when switched storeview, show using row total divided by quantity for temporarily fix */}
                {/*(item.prices && item.prices.price && item.prices.price.value) ? <Price currencyCode={currencyCode} value={item.prices.price.value} /> : ''*/}
                <Price
                    currencyCode={currencyCode}
                    value={rowTotal / (item.quantity ? item.quantity : 1)}
                />
            </td>
            <td className="td-item-qty">
                <div className="item-qty">
                    <div
                        className="minus-quantity"
                        role="presentation"
                        onClick={() => reduceVal(quantityInputId)}
                    >
                        -
                    </div>
                    <input
                        defaultValue={item.quantity}
                        type="number"
                        id={quantityInputId}
                    />
                    <div
                        className="increase-quantity"
                        role="presentation"
                        onClick={() => increaseVal(quantityInputId)}
                    >
                        +
                    </div>
                </div>
            </td>
            <td className="td-item-subtotal">{itemSubTotal}</td>
        </tr>
    );
};

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

export default CartItem;
