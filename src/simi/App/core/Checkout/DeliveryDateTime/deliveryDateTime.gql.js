import gql from 'graphql-tag';


const deliveryTimeEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME) === 1;


const GET_DELIVERY_TIME = deliveryTimeEnabled ? gql`  
    query DeliveryInformation  {
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
   
` : gql``

const DELIVERY_TIME_MUTATION = gql`
    mutation DeliveryMutation ($cart_id: String! , $mp_delivery_time : DeliveryTimeInput!) {
        MpDeliveryTime (cart_id: $cart_id, mp_delivery_time: $mp_delivery_time)
    }
`


export default {
    getDeliveryTime: GET_DELIVERY_TIME,
    deliveryTimeMutation : DELIVERY_TIME_MUTATION
};