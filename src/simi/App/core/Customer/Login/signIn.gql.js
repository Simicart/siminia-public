import gql from 'graphql-tag';

import { CartPageFragment } from 'src/simi/App/core/Cart/cartPageFragments.gql';

export const GET_CART_DETAILS_QUERY = gql`
    query getCartDetails($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            items {
                id
                product {
                    id
                    name
                    sku
                    small_image {
                        url
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
                quantity
                ... on ConfigurableCartItem {
                    configurable_options {
                        id
                        option_label
                        value_id
                        value_label
                    }
                }
            }
            prices {
                grand_total {
                    value
                    currency
                }
            }
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;
