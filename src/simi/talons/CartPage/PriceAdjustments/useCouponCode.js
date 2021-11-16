import { useCallback, useEffect } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import {
    simiUseMutation as useMutation,
    simiUseLazyQuery as useLazyQuery
} from 'src/simi/Network/Query';

export const useCouponCode = props => {
    const {
        setIsCartUpdating,
        mutations: { applyCouponMutation, removeCouponMutation },
        queries: { getAppliedCouponsQuery },
        onError,
        onCompleted
    } = props;

    const [{ cartId }] = useCartContext();
    const [fetchAppliedCoupons, { data, error: fetchError }] = useLazyQuery(
        getAppliedCouponsQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const [
        applyCoupon,
        {
            data: applyCouponData,
            called: applyCouponCalled,
            error: applyError,
            loading: applyingCoupon
        }
    ] = useMutation(applyCouponMutation, { onError, onCompleted });

    const [
        removeCoupon,
        {
            called: removeCouponCalled,
            error: removeCouponError,
            loading: removingCoupon
        }
    ] = useMutation(removeCouponMutation, { onError, onCompleted });

    const handleApplyCoupon = useCallback(
        async ({ couponCode }) => {
            if (!couponCode) return;
            await applyCoupon({
                variables: {
                    cartId,
                    couponCode
                }
            });
        },
        [applyCoupon, cartId]
    );

    const handleRemoveCoupon = useCallback(
        async couponCode => {
            await removeCoupon({
                variables: {
                    cartId,
                    couponCode
                }
            });
        },
        [cartId, removeCoupon]
    );

    useEffect(() => {
        if (cartId) {
            fetchAppliedCoupons({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchAppliedCoupons]);

    useEffect(() => {
        if (applyCouponCalled || removeCouponCalled) {
            // If a coupon mutation is in flight, tell the cart.
            setIsCartUpdating(applyingCoupon || removingCoupon);
        }
    }, [
        applyCouponCalled,
        applyingCoupon,
        removeCouponCalled,
        removingCoupon,
        setIsCartUpdating
    ]);

    let derivedErrorMessage;

    if (applyError || removeCouponError) {
        const errorTarget = applyError || removeCouponError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message, debugMessage }) =>
                    debugMessage ? debugMessage : message
                )
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            derivedErrorMessage = errorTarget.message;
            console.log(errorTarget.message);
        }
    }

    return {
        applyingCoupon,
        applyCouponData,
        data,
        errorMessage: derivedErrorMessage,
        fetchError,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    };
};
