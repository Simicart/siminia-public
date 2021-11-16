import gql from 'graphql-tag';

import { CartPageFragment } from 'src/simi/App/core/Cart/cartPageFragments.gql';

export const GET_ORDER_LIST = gql`
    query getOrders {
        customerOrders {
            items {
                id
                order_number
                created_at
                grand_total
                status
                order_currency
            }
        }
    }
`;

export const GET_ORDER_DETAIL = gql`
    query getOrderDetail($orderNumber: String!) {
        customerOrder(order_number: $orderNumber) {
            order_number
            id
            created_at
            grand_total
            status
            shipping_method
            payment_method
            prices {
                sub_total {
                    value
                    currency
                }
                grand_total {
                    value
                    currency
                }
                tax {
                    value
                    currency
                }
                discount {
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
            }
            items {
                id
                name
                image
                sku
                url_key
                price
                qty
                discount
                row_total
            }
            billing_address {
                id
                customer_id
                region_id
                country_id
                country_code
                street
                company
                telephone
                fax
                postcode
                city
                firstname
                lastname
                middlename
                prefix
                suffix
                vat_id
                default_shipping
                default_billing
            }
            shipping_address {
                id
                customer_id
                region_id
                country_id
                country_code
                street
                company
                telephone
                fax
                postcode
                city
                firstname
                lastname
                middlename
                prefix
                suffix
                vat_id
                default_shipping
                default_billing
            }
        }
    }
`;

export const RE_ORDER_ITEMS = gql`
    mutation reorderItems($orderNumber: String!) {
        reorderItems(orderNumber: $orderNumber) {
            cart {
                ...CartPageFragment
            }
            userInputErrors {
                message
                path
                code
            }
        }
    }
    ${CartPageFragment}
`;
