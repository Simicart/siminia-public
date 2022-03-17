import { gql } from '@apollo/client';

import { SimiItemsReviewFragment } from './itemsReviewFragments.gql';

export const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        storeConfig {
            id
            configurable_thumbnail_source
        }
    }
`;

export const LIST_OF_PRODUCTS_IN_CART_QUERY = gql`
    query getItemsInCart($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...SimiItemsReviewFragment
        }
    }

    ${SimiItemsReviewFragment}
`;

export default {
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE,
    getItemsInCart: LIST_OF_PRODUCTS_IN_CART_QUERY
};
