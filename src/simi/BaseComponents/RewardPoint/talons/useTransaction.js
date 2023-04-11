import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getRewardPointActive } from '../utils';
import { useHistory, useParams } from 'react-router-dom';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/customer.gql';
import { usePagination } from '@magento/peregrine';

export const useTransaction = (props) => {
    const { noTitle } = props
    const history = useHistory()
    const params = useParams()
    const operations = mergeOperations(defaultOperations, props.operations);
    const rewardPointActive = getRewardPointActive();
    const [pageSize, setPageSize] = useState(noTitle ? 5 : 10);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const isDetail = useMemo(() => {
        return !!params?.transactionId || false
    },[params?.transactionId])

    useEffect(() => {
        setTotalPages(10)
    }, [])

    const { getRewardPointsTransaction } = operations;

    const variables = {
        currentPage: parseInt(currentPage),
        pageSize: parseInt(pageSize)
    };

    const { data } = useQuery(getRewardPointsTransaction, {
        variables,
        skip: !(rewardPointActive && !isDetail) ,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const detailData = useMemo(() => {
        return history?.location?.state?.detail || {}
    },[history])

    const items = useMemo(() => {
        return data?.bssRewardPointsTransaction?.items || []
    }, [data])

    return {
        items,
        isDetail,
        detailData,
        pageControl,
        pageSize,
        setPageSize
    };
};
