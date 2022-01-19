import { gql } from '@apollo/client';

import { GiftCardSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/queries/giftCardSummary';
import { ShippingSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/shippingSummary.gql';
import { TaxSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/taxSummary.gql';

export const GrandTotalFragment = gql`
    fragment GrandTotalFragment on CartPrices {
        grand_total {
            currency
            value
        }
    }
`;

export const PriceSummaryFragment = gql`
    fragment PriceSummaryFragment on Cart {
        id
        items {
            id
            quantity
        }
        ...ShippingSummaryFragment
        prices {
            ...TaxSummaryFragment
            ...GrandTotalFragment
            subtotal_excluding_tax {
                currency
                value
            }
            discount {
                amount {
                    currency
                    value
                }
                label
            }
            mp_reward_segments {
                code
                title
                value
            }
        }
        ...GiftCardSummaryFragment
    }
    ${GiftCardSummaryFragment}
    ${GrandTotalFragment}
    ${ShippingSummaryFragment}
    ${TaxSummaryFragment}
`;
