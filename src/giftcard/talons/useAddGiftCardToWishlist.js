import { useQuery, gql } from '@apollo/client';

const ADD_GIFT_CARD_TO_WISHLIST = gql`
    mutation addGiftCardProductsToWishList(
        $wishlistId: ID!
        $wishlistItems: [WishlistItemInput!]!
    ) {
        addGiftCardProductsToWishList(
            wishlistId: $wishlistId
            wishlistItems: $wishlistItems
        ) {
          wishlist {
            id
            items_count
            items {
              id
              qty
              product {
                  ... on BssGiftCardProduct {
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
                      giftcard_delivery_date
                      giftcard_timezone
                  }
                  }
              }
              }
          }
          user_errors {
            code
            message
          }
        }
      }
`;

export default ADD_GIFT_CARD_TO_WISHLIST;
