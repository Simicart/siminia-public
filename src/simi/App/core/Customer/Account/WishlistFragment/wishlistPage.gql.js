import gql from 'graphql-tag';
import { WishlistFragment } from './wishlistPageFragments.gql';
import { CartPageFragment } from 'src/simi/App/core/Cart/cartPageFragments.gql';

export const GET_WISHLIST = gql`
    query getWishlist {
        customer {
            wishlist {
                ...WishlistFragment
            }
        }
    }
    ${WishlistFragment}
`;

export const ADD_WISHLIST = gql`
    mutation addWishlist (
        $product: Int!
        $data: String
    ) {
        wishlist(
            product: $product,
            data: $data
        ) @connection(key: "Wishlist") {
            ...WishlistFragment
        }
    }
    ${WishlistFragment}
`;

export const ADD_WISHLIST_TO_CART = gql`
    mutation addWishlist (
        $itemId: Int!
        $cartId: String!
    ) {
        wishlistToCart(
            item_id: $itemId,
            cart_id: $cartId
        ) @connection(key: "Wishlist") {
            wishlist {
                ...WishlistFragment
            }
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${WishlistFragment}
    ${CartPageFragment}
`;

export const REMOVE_WISHLIST_ITEM = gql`
    mutation removeWishlistItem (
        $itemId: Int!
    ) {
        wishlistRemoveItem(
            item_id: $itemId
        ) @connection(key: "Wishlist") {
            ...WishlistFragment
        }
    }
    ${WishlistFragment}
`;
