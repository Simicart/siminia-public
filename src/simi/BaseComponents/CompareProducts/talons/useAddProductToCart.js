import { gql } from '@apollo/client'

const ADD_PRODUCT_TO_CART = gql`
mutation addProductToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
        cart {
            items {
                product {
                    name
                    image {
                        url
                    }
                    url_key
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
            }
            prices {
                subtotal_excluding_tax {
                    value
                }
            }
            total_quantity
        }
        user_errors {
            code
            message
        }
    }
}
`

export default ADD_PRODUCT_TO_CART