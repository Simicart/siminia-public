import gql from 'graphql-tag';

import { GiftCardFragment } from './GiftCards/giftCardFragments';
import { ProductListingFragment } from './ProductListing/productListingFragments';
import { PriceSummaryFragment } from './PriceSummary/priceSummaryFragments';
import { AppliedCouponsFragment } from './PriceAdjustments/CouponCode/couponCodeFragments';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
        email
        is_virtual
        applied_coupons {
            code
        }
        ...AppliedCouponsFragment
        ...GiftCardFragment
        ...ProductListingFragment
        ...PriceSummaryFragment
    }
    ${AppliedCouponsFragment}
    ${GiftCardFragment}
    ${ProductListingFragment}
    ${PriceSummaryFragment}
`;
