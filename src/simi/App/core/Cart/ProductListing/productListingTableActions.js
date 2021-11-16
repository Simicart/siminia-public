import React from 'react'
import gql from 'graphql-tag';
import { useProductListingTableActions } from 'src/simi/talons/CartPage/ProductListing/useProductListingTableActions';
import { AvailableShippingMethodsCartFragment } from 'src/simi/App/core/Cart/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql';
import { CartPageFragment } from '../cartPageFragments.gql';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import Identify from 'src/simi/Helper/Identify';
import { showToastMessage } from 'src/simi/Helper/Message';
import { showFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

const ProductListingTableActions = props => {
    const { handleLink, setIsCartUpdating, items } = props

    const talonProps = useProductListingTableActions({
        mutations: {
            massUpdateShoppingCart: UPDATE_QUANTITY_MUTATION,
            massRemoveItemInCart: MASS_REMOVE_MUTATION
        },
        setIsCartUpdating
    });

    const { handleMassUpdateItem, errorMessage } = talonProps

    if (errorMessage) {
        showToastMessage(errorMessage)
    }
    const updateShoppingCart = (deleteAll) => {
        if (!items || !items.length)
            return
        const quantityObj = []
        let isValidQty = true;
        items.map(item => {
            try {
                let qty = 0
                if(!deleteAll)
                    qty = parseInt($(`.cart-list-table #cart_item_qty_input_${item.id}`).val())
                quantityObj.push({
                    cart_item_id: parseInt(item.id),
                    quantity: qty
                })
                if(qty < 0) isValidQty = false;
            } catch (err) {
                console.warn(err)
            }
        })

        if(!isValidQty){
            showToastMessage(Identify.__('Quantity must be 0 or positive number !'));
        }else{
            showFogLoading()
            handleMassUpdateItem(quantityObj, deleteAll)
        }
    }


    return (
        <div className="cart-list-table-action">
            <Colorbtn
                className="continue-shopping"
                onClick={() => handleLink('/')}
                text={Identify.__('Continue Shopping')}
            />
            <div className="right-buttons">
                <Colorbtn
                    className="clear-all-item"
                    onClick={() => updateShoppingCart(true)}
                    text={Identify.__('Clear All Items')}
                />

                <Colorbtn
                    className="update-shopping-cart"
                    onClick={() => updateShoppingCart(false)}
                    text={Identify.__('Update Shopping Cart')}
                />
            </div>
        </div>
    )
}

export default ProductListingTableActions


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
            input: {
                cart_id: $cartId
                cart_items: $inputCartItems
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
