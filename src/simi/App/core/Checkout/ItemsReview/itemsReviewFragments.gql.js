import gql from 'graphql-tag';

export const ItemsReviewFragment = gql`
    fragment ItemsReviewFragment on Cart {
        id
        total_quantity
        items {
            id
            product {
                id
                name
                thumbnail {
                    url
                }
            }
            prices {
                price {
                    currency
                    value
                }
                row_total {
                    value
                    currency
                }
                row_total_including_tax {
                    value
                    currency
                }
                discounts {
                    amount {
                        value
                        currency
                    }
                    label
                }
                total_item_discount {
                    value
                    currency
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
    }
`;
