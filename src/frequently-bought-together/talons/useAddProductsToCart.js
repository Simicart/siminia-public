import { gql } from '@apollo/client'

const ADD_PRODUCTS_TO_CART = gql`
mutation addProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
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
    }
}
`

export default ADD_PRODUCTS_TO_CART