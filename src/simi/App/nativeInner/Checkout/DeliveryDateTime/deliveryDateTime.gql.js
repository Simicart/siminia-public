import gql from 'graphql-tag';

const DELIVERY_TIME_MUTATION = gql`
    mutation(
        $cart_id: String!
        $shipping_arrival_comments: String
        $shipping_arrival_date: String
        $shipping_arrival_timeslot: String
    ) {
        applyDeliveryCart(
            input: {
                cart_id: $cart_id
                shipping_arrival_comments: $shipping_arrival_comments
                shipping_arrival_timeslot: $shipping_arrival_timeslot
                shipping_arrival_date: $shipping_arrival_date
            }
        ) {
            cart {
                error_message
                shipping_arrival_comments
                shipping_arrival_date
                shipping_arrival_timeslot
                success
            }
        }
    }
`;

export default {
    deliveryTimeMutation: DELIVERY_TIME_MUTATION
};
