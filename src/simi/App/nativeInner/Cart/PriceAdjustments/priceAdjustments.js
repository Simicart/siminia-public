import React, { Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';

import defaultClasses from './priceAdjustments.module.css';
import Button from '@magento/venia-ui/lib/components/Button';
import { usePriceSummary } from '../../../../talons/Cart/usePriceSummary';
import { useGetRewardPointData } from '../../../../talons/RewardPoint/useGetRewardPointData';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { showFogLoading } from '../../../../BaseComponents/Loading/GlobalLoading';
import {configColor} from "../../../../Config";

const CouponCode = React.lazy(() => import('../CouponCode'));
// const GiftOptions = React.lazy(() =>
//     import('@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions')
// );
const ShippingMethods = React.lazy(() => import('./ShippingMethods'));

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

export const PriceAdjustments = (props) => {
    const { makeNotification } = props

    const classes = useStyle(defaultClasses, props.classes);
    const [{ cartId }] = useCartContext();
    const [rewardPoint, setRewardPoint] = useState(0);
    const [enableWarningPoint, setEnalbleWarningPoint] = useState(false);
    const { spendRewardPointHandle, flatData } = usePriceSummary();
    const { priceData, subtotal } = flatData;
    const subtotalVal = subtotal && subtotal.value ? subtotal.value : 0;
    const mpRewardSpent =
        priceData &&
        priceData.filter(function(rewardData) {
            return rewardData.code == 'mp_reward_spent';
        });
    const { customerRewardPoint } = useGetRewardPointData({ onCart: true });
    const exchange_rate = customerRewardPoint.current_exchange_rates;
    const spending_rate = exchange_rate ? exchange_rate.spending_rate : '';
    const words = spending_rate ? spending_rate.split(' points') : '';
    const money = spending_rate ? spending_rate.split('for $') : '';
    const spending_point = words[0] ? words[0].split(' ') : '';
    const pointSpending = spending_point[1];
    const moneySpending = money[1] ? money[1].split('.') : '';
    const maxPoint = Math.floor(
        (pointSpending * subtotalVal) / moneySpending[0]
    );
    const balance = customerRewardPoint.point_balance;
    let rewardPointSelected = 0;
    if (mpRewardSpent && mpRewardSpent.length > 0)
        rewardPointSelected = mpRewardSpent[0].value;

    const { setIsCartUpdating } = props;
    const { formatMessage } = useIntl();
    const applyHandle = () => {
        if (rewardPoint > balance) {
            setEnalbleWarningPoint(true);
            setTimeout(function() {
                setEnalbleWarningPoint(false);
            }, 2000);
        } else {
            showFogLoading();
            if (rewardPoint > maxPoint) {
                setRewardPoint(maxPoint);
            }
            spendRewardPointHandle({
                variables: {
                    cart_id: cartId,
                    points: rewardPoint,
                    rule_id: 'rate',
                    address_information: {}
                }
            });
        }
    };
    const rewardPointEnabled =
        window.SMCONFIGS &&
        window.SMCONFIGS.plugins &&
        window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
        parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

    return (
        <div className={classes.root}>
            <Accordion 
                classes={{
                    root: classes.accordRoot
                }}
                canOpenMultiple={true}
            >
                <Section
                    id={'shipping_method'}
                    title={formatMessage({
                        id: 'priceAdjustments.shippingMethod',
                        defaultMessage: 'Estimate your Shipping'
                    })}
                    classes={{
                        root: classes.sectionRoot,
                        title: classes.sectionTitle,
                        title_wrapper: classes.title_wrapper,
                        contents_container: classes.contents_container
                    }}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <ShippingMethods
                            setIsCartUpdating={(update) => setIsCartUpdating(update, false)}
                        />
                    </Suspense>
                </Section>
                <Section
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'priceAdjustments.couponCode',
                        defaultMessage: 'Enter Coupon Code'
                    })}
                    classes={{
                        root: classes.sectionRoot,
                        title: classes.sectionTitle,
                        title_wrapper: classes.title_wrapper,
                        contents_container: classes.contents_container
                    }}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <CouponCode setIsCartUpdating={setIsCartUpdating} makeNotification={makeNotification} />
                    </Suspense>
                </Section>
                {/* {rewardPointEnabled && balance ? ( */}
                    <Section
                        id={'reward_points'}
                        title={formatMessage({
                            id: 'priceAdjustments.rewardPoint',
                            defaultMessage: 'Reward Points'
                        })}
                        classes={{
                            root: classes.sectionRoot,
                            title: classes.sectionTitle,
                            title_wrapper: classes.title_wrapper,
                            contents_container: classes.contents_container
                        }}
                    >
                        <Suspense fallback={<LoadingIndicator />}>
                            <div className={classes.userBalance}>
                                <FormattedMessage
                                    id={'rewardPoint.userBalance'}
                                    defaultMessage={`You have ${balance || 0} points`}
                                />
                            </div>
                            {balance > 0 ? (
                                <div className={classes.rewardPointRoot}>
                                    <input
                                        type="range"
                                        className={classes.slider}
                                        min={0}
                                        max={balance}
                                        step={1}
                                        value={
                                            rewardPoint || rewardPointSelected
                                        }
                                        onChange={e => {
                                            setRewardPoint(e.target.value);
                                        }}
                                    />
                                    <div className={classes.pointSpend}>
                                        <span className={classes.message}>
                                            <FormattedMessage
                                                id={'rewardPoint.textSpend'}
                                                defaultMessage={
                                                    'You will spend'
                                                }
                                            />
                                        </span>
                                        <input
                                            value={
                                                rewardPoint ||
                                                rewardPointSelected
                                            }
                                            onChange={e => {
                                                setRewardPoint(e.target.value);
                                            }}
                                            className={classes.pointInput}
                                        />
                                    </div>
                                    <Button
                                        priority="high"
                                        onClick={applyHandle}
                                        style={{
                                            backgroundColor: configColor.button_background,
                                            color: configColor.button_text_color,
                                        }}
                                    >
                                        <FormattedMessage
                                            id={'rewardPoint.applyButton'}
                                            defaultMessage={'Apply'}
                                        />
                                    </Button>
                                    {enableWarningPoint ? (
                                        <div className={classes.message}>
                                            <FormattedMessage
                                                id={'rewardPoint.warningPoint'}
                                                defaultMessage={
                                                    'The points are more than your balance'
                                                }
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div className={classes.message}>
                                    <FormattedMessage
                                        id={'rewardPoint.message'}
                                        defaultMessage={
                                            'Please earn Reward Point to spend your points'
                                        }
                                    />
                                </div>
                            )}
                        </Suspense>
                    </Section>
                {/* ) : null} */}
                <GiftCardSection setIsCartUpdating={setIsCartUpdating} />
            </Accordion>
        </div>
    )
};
