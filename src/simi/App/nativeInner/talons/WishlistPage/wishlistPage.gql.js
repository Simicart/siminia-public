import { gql } from '@apollo/client';

import { WishlistPageFragment , WishlistFragment} from './wishlistFragment.gql';

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists {
                id
                ...WishlistFragment
            }
        }
    }
    ${WishlistFragment}
`;

export default {
    getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
};
