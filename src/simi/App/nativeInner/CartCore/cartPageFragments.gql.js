import { gql } from '@apollo/client';

import { GiftCardFragment } from '@magento/peregrine/lib/talons/CartPage/GiftCards/giftCardFragments.gql';
import { ProductListingFragment } from './ProductListing/productListingFragments.gql';
import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { AppliedCouponsFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/couponCodeFragments.gql';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        is_virtual
        total_quantity
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
