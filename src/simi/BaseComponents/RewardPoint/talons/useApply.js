import { useMemo, useCallback, useState, useEffect } from 'react';
import { getRewardPointActive } from '../utils';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useQuery, useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useToasts } from '@magento/peregrine';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/rewardPoint.gql';
import Identify from 'src/simi/Helper/Identify';

let rewardPointChange = [];

export const useApply = (props = {}) => {
    const { formatMessage, rewardPoint, refetchCartPage } = props;
    const [{ isSignedIn }] = useUserContext();
    const storeConfigData = Identify.getStoreConfig();
    const rewardPointActive = getRewardPointActive();
    const [{ cartId }] = useCartContext();
    const [, { addToast }] = useToasts();

    const usedPoint = useMemo(() => {
        const { spentPoint } = rewardPoint || {};

        return spentPoint?.point_amount || 0;
    }, [rewardPoint]);

    const [usePoint, setUsePoint] = useState(usedPoint);
    const [useSlide, setUseSlide] = useState(false);

    useEffect(() => {
        if (usePoint !== usedPoint) {
            setUsePoint(usedPoint);
        }
    }, [usedPoint]);

    useEffect(() => {
        if (useSlide) {
            rewardPointChange.push(usePoint);
        }
    }, [useSlide, usePoint]);

    // useEffect(() => {
    //     if(useSlide) {
    //         setInterval(() => {
    //             if()
    //         }, 500)
    //     }
    // }, [useSlide])

    const operations = mergeOperations(defaultOperations, props.operations);

    const { getCustomerRewardPoint, applyRewardPointMutation } = operations;

    const isActive = useMemo(() => {
        return rewardPointActive && isSignedIn;
    }, [rewardPointActive, isSignedIn]);

    const { data } = useQuery(getCustomerRewardPoint, {
        skip: !isActive
    });

    const [
        applyRewardPoint,
        { loading: applyRewardPointLoading, error: applyRewardPointError }
    ] = useMutation(applyRewardPointMutation);

    const customerRewardPointData = useMemo(() => {
        return data?.customer?.reward_point || {};
    }, [data]);

    const point = useMemo(() => {
        return customerRewardPointData?.point || 0;
    }, [customerRewardPointData]);

    const balancePoint = useMemo(() => {
        if (point > usedPoint) {
            return point - usedPoint;
        }

        return 0;
    }, [point, usedPoint]);

    const rate = useMemo(() => {
        return customerRewardPointData.rate_point || 0;
    }, [customerRewardPointData]);

    const currency = useMemo(() => {
        const { storeConfig } = storeConfigData;
        return storeConfig?.base_currency_code || 'USD';
    }, [storeConfigData]);

    const handleSetUsePoint = useCallback(
        e => {
            let targetPoint = parseInt(e.target.value);
            if (e.target.value === '') {
                targetPoint = '';
            } else if (!Number.isInteger(targetPoint)) {
                targetPoint = '';
            } else if (targetPoint > point) {
                targetPoint = point;
            } else if (targetPoint < 1) {
                targetPoint = 1;
            }
            setUsePoint(targetPoint);
        },
        [setUsePoint, point, useSlide]
    );

    const handleApply = useCallback(async () => {

        const { data } = await applyRewardPoint({
            variables: {
                cartId,
                amount: usePoint
            }
        });

        const response = data?.applyRewardPoint?.cart || {};

        let type = 'error';
        if (response.success) {
            type = 'info';
            // setIsCartUpdating(true)
            refetchCartPage();
        }

        const message =
            response.error_message ||
            formatMessage({
                id: 'Some thing went wrong! Please try again',
                default: 'Some thing went wrong! Please try again'
            });

        addToast({
            type,
            message: message,
            timeout: 5000
        });
    }, [usePoint, applyRewardPointLoading, applyRewardPoint, addToast]);

    return {
        isActive,
        point,
        loading: applyRewardPointLoading,
        balancePoint,
        rate,
        currency,
        usePoint,
        handleSetUsePoint,
        handleApply
    };
};
