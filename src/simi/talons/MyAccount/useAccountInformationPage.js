import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import {SET_CUSTOMER_INFORMATION,CHANGE_CUSTOMER_PASSWORD,GET_CUSTOMER_INFORMATION} from '../../App/nativeInner/AccountInformationPage/accountInformationPage.gql';

export const useAccountInformationPage = props => {
    // const {
    //     mutations: {
    //         setCustomerInformationMutation,
    //         changeCustomerPasswordMutation
    //     },
    //     queries: { getCustomerInformationQuery }
    // } = props;
    const {
        defaultForm,
    } = props;
    const [isActiveForm, setIsActiveForm] = useState(defaultForm);

    const [{ isSignedIn }] = useUserContext();
    const [shouldShowNewPassword, setShouldShowNewPassword] = useState(false);

    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [alertMsg, setAlertMsg] = useState(-1)
    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const { data: accountInformationData, error: loadDataError } = useQuery(
        GET_CUSTOMER_INFORMATION,
        {
            skip: !isSignedIn,
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [
        setCustomerInformation,
        {
            error: customerInformationUpdateError,
            loading: isUpdatingCustomerInformation
        }
    ] = useMutation(SET_CUSTOMER_INFORMATION);

    const [
        changeCustomerPassword,
        {
            error: customerPasswordChangeError,
            loading: isChangingCustomerPassword
        }
    ] = useMutation(CHANGE_CUSTOMER_PASSWORD);

    const handleActiveForm = useCallback(
        (state) => {
            setIsActiveForm(state);
        }, [setIsActiveForm]
    );

    const initialValues = useMemo(() => {
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [accountInformationData]);

    const handleChangePassword = useCallback(() => {
        setShouldShowNewPassword(true);
    }, [setShouldShowNewPassword]);

    const handleCancel = useCallback(() => {
        setIsUpdateMode(false);
        setShouldShowNewPassword(false);
    }, [setIsUpdateMode]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);

        // If there were errors from removing/updating info, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [setIsUpdateMode]);

    const handleSubmit = useCallback(
        async ({ email, firstname, lastname, password, newPassword }) => {
            try {
                email = email.trim();
                firstname = firstname.trim();
                lastname = lastname.trim();
                password = password.trim();
                newPassword = newPassword ? newPassword.trim() : newPassword;

                if (
                    initialValues.customer.email !== email ||
                    initialValues.customer.firstname !== firstname ||
                    initialValues.customer.lastname !== lastname
                ) {
                    await setCustomerInformation({
                        variables: {
                            customerInput: {
                                email,
                                firstname,
                                lastname,
                                // You must send password because it is required
                                // when changing email.
                                password
                            }
                        }
                    });
                }
                if (password && newPassword) {
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: password,
                            newPassword: newPassword
                        }
                    });
                }
                setAlertMsg(true)
                // After submission, close the form if there were no errors.
                handleCancel(false);
            } catch {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);

                // we have an onError link that logs errors, and FormError
                // already renders this error, so just return to avoid
                // triggering the success callback
                return;
            }
        },
        [
            setCustomerInformation,
            handleCancel,
            changeCustomerPassword,
            initialValues
        ]
    );

    const errors = displayError
        ? [customerInformationUpdateError, customerPasswordChangeError]
        : [];

    return {
        handleCancel,
        formErrors: errors,
        handleSubmit,
        handleChangePassword,
        initialValues,
        isDisabled: isUpdatingCustomerInformation || isChangingCustomerPassword,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        handleActiveForm,
        isActiveForm,
        showUpdateMode,
        isLoading : isUpdatingCustomerInformation || isChangingCustomerPassword,
        setAlertMsg,
        alertMsg
    };
};
