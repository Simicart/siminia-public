import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import {
    GET_CUSTOMER_REWARD_POINTS,
    GET_CUSTOMER_TRANSACTION,
    GET_REWARD_POINTS_CONFIG,
    SET_REWARD_SUBSCRIBE_STATUS
} from './rewardPoints.gql';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

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
        skip: !rewardPointEnabled || !isSignedIn
    });

    const {
        data: rewardPointConfig,
        loading: rewardPointConfigLoading,
        error: rewardPointConfigError
    } = useQuery(GET_REWARD_POINTS_CONFIG, {
        fetchPolicy: 'cache-and-network',
        skip: !rewardPointEnabled || !isSignedIn
    });

    const { data: rewardTransactionData } = useQuery(GET_CUSTOMER_TRANSACTION, {
        variables: { pageSize: 100 },
        fetchPolicy: 'cache-and-network',
        skip: !rewardPointEnabled || !isSignedIn || (props && props.onCart)
    });
    const [mpRewardPoints, { loading: setSubcribeLoading }] = useMutation(
        SET_REWARD_SUBSCRIBE_STATUS
    );
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
    }, [isBackgroundLoading, setPageLoading, setSubcribeLoading]);
    return {
        errorMessage: derivedErrorMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        mpRewardPoints,
        setSubcribeLoading,
        customerEmail,
        customerRewardPoint,
        customerTransactions,
        rewardTransactionData,
        rewardPointConfig,
        rewardPointConfigLoading,
        rewardPointConfigError
    };
};
