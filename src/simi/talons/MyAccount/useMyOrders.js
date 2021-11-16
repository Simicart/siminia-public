import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { showToastMessage } from 'src/simi/Helper/Message';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Identify from "src/simi/Helper/Identify";
import { useCallback } from 'react';

export const useMyOrders = props => {
    const {
        showLoading,
        query: { getOrderList },
        mutation: { reOrderItems }
    } = props;

    const [{ isSignedIn }] = useUserContext();

    const {
        data: dataOrderList,
        loading: loadingOrderList,
        error: errorOrderList
    } = useQuery(getOrderList, {
        fetchPolicy: 'no-cache',
        skip: !isSignedIn
    });

    const [
        reorderItemsMutation
        , {
            data: dataReorder,
            loading: loadingReorder,
            error: errorReorder
        }
    ] = useMutation(reOrderItems);

    const dataOrders = useMemo(() => {
        if (dataOrderList) {
            return dataOrderList.customerOrders;
        }
    }, [dataOrderList]);

    const handleReOrderItem = useCallback(
        async orderNumber => {
            showFogLoading();
            try {
                await reorderItemsMutation({
                    variables: { orderNumber }
                });
            } catch {
                hideFogLoading();
                // we have an onError link that logs errors, and FormError already renders this error, so just return
                // to avoid triggering the success callback
                return;
            }
            hideFogLoading();
        }, [reorderItemsMutation]);

    let derivedErrorMessage;
    if (errorOrderList || errorReorder) {
        const errorTarget = errorOrderList || errorReorder;
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
        isSignedIn,
        data: dataOrders,
        handleReOrderItem,
        dataReorder,
        loading: loadingOrderList || loadingReorder,
        errors: derivedErrorMessage
    }
}
