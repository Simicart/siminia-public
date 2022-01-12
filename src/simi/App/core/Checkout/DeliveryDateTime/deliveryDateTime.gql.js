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
           }
    }
   
` : gql``

export default {
    getDeliveryTime: GET_DELIVERY_TIME
};