import gql from 'graphql-tag';

import { PriceSummaryFragment } from 'src/simi/App/core/Cart/PriceSummary/priceSummaryFragments';
import { AvailablePaymentMethodsFragment } from '../../paymentInformation.gql';

// We disable linting for local fields because there is no way to add them to
// the fetched schema. Additionally, since we don't want to make a network call
// for "id" we disable "required-fields"
// https://github.com/apollographql/eslint-plugin-graphql/issues/99

/* eslint-disable graphql/template-strings */
/* eslint-disable graphql/required-fields */
export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query getIsBillingAddressSame($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            isBillingAddressSame @client
        }
    }
`;

/* eslint-enable graphql/required-fields */
/* eslint-enable graphql/template-strings */

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
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
                }
                postalCode: postcode
                phoneNumber: telephone
                company
            }
        }
    }
`;

export const GET_SHIPPING_ADDRESS = gql`
    query getSelectedShippingAddress($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
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
                }
                postalCode: postcode
                phoneNumber: telephone
                company
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
        $state: String!
        $postalCode: String!
        $country: String!
        $phoneNumber: String!
        $company: String
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
                        region: $state
                        postcode: $postalCode
                        country_code: $country
                        telephone: $phoneNumber
                        company: $company
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
                    }
                    postcode
                    telephone
                    company
                }
                ...PriceSummaryFragment
                ...AvailablePaymentMethodsFragment
            }
        }
    }
    ${PriceSummaryFragment}
    ${AvailablePaymentMethodsFragment}
`;

export const SET_BILLING_ADDRESS_BY_ID = gql`
    mutation setBillingAddress(
        $cartId: String!
        $customerAddressId : Int!
    ) {
        setBillingAddressOnCart(
            input: {
                cart_id: $cartId
                billing_address: {
                    customer_address_id : $customerAddressId
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
                    }
                    postcode
                    telephone
                    company
                }
                ...PriceSummaryFragment
                ...AvailablePaymentMethodsFragment
            }
        }
    }
    ${PriceSummaryFragment}
    ${AvailablePaymentMethodsFragment}
`;


export const SET_SIMICART_STRIPE_INTEGRATION_PAYMENTS_ON_CART = gql`
    mutation setSelectedPaymentMethod(
        $cartId: String!
        $paymentCode: String!
        $simiCcStripejsToken: String
        $simiCcSave: Boolean
        $simiCcSaved: String
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: {
                    code: $paymentCode
                    simi_stripe_integration_cc_stripejs_token: $simiCcStripejsToken
                    simi_stripe_integration_cc_save: $simiCcSave
                    simi_stripe_integration_cc_saved: $simiCcSaved
                }
            }
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

export const GET_SAVED_CARDS = gql`
    query simistripesavedcards{
        simistripesavedcards {
            id 
            brand 
            exp_month 
            exp_year 
            last4 
            three_d_secure_usage 
        }
    }
`;

export default {
    queries: {
        getBillingAddressQuery: GET_BILLING_ADDRESS,
        getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
        getShippingAddressQuery: GET_SHIPPING_ADDRESS
    },
    mutations: {
        setBillingAddressMutation: SET_BILLING_ADDRESS,
        setBillingAddressByIdMutation: SET_BILLING_ADDRESS_BY_ID,
        setStripeIntegrationPayment: SET_SIMICART_STRIPE_INTEGRATION_PAYMENTS_ON_CART
    }
};
