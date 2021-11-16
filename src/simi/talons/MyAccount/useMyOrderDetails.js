import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { showToastMessage } from 'src/simi/Helper/Message';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Identify from "src/simi/Helper/Identify";

/* import {
    GET_ORDER_DETAILS,
    RE_ORDER_ITEMS
} from 'src/simi/App/FashionTheme/Customer/Account/Page/OrderDetail/OrderPage.gql'; */

export const useMyOrderDetails = props => {
    const { toggleMessages, showLoading, orderNumber,
        query: { getOrderDetail },
        mutation: { reOrderItems } } = props;
    const [data, setData] = useState(null);
    const isShowLoading = showLoading || true;

    const [{ isSignedIn }] = useUserContext();
    const history = useHistory();

    const onError = errorTarget => {
        let derivedErrorMessage;
        if (errorTarget.graphQLErrors) {
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            derivedErrorMessage = errorTarget.message;
        }
        if (derivedErrorMessage) {
            toggleMessages && toggleMessages([{ type: 'error', message: derivedErrorMessage, auto_dismiss: true }]);
        }
    }

    const {
        data: orderDetails,
        loading: loadingOrderDetails,
        error: errorOrderDetails
    } = useQuery(getOrderDetail, { variables: { orderNumber }, onError });

    useEffect(() => {
        if (orderDetails && orderDetails.customerOrder) {
            setData(orderDetails.customerOrder);
        }
    }, [orderDetails]);

    const [
        reorderItems
        , {
            data: dataReorder,
            loading: loadingReorder,
            error: errorReorder
        }
    ] = useMutation(reOrderItems, { onError });

    useEffect(() => {
        if (dataReorder) {
            const { reorderItems } = dataReorder;
            if (reorderItems.userInputErrors && reorderItems.userInputErrors.length) {
                let errors = [];
                errors = reorderItems.userInputErrors.map((err) => {
                    return err.message;
                });
                errors = errors.join(', ');
                toggleMessages([{ type: 'error', message: Identify.__(errors), auto_dismiss: true }]);
            } else {
                toggleMessages([{ type: 'success', message: Identify.__('Re-order success.'), auto_dismiss: true }]);
            }
        }
    }, [dataReorder]);

    const handleErrors = (data) => {
        if (data && data.errors) {
            toggleMessages([{ type: 'error', message: Identify.__(data.errors[0].message), auto_dismiss: true }]);
        }
    }

    // Handle errors
    useEffect(() => {
        handleErrors(errorOrderDetails);
        handleErrors(errorReorder);
    }, [errorOrderDetails, errorReorder]);

    const isLoading = loadingOrderDetails || loadingReorder;

    if (isShowLoading) {
        if (isLoading) {
            showFogLoading();
        } else {
            hideFogLoading();
        }
    }

    const reorder = (orderNumber) => {
        if (!isSignedIn) {
            showToastMessage(Identify.__('You are not logged in. Please log in first.'));
            history.push('/login.html');
            return;
        }
        orderNumber && reorderItems({
            variables: {
                'orderNumber': orderNumber
            }
        });
    }

    return {
        data,
        dataReorder,
        reorder,
        loading: isLoading,
        error: errorOrderDetails || errorReorder
    }
}
