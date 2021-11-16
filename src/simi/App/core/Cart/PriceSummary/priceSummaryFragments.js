import gql from 'graphql-tag';

import { DiscountSummaryFragment } from './discountSummary';
import { GiftCardSummaryFragment } from './queries/giftCardSummary';
import { ShippingSummaryFragment } from './shippingSummary';
import { TaxSummaryFragment } from './taxSummary';

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
            ...DiscountSummaryFragment
            subtotal_excluding_tax {
                currency
                value
            }
            subtotal_including_tax {
                currency
                value
            }
            subtotal_with_discount_excluding_tax {
                currency
                value
            }
            applied_taxes {
                amount {
                    currency
                    value
                }
                label
            }
            discount {
                amount {
                    currency
                    value
                }
                label
            }
            ...GrandTotalFragment
        }
        ...GiftCardSummaryFragment
    }
    ${DiscountSummaryFragment}
    ${GiftCardSummaryFragment}
    ${GrandTotalFragment}
    ${ShippingSummaryFragment}
    ${TaxSummaryFragment}
`;
