import gql from 'graphql-tag';

import { CartPageFragment } from 'src/simi/App/core/Cart/cartPageFragments.gql';
import { CartTriggerFragment } from '../../Header/cartTriggerFragments.gql';
import { CheckoutPageFragment } from 'src/simi/App/core/Checkout/checkoutPageFragments.gql';

export const mergeCartsMutation = gql`
    mutation mergeCarts($sourceCartId: String!, $destinationCartId: String!) {
        mergeCarts(
            source_cart_id: $sourceCartId
            destination_cart_id: $destinationCartId
        ) @connection(key: "mergeCarts") {
            id
            ...CartPageFragment
            ...CartTriggerFragment
            ...CheckoutPageFragment
            # TODO: Create/use MiniCartFragment, etc.
            items {
                id
                product {
                    id
                    small_image {
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
            }
        }
    }
    ${CartTriggerFragment}
    ${CartPageFragment}
    ${CheckoutPageFragment}
`;
