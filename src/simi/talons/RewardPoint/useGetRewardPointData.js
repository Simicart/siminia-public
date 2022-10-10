import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import {
    GET_CUSTOMER_REWARD_POINTS,
    GET_CUSTOMER_TRANSACTION,
    GET_REWARD_POINTS_CONFIG,
    SET_REWARD_SUBSCRIBE_STATUS
} from './rewardPoints.gql';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useGetRewardPointData = props => {
    const [{ isSignedIn }] = useUserContext();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const {
        data: rewardPointData,
        loading: rewardPointLoading,
        error: rewardPointError
    } = useQuery(GET_CUSTOMER_REWARD_POINTS, {
        fetchPolicy: 'no-cache',
        skip: !isSignedIn
    });


    const {
        data: rewardPointConfig,
        loading: rewardPointConfigLoading,
        error: rewardPointConfigError
    } = useQuery(GET_REWARD_POINTS_CONFIG, {
        fetchPolicy: 'cache-and-network'
    });


    const { data: rewardTransactionData } = useQuery(GET_CUSTOMER_TRANSACTION, {
        variables: { pageSize: 100 },
        fetchPolicy: 'cache-and-network',
        skip: !isSignedIn || (props && props.onCart)
    });
    const [mpRewardPoints] = useMutation(SET_REWARD_SUBSCRIBE_STATUS);
    const customerRewardPoint = rewardPointData
        ? rewardPointData.customer.mp_reward
        : [];
    const customerTransactions = rewardTransactionData
        ? rewardTransactionData.customer.mp_reward.transactions
        : [];
    const customerEmail = rewardPointData ? rewardPointData.customer.email : '';
    const isLoadingWithoutData = !rewardPointData && rewardPointLoading;
    const isBackgroundLoading = !!rewardPointData && rewardPointLoading;
    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([rewardPointError]),
        [rewardPointError]
    );
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);
    return {
        errorMessage: derivedErrorMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        mpRewardPoints,
        customerEmail,
        customerRewardPoint,
        customerTransactions,
        rewardTransactionData,
        rewardPointConfig
    };
};
