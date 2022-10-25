import { gql } from '@apollo/client';
import { AccountInformationPageFragment } from './accountInformationPageFragment.gql';

export const SET_CUSTOMER_INFORMATION = gql`
    mutation customerUpdate(
        $firstname: String!
        $lastname: String!
        $email: String
        $password: String
    ) {
        updateCustomer(
            input: {
                firstname: $firstname
                lastname: $lastname
                email: $email
                password: $password
            }
        ) {
            customer {
                firstname
                lastname
                email
            }
        }
    }
`;

export const CHANGE_CUSTOMER_PASSWORD = gql`
    mutation customerPasswordUpdate(
        $currentPassword: String!
        $newPassword: String!
    ) {
        changeCustomerPassword(
            currentPassword: $currentPassword
            newPassword: $newPassword
        ) {
            id
            email
        }
    }
`;

export const GET_CUSTOMER_INFORMATION = gql`
    query GetCustomerInformation {
        customer {
            id
            ...AccountInformationPageFragment
        }
    }
    ${AccountInformationPageFragment}
`;

export default {
    mutations: {
        setCustomerInformationMutation: SET_CUSTOMER_INFORMATION,
        changeCustomerPasswordMutation: CHANGE_CUSTOMER_PASSWORD
    },
    queries: {
        getCustomerInformationQuery: GET_CUSTOMER_INFORMATION
    }
};
