import { gql } from '@apollo/client';
import { ProductListFragment } from './ProductList/productListFragments.gql';
import { DiscountSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/discountSummary.gql';
import { GiftCardSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/queries/giftCardSummary';
import { ShippingSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/shippingSummary.gql';
import { TaxSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/taxSummary.gql';

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

export const GrandTotalFragment = gql`
    fragment GrandTotalFragment on CartPrices {
        grand_total {
            currency
            value
        }
    }
`;
export const RewardPointFragment = rewardPointEnabled
    ? gql`
          fragment RewardPointFragment on CartPrices {
              mp_reward_segments {
                  code
                  title
                  value
              }
          }
      `
    : gql`
          fragment RewardPointFragment on CartPrices {
              subtotal_excluding_tax {
                  currency
                  value
              }
          }
      `;

export const MiniCartFragment = gql`
    fragment MiniCartFragment on Cart {
        id
        total_quantity
        ...ShippingSummaryFragment
        prices {
            ...TaxSummaryFragment
            ...DiscountSummaryFragment
            ...GrandTotalFragment
            subtotal_excluding_tax {
                currency
                value
            }
            ...RewardPointFragment
        }
        ...ProductListFragment
        ...GiftCardSummaryFragment
    }
    ${ProductListFragment}
    ${DiscountSummaryFragment}
    ${GiftCardSummaryFragment}
    ${GrandTotalFragment}
    ${RewardPointFragment}
    ${ShippingSummaryFragment}
    ${TaxSummaryFragment}
`;
