import { gql } from '@apollo/client'

const ADD_PRODUCT_TO_CART = gql`
mutation addProductToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
        user_errors {
            code
            message
        }
    }
}
`

export default ADD_PRODUCT_TO_CART