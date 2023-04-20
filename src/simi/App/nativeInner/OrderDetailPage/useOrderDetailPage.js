import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './orderDetailPage.gql';
const PAGE_SIZE = 10;

export const useOrderDetailPage = props => {
    const { orderId } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getOrderDetail, reorderItemMutation } = operations;

    const { data, error, loading } = useQuery(getOrderDetail, {
        fetchPolicy: 'cache-and-network',
        variables: {
            orderId
        }
    });
    console.log("dataaaaaa",data);
    return {
        loadingDetail: loading,
        dataDetail: data,
        errorDetail: error,
        reorderItemMutation
    };
};
