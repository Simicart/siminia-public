import { gql } from '@apollo/client';
import { ProductListFragment } from './ProductList/productListFragments.gql';
import { DiscountSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/discountSummary.gql';
import { GiftCardSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/queries/giftCardSummary';
import { ShippingSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/shippingSummary.gql';
import { TaxSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/taxSummary.gql';
import { RewardPointOnCartFragment } from 'src/simi/talons/Cart/priceSummaryFragments.gql'

export const GrandTotalFragment = gql`
    fragment GrandTotalFragment on CartPrices {
        grand_total {
            currency
            value
        }
    }
`;

export const MiniCartFragment = gql`
    fragment MiniCartFragment on Cart {
        id
        is_virtual
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
        }
        ...ProductListFragment
        ...GiftCardSummaryFragment
        ...RewardPointOnCartFragment
    }
    ${ProductListFragment}
    ${DiscountSummaryFragment}
    ${GiftCardSummaryFragment}
    ${GrandTotalFragment}
    ${ShippingSummaryFragment}
    ${TaxSummaryFragment}
    ${RewardPointOnCartFragment}
`;
