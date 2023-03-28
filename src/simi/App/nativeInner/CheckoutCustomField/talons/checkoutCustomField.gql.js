import gql from 'graphql-tag';

export const GET_ALL_CHECKOUT_CUSTOM_FIELD_DATA = gql`
    query getAllCheckoutCustomFieldData {
        getAllCheckoutCustomFieldData {
            applied_customer_group
            attribute_code
            attribute_id
            backend_label
            customer_group
            frontend_input
            frontend_label
            is_required
            options {
                attribute_id
                is_default
                option_id
                store_id
                value
                value_id
            }
            show_in_checkout
            show_in_email
            show_in_order
            show_in_pdf
            sort_order
            store_id
            visible_backend
            visible_frontend
        }
    }
`;

export const GET_CHECKOUT_CUSTOM_FIELD_CONFIG = gql`
    query getCheckoutCustomFieldConfig {
        getCheckoutCustomFieldConfig {
            is_enabled
            show_in_email
            show_in_pdf
            title
        }
    }
`;

export const GET_CHECKOUT_CUSTOM_FIELD_DATA = gql`
    query getCheckoutCustomFieldData($attribute_code: String!) {
        getCheckoutCustomFieldData(attribute_code: $attribute_code) {
            applied_customer_group
            attribute_code
            attribute_id
            backend_label
            customer_group
            frontend_input
            frontend_label
            is_required
            options {
                attribute_id
                is_default
                option_id
                store_id
                value
                value_id
            }
            show_in_email
            show_in_order
            show_in_pdf
            show_in_shipping
            sort_order
            store_id
            visible_backend
            visible_frontend
        }
    }
`;

export const SET_QUOTE_CHECKOUT_CUSTOM_FIELD = gql`
    mutation setQuoteCheckoutCustomField(
        $cartId: String!
        $customFieldItems: [CheckoutCustomFieldItems!]!
    ) {
        setQuoteCheckoutCustomField(
            input: {
                cart_id: $cartId
                custom_field_items: $customFieldItems
            }
        ) {
            message
            status
        }
    }
`;
