import { gql } from '@apollo/client';

const ADD_GIFT_CARD_TO_CART = gql`
mutation addGiftCardProductsToCart($cart_id: String!, $quantity: Float!, $sku: String!, $bss_giftcard_amount: String!,
  $bss_giftcard_recipient_name: String!, $bss_giftcard_sender_name: String!, 
  $bss_giftcard_selected_image: Int!, $bss_giftcard_template: Int!,
  $bss_giftcard_delivery_date: String, $bss_giftcard_amount_dynamic: Float,
  $bss_giftcard_message_email: String, $bss_giftcard_recipient_email: String,
  $bss_giftcard_sender_email: String, $bss_giftcard_timezone: String) {
  addGiftCardProductsToCart(input: {
    cart_id: $cart_id,
    cart_items: [{
      data: {
        sku: $sku
        quantity: $quantity
      },
      giftcard_options: {
        bss_giftcard_recipient_name: $bss_giftcard_recipient_name
        bss_giftcard_sender_name: $bss_giftcard_sender_name
        bss_giftcard_amount: $bss_giftcard_amount
        bss_giftcard_selected_image: $bss_giftcard_selected_image
        bss_giftcard_template: $bss_giftcard_template
        bss_giftcard_amount_dynamic: $bss_giftcard_amount_dynamic
        bss_giftcard_delivery_date: $bss_giftcard_delivery_date
        bss_giftcard_message_email: $bss_giftcard_message_email
        bss_giftcard_recipient_email: $bss_giftcard_recipient_email,
        bss_giftcard_sender_email: $bss_giftcard_sender_email
        bss_giftcard_timezone: $bss_giftcard_timezone
      }
    }]
  }) {
    cart {
      id
      total_quantity
      items {
        ... on BssGiftCardItem {
          giftcard_option {
            giftcard_value
            giftcard_image {
                origin
                base
                thumbnail
            }
            giftcard_sender_email
            giftcard_sender_name
            giftcard_recipient_name
            giftcard_recipient_email
            giftcard_message
            giftcard_template_name
            giftcard_timezone
          }
        }
        id
        prices {
          price {
            currency,
            value
          }
        }
        quantity
        product {
          name
          updated_at
          sku
        }
      }
    }
  }
}
`
export default ADD_GIFT_CARD_TO_CART