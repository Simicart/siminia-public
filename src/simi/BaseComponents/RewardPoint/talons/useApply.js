import { useMemo, useCallback, useState, useEffect } from 'react';
import { getRewardPointActive, getRewardPointSlider } from '../utils';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useQuery, useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useToasts } from '@magento/peregrine';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/rewardPoint.gql';
import Identify from 'src/simi/Helper/Identify';

export const useApply = (props = {}) => {
    const { formatMessage, rewardPoint, refetchCartPage } = props;
    console.log(rewardPoint)
    const [{ isSignedIn }] = useUserContext();
    const storeConfigData = Identify.getStoreConfig();
    const rewardPointActive = getRewardPointActive();
    const rewardPointSlider = getRewardPointSlider()
    const [{ cartId }] = useCartContext();
    const [, { addToast }] = useToasts();

    const usedPoint = useMemo(() => {
        const { spentPoint } = rewardPoint || {};

        return spentPoint?.point_amount || 0;
    }, [rewardPoint]);

    const [usePoint, setUsePoint] = useState(usedPoint);

    const operations = mergeOperations(defaultOperations, props.operations);

    const { getCustomerRewardPoint, applyRewardPointMutation, getRewardPointExchangeRate } = operations;

    const isActive = useMemo(() => {
        return rewardPointActive && isSignedIn;
    }, [rewardPointActive, isSignedIn]);

    const { data } = useQuery(getCustomerRewardPoint, {
        skip: !isActive,
        fetchPolicy: 'cache-and-network'
    });

    const { data: rewardPointExchangeRateData } = useQuery(getRewardPointExchangeRate, {
        skip: !isActive
    })

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
        if (point > usePoint) {
            return point - usePoint;
        }

        return 0;
    }, [point, usePoint]);

    const pointExchangeRate = useMemo(() => {
        return rewardPointExchangeRateData?.bssRewardPointsExchangeRate?.currency_to_point_rate || 0;
    }, [rewardPointExchangeRateData]);

    const currencyExchaneRate = useMemo(() => {
        return rewardPointExchangeRateData?.bssRewardPointsExchangeRate?.point_rate_to_currency || 0;
    }, [rewardPointExchangeRateData])

    const currency = useMemo(() => {
        const { storeConfig } = storeConfigData || {};
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
        [setUsePoint, point]
    );

    const handleApply = useCallback(async () => {

        if(usePoint <= 0) {
            addToast({
                type: 'error',
                message:  formatMessage({
                    id: 'Please enter point greater than 0',
                    default: 'Please enter point greater than 0'
                }),
                timeout: 5000
            });

            return;
        } 

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
        pointSlider: rewardPointSlider,
        point,
        loading: applyRewardPointLoading,
        balancePoint,
        pointExchangeRate,
        currencyExchaneRate,
        currency,
        usePoint,
        handleSetUsePoint,
        handleApply
    };
};
