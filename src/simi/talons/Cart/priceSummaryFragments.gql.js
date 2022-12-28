import { gql } from '@apollo/client';

import { DiscountSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/discountSummary.gql';
// import { GiftCardSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/queries/giftCardSummary';
import { ShippingSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/shippingSummary.gql';
import { TaxSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/taxSummary.gql';

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

const giftCardEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;

export const GiftCardSummaryFragment = giftCardEnabled
    ? gql`
          fragment GiftCardSummaryFragment on Cart {
              mp_giftcard_config {
                  balance
                  canShowDetail
                  creditUsed
                  css
                  enableGiftCard
                  enableGiftCredit
                  enableMultiple
                  giftCardUsed {
                      amount
                      code
                      expired_at
                      status
                  }
                  listGiftCard {
                      balance
                      code
                      expired_at
                      hidden
                      status
                  }
                  maxUsed
              }
          }
      `
    : gql`
          fragment GiftCardSummaryFragment on Cart {
              id
          }
      `;
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
            ...GrandTotalFragment
            subtotal_excluding_tax {
                currency
                value
            }
        }
        ...GiftCardSummaryFragment
    }
    ${DiscountSummaryFragment}
    ${GiftCardSummaryFragment}
    ${GrandTotalFragment}
    ${ShippingSummaryFragment}
    ${TaxSummaryFragment}
`;
