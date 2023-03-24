import { gql } from '@apollo/client'

const CART_DATA = gql`
query cartData($cart_id: String!) {
    cart(cart_id: $cart_id) {
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
`

export default CART_DATA