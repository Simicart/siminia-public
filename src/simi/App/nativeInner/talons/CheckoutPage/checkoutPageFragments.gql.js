import { gql } from '@apollo/client';
import { RewardPointOnCartFragment } from 'src/simi/talons/Cart/priceSummaryFragments.gql'

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        items {
            id
            product {
                id
                stock_status
            }
        }
        is_virtual
        # If total quantity is falsy we render empty.
        total_quantity
        available_payment_methods {
            code
        }
        ...RewardPointOnCartFragment
    }
    ${RewardPointOnCartFragment}
`;
