import { gql } from '@apollo/client';


export const SUBMIT_POPUP_FORM = gql`
    mutation mpCallForPriceRequest(
        $product_id: Int!
        $store_ids: String!
        $name: String!
        $email: String!
        $phone: String!
        $customer_note: String!
    ) {
        mpCallForPriceRequest(
            input: {
                product_id:$product_id
                 store_ids: $store_ids
                 name:$name
                 email:$email
                 phone:$phone
                 customer_note:$customer_note
            }
        ) {
            request_id
            created_at
            sku
            product_id
            item_product
            store_ids
            customer_group_ids
            status
            name
            email
            phone
            customer_note
            internal_note
            rank_request
        }
    }
`;