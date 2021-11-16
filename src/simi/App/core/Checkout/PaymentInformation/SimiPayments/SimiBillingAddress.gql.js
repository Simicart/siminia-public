import gql from 'graphql-tag';

import { CustomerAddressFragment } from '../../AddressBook/addressBookFragments.gql';
import { ShippingInformationFragment } from '../../ShippingInformation/shippingInformationFragments.gql';

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddresses {
        customer {
            id
            addresses {
                id
                ...CustomerAddressFragment
            }
        }
    }
    ${CustomerAddressFragment}
`;

export const GET_CUSTOMER_CART_ADDRESS = gql`
    query GetCustomerCartAddress {
        customerCart {
            id
            ...ShippingInformationFragment
        }
    }
    ${ShippingInformationFragment}
`;

export const SET_GUEST_EMAIL_ON_CART_BILLING = gql`
    mutation setGuestEmailOnCartBilling(
        $cartId: String!
        $email: String!
    ) {
        setGuestEmailOnCart(input: { cart_id: $cartId, email: $email })
            @connection(key: "setGuestEmailOnCart") {
            cart {
                id
                email
            }
        }
    }
`;