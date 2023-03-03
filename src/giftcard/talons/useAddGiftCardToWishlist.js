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
                items {
                  product{
                    name
                    ...on BssGiftCardProduct{
                      name
                    }
                  }
                }
                items_count
                items_v2(currentPage: 1, pageSize: 20) {
                    items {
                      product{
                        name
                        ...on BssGiftCardProduct{
                          name
                        }
                      }
                    }
                }
                sharing_code
                updated_at
            }
            user_errors {
                code
                message
            }
        }
    }
`;

export default ADD_GIFT_CARD_TO_WISHLIST;
