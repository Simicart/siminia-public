import { useCallback, useState, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import {
    simiUseMutation,
    simiUseAwaitQuery,
    simiUseQuery as useQuery
} from 'src/simi/Network/Query';
import {
    SET_CUSTOMER_INFORMATION,
    CHANGE_CUSTOMER_PASSWORD,
    GET_CUSTOMER_INFORMATION
} from '../talons/accountInformationPage.gql';

export const useAccountInformationPage = props => {
    const {
        defaultForm,
        onSubmit
    } = props;

    const [isActiveForm, setIsActiveForm] = useState(defaultForm);
    const apolloClient = useApolloClient();
    const [{ isSignedIn, currentUser }, { getUserDetails }] = useUserContext();

    const {
        data: reFetchData,
        loading: reFetchLoading,
        error: fetchError
    } = useQuery(GET_CUSTOMER_INFORMATION, {
        fetchPolicy: 'no-cache',
        skip: !isSignedIn
    });

    const [
        updateCustomer,
        {
            data: customerDataUpdated,
            error: updateCustomerError,
            loading: updateCustomerLoading
        }
    ] = simiUseMutation(SET_CUSTOMER_INFORMATION, {
        fetchPolicy: 'no-cache'
    });
    const [
        updateCustomerPassword,
        {
            error: updateCustomerPasswordError,
            loading: updateCustomerPasswordLoading
        }
    ] = simiUseMutation(CHANGE_CUSTOMER_PASSWORD, {
        fetchPolicy: 'no-cache'
    });

    const fetchUserDetails = simiUseAwaitQuery(GET_CUSTOMER_INFORMATION);

    const handleUpdateInfo = useCallback(
        async formValues => {
            // showFogLoading();
            try {
                const currentPassword = formValues.current_password;
                const newPassword = formValues.new_password;
                await updateCustomer({
                    variables: formValues
                });

                if (isActiveForm === 'password') {
                    await updateCustomerPassword({
                        variables: {
                            currentPassword,
                            newPassword
                        }
                    });
                }

                await getUserDetails({ fetchUserDetails });

                if (onSubmit) {
                    onSubmit();
                }
            } catch (err) {
                // Do nothing. The error message is handled above.
            }

            // hideFogLoading();
        },
        [
            isActiveForm,
            updateCustomer,
            onSubmit,
            updateCustomerPassword,
            apolloClient
        ]
    );

    const handleActiveForm = useCallback(
        state => {
            setIsActiveForm(state);
        },
        [setIsActiveForm]
    );

    const initialValues = useMemo(() => {
        if (customerDataUpdated) {
            return customerDataUpdated.updateCustomer.customer;
        }
        if (reFetchData) {
            return reFetchData.customer;
        }
        if (currentUser) {
            return currentUser;
        }
    }, [reFetchData, customerDataUpdated, currentUser]);

    let derivedErrorMessage;
    if (updateCustomerError || updateCustomerPasswordError) {
        const errorTarget = updateCustomerError || updateCustomerPasswordError;
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
        initialValues,
        handleUpdateInfo,
        errors: derivedErrorMessage,
        isActiveForm,
        handleActiveForm,
        isLoading:
            updateCustomerLoading ||
            updateCustomerPasswordLoading ||
            reFetchLoading
    };
};
