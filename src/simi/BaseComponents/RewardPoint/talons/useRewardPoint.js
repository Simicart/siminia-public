import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { getRewardPointActive, getBaseCurrency } from '../utils';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/customer.gql';


export const useRewardPoint = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    const { getCustomerRewardPoint } = operations;
    const rewardPointActive = getRewardPointActive();
    const baseCurrencyCode = getBaseCurrency();
    const [{ isSignedIn }] = useUserContext();

    const { data } = useQuery(getCustomerRewardPoint, {
        skip: !(rewardPointActive && isSignedIn)
    });

    const customerRewardPointData = useMemo(() => {
        return data?.customer?.reward_point || {};
    }, [data]);

    const point = useMemo(() => {
        return customerRewardPointData?.point || 0;
    }, [customerRewardPointData]);

    const rate = useMemo(() => {
        return customerRewardPointData?.rate_point || 0;
    }, [customerRewardPointData]);

    const pointUsed = useMemo(() => {
        return customerRewardPointData?.point_used || 0;
    }, [customerRewardPointData])

    const pointExpired = useMemo(() => {
        return customerRewardPointData?.point_expired || 0;
    }, [customerRewardPointData])

    const pointEarned = useMemo(() => {
        return point - pointUsed - pointExpired
    }, [point, pointUsed, pointExpired])

    return {
        isActive: rewardPointActive,
        isSignedIn,
        point,
        pointEarned,
        pointUsed,
        rate,
        baseCurrencyCode
    };
};
