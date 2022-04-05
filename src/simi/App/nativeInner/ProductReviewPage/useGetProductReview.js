import { useMutation, useQuery } from '@apollo/client';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useEffect, useMemo, useState } from 'react';
import { GET_CUSTOMER_REVIEWS } from './productReview.gql';

export const useGetProductReview = () => {
    const PAGE_SIZE = 10;
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(1);
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const {
        data: productReviewData,
        error: productReviewError,
        loading: productReviewLoading
    } = useQuery(GET_CUSTOMER_REVIEWS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            currentPage,
            pageSize, 
        }
    });
    
    const reviews = productReviewData? productReviewData.customer.reviews.items : [];
    const isLoadingWithoutData = !productReviewData && productReviewLoading;
    const isBackgroundLoading = !!productReviewData && productReviewLoading;

    const pageInfo = useMemo(() => {
        if (productReviewData) {
            const { total_count } = productReviewData.customer.reviews;

            return {
                current: pageSize < total_count ? pageSize : total_count,
                total: total_count
            };
        }

        return null;
    }, [productReviewData, pageSize]);

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([productReviewError]),
        [productReviewError]
    );
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        errorMessage: derivedErrorMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        reviews,
        pageInfo,
    };
};
