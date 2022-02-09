import { gql } from '@apollo/client';

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
        mp_delivery_information {
          mp_delivery_date
          mp_delivery_time
          mp_house_security_code
          mp_delivery_comment
       }
        items {
          product_name
          product_sku
          quantity_ordered
          product_sale_price {
            currency
            value
          }
        }
        total {
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