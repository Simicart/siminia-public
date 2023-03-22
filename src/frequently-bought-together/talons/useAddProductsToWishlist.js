import { gql } from '@apollo/client'

const ADD_PRODUCTS_TO_WISHLIST = gql`
mutation addProductsToWishlist($wishlistId: ID!, $wishlistItems: [WishlistItemInput!]!) {
    addProductsToWishlist(wishlistId: $wishlistId, wishlistItems: $wishlistItems) {
        user_errors {
            code
            message
        }
    }
}
`

export default ADD_PRODUCTS_TO_WISHLIST