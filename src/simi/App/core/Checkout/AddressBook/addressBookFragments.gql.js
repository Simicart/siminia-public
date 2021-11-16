import gql from 'graphql-tag';

export const CustomerAddressFragment = gql`
    fragment CustomerAddressFragment on CustomerAddress {
        id
        city
        country_code
        default_shipping
        default_billing
        firstname
        lastname
        postcode
        region {
            region
            region_code
            region_id
        }
        street
        telephone
        company
    }
`;

export const AddressBookFragment = gql`
    fragment AddressBookFragment on Customer {
        id
        addresses {
            id
            ...CustomerAddressFragment
        }
    }
    ${CustomerAddressFragment}
`;
