import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { getRewardPointIcon, getRewardPointActive, getRewardPointHeader } from '../utils';
import defaultOperations from '../queries/customer.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useHeader = props => {
    const [{ isSignedIn }] = useUserContext();
    const rewardPointHeader = getRewardPointHeader()
    const rewardPointActive = getRewardPointActive();
    const rewardPointIcon = getRewardPointIcon();

    const operations = mergeOperations(defaultOperations, props.operations);

    const { getCustomerRewardPoint } = operations;

    const isActive = useMemo(() => {
        return rewardPointActive && isSignedIn && rewardPointHeader;
    }, [rewardPointActive, isSignedIn, rewardPointHeader]);

    const { data } = useQuery(getCustomerRewardPoint, {
        skip: !isActive
    });

    const customerRewardPointData = useMemo(() => {
        return (data && data.customer && data.customer.reward_point) || {};
    }, [data]);

    const customerPoint = useMemo(() => {
        return customerRewardPointData.point || 0;
    }, [customerRewardPointData]);

    return {
        customerPoint,
        isActive,
        pointIcon: rewardPointIcon
    };
};
