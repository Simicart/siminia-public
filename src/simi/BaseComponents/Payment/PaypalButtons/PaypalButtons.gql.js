import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { AvailablePaymentMethodsFragment } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/paymentInformation.gql';

export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query getIsBillingAddressSame($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            isBillingAddressSame
        }
    }
`;

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
                country {
                    code
                }
                street
                city
                region {
                    code
                    label
                    region_id
                }
                postcode
                phoneNumber: telephone
            }
        }
    }
`;

export const GET_SHIPPING_ADDRESS = gql`
    query getSelectedShippingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            shippingAddresses: shipping_addresses {
                firstName: firstname
                lastName: lastname
                country {
                    code
                }
                street
                city
                region {
                    code
                    label
                    region_id
                }
                postcode
                phoneNumber: telephone
            }
        }
    }
`;

export const SET_BILLING_ADDRESS = gql`
    mutation setBillingAddress(
        $cartId: String!
        $firstName: String!
        $lastName: String!
        $street1: String!
        $street2: String
        $city: String!
        $region: String!
        $postcode: String!
        $country: String!
        $phoneNumber: String!
    ) {
        setBillingAddressOnCart(
            input: {
                cart_id: $cartId
                billing_address: {
                    address: {
                        firstname: $firstName
                        lastname: $lastName
                        street: [$street1, $street2]
                        city: $city
                        region: $region
                        postcode: $postcode
                        country_code: $country
                        telephone: $phoneNumber
                        save_in_address_book: false
                    }
                }
            }
        ) @connection(key: "setBillingAddressOnCart") {
            cart {
                id
                billing_address {
                    firstname
                    lastname
                    country {
                        code
                    }
                    street
                    city
                    region {
                        code
                        label
                        region_id
                    }
                    postcode
                    telephone
                }
                ...PriceSummaryFragment
                ...AvailablePaymentMethodsFragment
            }
        }
    }
    ${PriceSummaryFragment}
    ${AvailablePaymentMethodsFragment}
`;

export const SET_OFFLINE_PAYMENT_ON_CART = gql`
    mutation setSelectedPaymentMethod($cartId: String!, $paymentCode: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: $paymentCode } }
        ) @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export const CREATE_PAYPAL_EXPRESS_TOKEN = gql`
    mutation createPaypalExpressToken($cartId: String!) {
        createPaypalExpressToken(
            input: {
                cart_id: $cartId
                code: "paypal_express"
                express_button: true
                urls: {
                    return_url: "paypal_express.html"
                    cancel_url: "paypal_express_failure.html"
                }
            }
        ) {
            token
        }
    }
`;

export const GET_CART_TOTALS = gql`
    query ppBtnGetCartTotals($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;

export const SET_PAYMENT_METHOD_WITH_TOKEN_ON_CART = gql`
    mutation setPaymentMethodOnCart(
        $cartId: String!
        $token: String!
        $payerId: String!
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: "paypal_express"
                    paypal_express: { payer_id: $payerId, token: $token }
                }
            }
        ) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export default {
    getBillingAddressQuery: GET_BILLING_ADDRESS,
    getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
    getShippingAddressQuery: GET_SHIPPING_ADDRESS,
    setBillingAddressMutation: SET_BILLING_ADDRESS,
    createPaypalExpressToken: CREATE_PAYPAL_EXPRESS_TOKEN,
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_WITH_TOKEN_ON_CART,
    getCartTotals: GET_CART_TOTALS
};
