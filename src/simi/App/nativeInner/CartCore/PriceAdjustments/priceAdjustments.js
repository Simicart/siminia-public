import React, { Suspense, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func } from 'prop-types';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';

import defaultClasses from './priceAdjustments.module.css';
// import Button from '@magento/venia-ui/lib/components/Button';
// import { usePriceSummary } from '../../../../talons/Cart/usePriceSummary';
// import { useGetRewardPointData } from '../../../../talons/RewardPoint/useGetRewardPointData';
// import { useCartContext } from '@magento/peregrine/lib/context/cart';
// import { showFogLoading } from '../../../../BaseComponents/Loading/GlobalLoading';
import ApplyRewardPoint from 'src/simi/BaseComponents/RewardPoint/components/Cart/apply'
// import { Form } from 'informed';

import checkEnabledGiftCard from '../../../../../giftcard/functions/gift-card-store-config/checkEnabledGiftCard'
import DiscountGiftCard from '../../../../../giftcard/components/DiscountGiftCard';

const CouponCode = React.lazy(() => import('./CouponCode'));
// const GiftOptions = React.lazy(() =>
//     import('@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions')
// );
const ShippingMethods = React.lazy(() => import('./ShippingMethods'));

const GiftCard = React.lazy(() =>
    import('src/simi/App/nativeInner/GiftCard/Cart/GiftCardDiscount')
);

/**
 * PriceAdjustments is a child component of the CartPage component.
 * It renders the price adjustments forms for applying gift cards, coupons, and the shipping method.
 * All of which can adjust the cart total.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating A callback function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [priceAdjustments.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceAdjustments from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments'
 */
const PriceAdjustments = props => {
    const { setIsCartUpdating, giftCardConfig, refetchCartPage, priceSummaryData, isCheckout } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const { rewardPoint } = priceSummaryData || {}

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'shipping_method'}
                    title={formatMessage({
                        id: 'Estimate your shipping',
                        defaultMessage: 'Estimate your Shipping'
                    })}
                    classes={{
                        root: classes.sectionRoot,
                        title: classes.sectionTitle
                    }}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <ShippingMethods
                            setIsCartUpdating={setIsCartUpdating}
                        />
                    </Suspense>
                </Section>
                <Section
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'Enter coupon code',
                        defaultMessage: 'Enter Coupon Code'
                    })}
                    classes={{
                        root: classes.sectionRoot,
                        title: classes.sectionTitle
                    }}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <CouponCode setIsCartUpdating={setIsCartUpdating} />
                    </Suspense>
                </Section>
                <ApplyRewardPoint 
                    useAccrodion={true} 
                    classes={{
                        sectionRoot: classes.sectionRoot,
                        sectionTitle: classes.sectionTitle
                    }}
                    isCheckout={isCheckout}
                    rewardPoint={rewardPoint}
                    refetchCartPage={refetchCartPage}
                />
                {checkEnabledGiftCard() ? (
                    <DiscountGiftCard location={props.location} />
                ) : (
                    <></>
                )}
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setIsCartUpdating: func
};
