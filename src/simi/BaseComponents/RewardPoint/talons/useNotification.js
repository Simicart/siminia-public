import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/customer.ggl';

export const useNotification = (props = {}) => {
    const { formatMessage } = props
    const operations = mergeOperations(defaultOperations, props.operations);

    const { updateNotifycationMutation } = operations;

    const [, { addToast }] = useToasts();

    const [
        updateNotify,
        { loading: updateNotifyLoading, error: updateNotifyError }
    ] = useMutation(updateNotifycationMutation);

    const handleSubmit = useCallback(async formValues => {
        const { notify_balance, notify_expiration } = formValues;

        const { data } = await updateNotify({
            variables: {
                notifyBalance: notify_balance ? 1 : 0,
                notifyExpiration: notify_expiration ? 1 : 0
            }
        });

        const response = data?.updateNotify?.status || {};

        const type = response.success ? 'info' : 'error';

        const message =
            response.message ||
            formatMessage({
                id: 'Some thing went wrong! Please try again',
                default: 'Some thing went wrong! Please try again'
            });

        addToast({
            type,
            message: message,
            timeout: 5000
        });
    });

    return {
        handleSubmit,
        loading: updateNotifyLoading
    };
};
