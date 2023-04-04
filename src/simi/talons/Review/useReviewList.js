import { useState, useCallback, useEffect, useMemo } from 'react';
import {
    simiUseMutation as useMutation,
    simiUseLazyQuery as useLazyQuery
} from 'src/simi/Network/Query';
import {
    showFogLoading,
    hideFogLoading
} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

let loadedReview = null;

export const useReviewList = props => {
    const {
        sku,
        itemsPerPage,
        queries: { getProductReview },
        mutation: { createProductReview }
    } = props;

    const [{ isSignedIn }] = useUserContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [thisPage, setThisPage] = useState(false);

    const [
        getReviewItems,
        { data: data, error: error, loading: loading }
    ] = useLazyQuery(getProductReview, { fetchPolicy: 'no-cache' });

    // const variables = {
    //     sku: sku,
    //     pageSize: itemsPerPage,
    //     currentPage: currentPage
    // };

    const [
        submitProductReview,
        { data: reviewed, error: reviewError, loading: isSubmittingReview }
    ] = useMutation(createProductReview);

    useEffect(() => {
        const variables = {
            sku: sku,
            pageSize: itemsPerPage,
            currentPage: currentPage
        };
        if (sku) {
            if (!thisPage) loadedReview = null;
            getReviewItems({ variables });
        }
    }, [sku, getReviewItems, currentPage, thisPage, itemsPerPage]);

    const dataReview = useMemo(() => {
        if (
            data &&
            Object.prototype.hasOwnProperty.call(data, 'productDetail') &&
            data.productDetail &&
            data.productDetail.items
        ) {
            const { items } = data.productDetail.items[0].reviews;
            if (!loadedReview) {
                loadedReview = data;
            } else {
                let loadedItems =
                    loadedReview.productDetail.items[0].reviews.items;
                loadedItems = loadedItems.concat(items);
                for (var i = 0; i < loadedItems.length; ++i) {
                    for (var j = i + 1; j < loadedItems.length; ++j) {
                        if (
                            loadedItems[i] &&
                            loadedItems[j] &&
                            loadedItems[i].nickname ===
                                loadedItems[j].nickname &&
                            loadedItems[i].summary === loadedItems[j].summary
                        )
                            loadedItems.splice(j--, 1);
                    }
                }
                loadedReview.productDetail.items[0].reviews.items = loadedItems;
            }
            if (
                loadedReview &&
                loadedReview.productDetail &&
                loadedReview.productDetail.items[0] &&
                loadedReview.productDetail.items[0].sku === sku
            )
                return loadedReview;
        } else if (loadedReview && thisPage) return loadedReview;
        return data;
    }, [data, sku, thisPage]);

    const submitReview = useCallback(async formValues => {
        showFogLoading();
        try {
            await submitProductReview({
                variables: formValues
            });

            smoothScrollToView(document.getElementById('root'));
        } catch {
            // we have an onError link that logs errors, and FormError already renders this error, so just return
            // to avoid triggering the success callback
            return;
        }
        hideFogLoading();
    }, [submitProductReview]);

    const isSubmittedReview = useMemo(() => {
        return reviewed;
    }, [reviewed]);

    const loadMoreReview = useCallback(
        page => {
            setCurrentPage(page);
            setThisPage(true);
        },
        [setCurrentPage]
    );

    let derivedErrorMessage;
    if (error || reviewError) {
        const errorTarget = error || reviewError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            derivedErrorMessage = errorTarget.message;
        }
    }

    return {
        dataReview,
        derivedErrorMessage,
        loading,
        currentPage,
        loadMoreReview,
        isSignedIn,
        submitReview,
        isSubmittedReview,
        isSubmittingReview
    };
};
