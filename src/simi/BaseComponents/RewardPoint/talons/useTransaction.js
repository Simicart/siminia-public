import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { getRewardPointActive } from '../utils';
import { useHistory, useParams } from 'react-router-dom';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/customer.ggl';

export const useTransaction = (props) => {
    const history = useHistory()
    const params = useParams()

    const operations = mergeOperations(defaultOperations, props.operations);
    const rewardPointActive = getRewardPointActive();

    const isDetail = useMemo(() => {
        return !!params?.transactionId || false
    })

    const { getRewardPointsTransaction } = operations;

    const { data } = useQuery(getRewardPointsTransaction, {
        skip: !(rewardPointActive && !isDetail) ,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const detailData = useMemo(() => {
        return history?.location?.state?.detail || {}
    })

    const items = useMemo(() => {
        return data?.bssRewardPointsTransaction?.items || []
    }, [data])

    return {
        items,
        isDetail,
        detailData
    };
};
