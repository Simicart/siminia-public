import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import { useProductListingTableActions } from 'src/simi/talons/Cart/useProductListingTableActions';
import { showToastMessage } from 'src/simi/Helper/Message';
import { showFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { confirmAlert } from 'src/simi/BaseComponents/ConfirmAlert';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
import { FormattedMessage, useIntl } from 'react-intl';
require('./productListingTableActions.scss');

const ProductListingTableActions = props => {
    const { handleLink, setIsCartUpdating, items } = props;
    const { formatMessage } = useIntl();

    const talonProps = useProductListingTableActions({
        mutations: {
            massUpdateShoppingCart: UPDATE_QUANTITY_MUTATION,
            massRemoveItemInCart: MASS_REMOVE_MUTATION
        },
        setIsCartUpdating
    });

    const { handleMassUpdateItem, errorMessage } = talonProps;
    if (errorMessage) {
        showToastMessage(errorMessage);
    }
    const updateShoppingCart = deleteAll => {
        if (!items || !items.length) return;
        const quantityObj = [];
        let isValidQty = true;
        items.map(item => {
            try {
                let qty = 0;
                if (!deleteAll)
                    qty = parseInt(
                        $(
                            `.cart-list-table #cart_item_qty_input_${item.id}`
                        ).val()
                    );
                quantityObj.push({
                    cart_item_id: parseInt(item.id),
                    quantity: qty
                });
                if (qty < 0) isValidQty = false;
            } catch (err) {
                console.warn(err);
            }
        });

        if (!isValidQty) {
            showToastMessage('Quantity must be 0 or positive number !');
        } else {
            showFogLoading();
            handleMassUpdateItem(quantityObj, deleteAll);
        }
    };
    const clickedRemoveAll = () => {
        confirmAlert({
            title: '',
            className: 'fashioncart-confirm-alert',
            message: (
                <>
                    {formatMessage({
                        id:
                            'Are you sure you about remove this item from the shopping cart?',
                        defaultMessage:
                            'Are you sure you about remove this item from the shopping cart?'
                    })}
                </>
            ),

            buttons: [
                {
                    label: (
                        <>
                            {formatMessage({
                                id: 'Cancel'
                            })}
                        </>
                    ),
                    className: 'confirm-alert-cancel'
                },
                {
                    label: (
                        <>
                            {formatMessage({
                                id: 'OK'
                            })}
                        </>
                    ),
                    className: 'confirm-alert-ok',
                    onClick: () => {
                        updateShoppingCart(true);
                    }
                }
            ]
        });
    };
    return (
        <div className="cart-list-table-action">
            <Whitebtn
                onClick={() => clickedRemoveAll()}
                className="remove-all-products"
                text={
                    <FormattedMessage
                        id={'Remove All Products'}
                        defaultMessage={'Remove All Products'}
                    />
                }
            />
        </div>
    );
};

export default ProductListingTableActions;

export const MASS_UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $itemId, quantity: 1 }]
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

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $inputCartItems: [CartItemUpdateInput]!
    ) {
        updateCartItems(
            input: { cart_id: $cartId, cart_items: $inputCartItems }
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

export const MASS_REMOVE_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $itemId, quantity: 0 }]
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
