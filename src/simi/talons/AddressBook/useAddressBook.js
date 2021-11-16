import { useCallback, useMemo, useEffect } from 'react';
import { simiUseMutation as useMutation, simiUseQuery as useQuery, simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useAddressBook = props => {

    const {
        afterSubmit,
        query: { getCustomerAddress },
        mutation: { deleteAddressMutation }
    } = props;

    const [{ isSignedIn }] = useUserContext();

    const { data: addressData, error: addressDataError, loading } = useQuery(
        getCustomerAddress,
        {
            fetchPolicy: 'cache-and-network',
            skip: !isSignedIn
        }
    );

    const [fetchAddresses, { data: reFetchData, error: fetchError }] = useLazyQuery(
        getCustomerAddress,
        {
            fetchPolicy: 'cache-and-network',
            skip: !isSignedIn
        }
    );

    const [
        deleteAddress,
        { data: deleteData, error: deleteAddressError, loading: isDeleting }
    ] = useMutation(deleteAddressMutation);

    const handleDeleteItem = useCallback(
        async id => {
            try {
                await deleteAddress({
                    variables: { id }
                });
            } catch {
                // we have an onError link that logs errors, and FormError already renders this error, so just return
                // to avoid triggering the success callback
                return;
            }
            if (afterSubmit) {
                afterSubmit();
            }
        },
        [deleteAddress, afterSubmit]
    );

    useEffect(() => {
        if (deleteData && deleteData.hasOwnProperty('deleteCustomerAddress') && deleteData.deleteCustomerAddress) {
            fetchAddresses();
        }
    }, [deleteData, fetchAddresses]);

    const initialValues = useMemo(() => {
        if (reFetchData) {
            return { addresses: reFetchData.customer.addresses }
        }
        if (addressData) {
            return { addresses: addressData.customer.addresses };
        }
    }, [addressData, reFetchData]);

    let derivedErrorMessage;
    if (addressDataError || deleteAddressError || fetchError) {
        const errorTarget = addressDataError || deleteAddressError || fetchError;
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
        initialValues,
        formErrors: derivedErrorMessage,
        loading,
        isDeleting,
        handleDeleteItem,
        afterSubmit,
        isSignedIn
    };
}
