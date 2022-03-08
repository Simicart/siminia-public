import gql from 'graphql-tag';

const GET_DELIVERY_TIME = gql`
    query DeliveryInformation {
        deliveryTime {
            deliveryDateFormat
            deliveryTime
            deliveryDateOff
            isEnabledDeliveryTime
            deliveryDaysOff
            isEnabledHouseSecurityCode
            isEnabledDeliveryComment
        }
    }
`;

const DELIVERY_TIME_MUTATION = gql`
    mutation DeliveryMutation(
        $cart_id: String!
        $mp_delivery_time: DeliveryTimeInput!
    ) {
        MpDeliveryTime(cart_id: $cart_id, mp_delivery_time: $mp_delivery_time)
    }
`;

export default {
    getDeliveryTime: GET_DELIVERY_TIME,
    deliveryTimeMutation: DELIVERY_TIME_MUTATION
};
