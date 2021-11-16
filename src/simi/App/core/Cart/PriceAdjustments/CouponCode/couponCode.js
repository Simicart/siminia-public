import React, { useState, useEffect } from 'react';

import gql from 'graphql-tag';

import { useCouponCode } from 'src/simi/talons/CartPage/PriceAdjustments/useCouponCode';
import { AppliedCouponsFragment } from './couponCodeFragments';
import { CartPageFragment } from '../../cartPageFragments.gql';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import ArrowDown from 'src/simi/BaseComponents/Icon/TapitaIcons/ArrowDown';
import ArrowUp from 'src/simi/BaseComponents/Icon/TapitaIcons/ArrowUp';
import Identify from 'src/simi/Helper/Identify';
import { showToastMessage } from 'src/simi/Helper/Message';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

import {
    showFogLoading,
    hideFogLoading
} from 'src/simi/BaseComponents/Loading/GlobalLoading';

require('./couponCode.scss');

const GET_APPLIED_COUPONS = gql`
    query getAppliedCoupons($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...AppliedCouponsFragment
        }
    }
    ${AppliedCouponsFragment}
`;

const APPLY_COUPON_MUTATION = gql`
    mutation applyCouponToCart($cartId: String!, $couponCode: String!) {
        applyCouponToCart(
            input: { cart_id: $cartId, coupon_code: $couponCode }
        ) @connection(key: "applyCouponToCart") {
            cart {
                id
                ...CartPageFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                    simi_payment_content
                }
            }
        }
    }
    ${CartPageFragment}
`;

const REMOVE_COUPON_MUTATION = gql`
    mutation removeCouponFromCart($cartId: String!) {
        removeCouponFromCart(input: { cart_id: $cartId })
            @connection(key: "removeCouponFromCart") {
            cart {
                id
                ...CartPageFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                    simi_payment_content
                }
            }
        }
    }
    ${CartPageFragment}
`;
const CouponCode = props => {
    const { toggleMessages, defaultOpen, setIsCartUpdating } = props;
    const [isCouponOpen, setOpen] = useState(defaultOpen ? true : false);
    let inputRef = false;

    const onError = errorTarget => {
        let derivedErrorMessage;
        if (errorTarget.graphQLErrors) {
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message, debugMessage }) =>
                    debugMessage ? debugMessage : message
                )
                .join(', ');
        } else if (errorTarget.message) {
            derivedErrorMessage = errorTarget.message;
        }
        if (derivedErrorMessage) {
            smoothScrollToView($('#root'));
            toggleMessages([
                {
                    type: 'error',
                    message: derivedErrorMessage,
                    auto_dismiss: true
                }
            ]);
        }
        if (setIsCartUpdating) setIsCartUpdating(false);
        hideFogLoading();
    };

    const onCompleted = resultContent => {
        if (
            resultContent &&
            resultContent.applyCouponToCart &&
            resultContent.applyCouponToCart.cart
        )
            toggleMessages([
                {
                    type: 'success',
                    message: Identify.__('You used coupon code.'),
                    auto_dismiss: true
                }
            ]);

        if (setIsCartUpdating) setIsCartUpdating(false);
        hideFogLoading();
    };

    const talonProps = useCouponCode({
        setIsCartUpdating: props.setIsCartUpdating,
        mutations: {
            applyCouponMutation: APPLY_COUPON_MUTATION,
            removeCouponMutation: REMOVE_COUPON_MUTATION
        },
        queries: {
            getAppliedCouponsQuery: GET_APPLIED_COUPONS
        },
        onError,
        onCompleted
    });

    const {
        applyingCoupon,
        data,
        errorMessage,
        fetchError,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    } = talonProps;

    if (!data) {
        return null;
    }

    if (fetchError) {
        return '';
    }

    if (errorMessage) {
        toggleMessages([
            { type: 'error', message: errorMessage, auto_dismiss: true }
        ]);
    }

    let value = '';
    if (data.cart.applied_coupons) {
        data.cart.applied_coupons.map(({ code }) => {
            value = code;
        });
    }

    const handleCoupon = (type = '') => {
        const coupon = inputRef.value;
        if (!coupon && type !== 'clear') {
            showToastMessage(Identify.__('Please enter coupon code'));
            return null;
        }
        showFogLoading();
        if (type === 'clear') {
            handleRemoveCoupon(value);
            return;
        }
        const params = {
            couponCode: coupon
        };
        handleApplyCoupon(params);
    };

    return (
        <div className="coupon-code">
            <div
                role="button"
                className="coupon-code-title"
                tabIndex="0"
                onClick={() => setOpen(!isCouponOpen)}
                onKeyUp={() => setOpen(!isCouponOpen)}
            >
                <div className="coupon-code-title-label">
                    {Identify.__('Add a Coupon Code')}
                </div>
                <div className="coupon-code-title-arrow">
                    {isCouponOpen ? <ArrowUp /> : <ArrowDown />}
                </div>
            </div>
            <div
                className={`coupon-code-area  ${
                    isCouponOpen ? 'coupon-open' : 'coupon-close'
                }`}
            >
                <input
                    key={value ? value : 'coupon_field'}
                    className="coupon_field"
                    type="text"
                    placeholder={
                        value ? value : Identify.__('Enter discount code')
                    }
                    defaultValue={value}
                    ref={ref => {
                        inputRef = ref;
                    }}
                />
                {applyingCoupon || !value ? (
                    <Colorbtn
                        className={`submit-coupon ${Identify.isRtl() &&
                            'submit-coupon-rtl'}`}
                        onClick={() => {
                            if (!applyingCoupon) handleCoupon();
                        }}
                        text={Identify.__('Apply')}
                    />
                ) : (
                    <Colorbtn
                        className={`submit-coupon ${Identify.isRtl() &&
                            'submit-coupon-rtl'} ${applyingCoupon &&
                            'loading'}`}
                        onClick={() => handleCoupon('clear')}
                        text={Identify.__('Cancel')}
                    />
                )}
            </div>
        </div>
    );
};

export default CouponCode;
