import { useEffect, useMemo, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { getRewardPointActive } from '../utils';
import { useHistory, useLocation } from 'react-router-dom';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/customer.gql';
import { usePagination } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';

export const useTransactionPagination = (props) => {
    const { isDetail } = props
    const history = useHistory()
    const location = useLocation()

    const [{ isSignedIn }] = useUserContext();
    const operations = mergeOperations(defaultOperations, props.operations);
    const rewardPointActive = getRewardPointActive();
    // const [pageSize, setPageSize] = useState(5);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const pageSize = getSearchParam('limit', location) || 5

    const { getRewardPointsTransaction } = operations;

    const variables = {
        currentPage: parseInt(currentPage),
        pageSize: parseInt(pageSize)
    };

    const { data, loading } = useQuery(getRewardPointsTransaction, {
        variables,
        skip: !(rewardPointActive && !isDetail) ,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const totalPage = useMemo(() => {
        return data?.bssRewardPointsTransaction?.total_page || 1
    }, [data])

    useEffect(() => {
        setTotalPages(parseInt(totalPage))
    }, [totalPage])

    const detailData = useMemo(() => {
        return history?.location?.state?.detail || {}
    },[history])

    const items = useMemo(() => {
        return data?.bssRewardPointsTransaction?.items || []
    }, [data])

    const handleSetPageSize = useCallback((e) => {
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        queryParams.set('limit', e.target.value);
        history.push({ search: queryParams.toString() });
    })

    return {
        items,
        detailData,
        pageControl,
        pageSize,
        handleSetPageSize,
        isActive: rewardPointActive,
        isSignedIn,
        loading
    };
}

export const useTransaction = (props) => {
    const { isDetail } = props
    const history = useHistory()
    const [{ isSignedIn }] = useUserContext();
    const operations = mergeOperations(defaultOperations, props.operations);
    const rewardPointActive = getRewardPointActive();

    const { getRewardPointsTransaction } = operations;

    const { data, loading } = useQuery(getRewardPointsTransaction, {
        variables: {
            currentPage: 1,
            pageSize: 5
        },
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
        detailData,
        loading,
        isActive: rewardPointActive,
        isSignedIn,
    };
};
