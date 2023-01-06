import { gql } from '@apollo/client';

const deliveryTimeEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME) === 1;

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

const GET_ORDER_DETAIL = gql`
    query GetOrderDetail($orderId: String!)  {
    customer {
    orders(filter: {number: {eq: $orderId}}) {
      total_count
      items {
        id
        number
        order_date
        status
        shipping_method
        payment_methods{
          name
        }
        billing_address {
          firstname
          lastname
          street
          telephone
          city
          region
          postcode
          company
          
        }
        ${deliveryTimeEnabled ? `
          mp_delivery_information {
            mp_delivery_date
            mp_delivery_time
            mp_house_security_code
            mp_delivery_comment
          }
        ` : ''}
        items {
          product_name
          product_url_key
          product_sku
          quantity_ordered
          product_sale_price {
            currency
            value
          }
        }
        total {
          discounts {
            amount {
              currency
              value
            }
            label
          }
          base_grand_total {
            currency
            value
          }
          subtotal {
            currency
            value
          }
          total_shipping {
            currency
            value
          }
          total_tax {
            currency
            value
          }
        }
        invoices {
          total{
            subtotal {
              currency
              value
            }
          }
        }
      }
    }
  }
}
`;

const REORDER_MUTATION = gql`
  mutation ReorderItem($orderId: String!){
  reorderItems(orderNumber:$orderId){
    cart {
      id
      items {
        uid
        product {
          sku
        }
        quantity
        prices {
          price {
            value
          }
        }
      }
    }
    userInputErrors{
      code
      message
      path
    }
  }
}
`;
export default {
    getOrderDetail: GET_ORDER_DETAIL,
    reorderItemMutation: REORDER_MUTATION
};