import { useMemo } from 'react';
import { getRewardPointActive, getRewardPointCartOrderSummary } from '../utils';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const usePriceSummary = props => {
    const { earnPoint, spentPoint } = props;
    const [{ isSignedIn }] = useUserContext();
    const rewardPointActive = getRewardPointActive();
    const rewardPointCartOrderSummary = getRewardPointCartOrderSummary();

    const isActive = useMemo(() => {
        return rewardPointActive && isSignedIn && rewardPointCartOrderSummary;
    }, [rewardPointActive, isSignedIn, rewardPointCartOrderSummary]);

    const spendPointAsMoney = useMemo(() => {
        return spentPoint?.as_money_amount || 0;
    }, [spentPoint]);

    const spendPointAmount = useMemo(() => {
        return spentPoint?.point_amount || 0;
    },[spentPoint?.point_amount]);

    return {
        isActive,
        earnPoint,
        spendPointAsMoney,
        spendPointAmount
    };
};
