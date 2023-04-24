import { gql } from '@apollo/client'

const ADD_PRODUCT_TO_WISHLIST = gql`
mutation addProductToWishlist($wishlistId: ID!, $wishlistItems: [WishlistItemInput!]!) {
    addProductsToWishlist(wishlistId: $wishlistId, wishlistItems: $wishlistItems) {
        user_errors {
            code
            message
        }
    }
}
`

export default ADD_PRODUCT_TO_WISHLIST