import { gql } from '@apollo/client';

import { CartTriggerFragment } from '@magento/peregrine/lib/talons/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';
import { WishlistPageFragment } from './wishlistFragment.gql';

export const ADD_WISHLIST_ITEM_TO_CART = gql`
    mutation AddWishlistItemToCart(
        $wishlistId: ID!
        $wishlistItemIds: [ID!]
    ) {
        addWishlistItemsToCart(
            wishlistId: $wishlistId
            wishlistItemIds: $wishlistItemIds
        ) {
            wishlist {
                id
                ...WishlistPageFragment
            }
            status
            add_wishlist_items_to_cart_user_errors {
                message
                code
                wishlistId
                wishlistItemId
            }
        }
    }
    ${WishlistPageFragment}
`;

export const REMOVE_PRODUCTS_FROM_WISHLIST = gql`
    mutation RemoveProductsFromWishlist(
        $wishlistId: ID!
        $wishlistItemsId: [ID!]!
    ) {
        removeProductsFromWishlist(
            wishlistId: $wishlistId
            wishlistItemsIds: $wishlistItemsId
        ) {
            wishlist {
                id
                ...WishlistPageFragment
            }
        }
    }
    ${WishlistPageFragment}
`;

export default {
    addWishlistItemToCartMutation: ADD_WISHLIST_ITEM_TO_CART,
    removeProductsFromWishlistMutation: REMOVE_PRODUCTS_FROM_WISHLIST
};
