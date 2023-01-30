import { useCallback, useMemo } from 'react';
import { getFormFields } from '../utils';
import { useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/callForPrice.gql';
import { useAppContext } from '@magento/peregrine/lib/context/app';


export const useForm = (props = {}) => {
    const { productSku, formatMessage } = props;

    const fields = getFormFields();

    const operations = mergeOperations(defaultOperations, props.operations);
    const [, { addToast }] = useToasts();
    const [, { closeDrawer }] = useAppContext();
    const { callForPriceMutaion } = operations;

    const [callForPrice, { loading: callForPriceLoading }] = useMutation(
        callForPriceMutaion
    );

    const handleCallForPrice = useCallback(
        async formValues => {
            const { name, email } = formValues;

            const { data } =
                (await callForPrice({
                    variables: {
                        skuProduct: productSku,
                        name,
                        mail: email
                    }
                })) || {};

            let message = formatMessage({
                id: "Something went wrong! Please try again",
                defaultMessage: "Something went wrong! Please try again"
            });
            let type = 'error';
            console.log(data)
            if (data && data.callForPrice && data.callForPrice.status === "success") {
                type = 'info';
                message = formatMessage({
                    id: "Thanks for contacting us with your comments and questions. We'll respond to you very soon.",
                    defaultMessage: "Thanks for contacting us with your comments and questions. We'll respond to you very soon."
                });
            }

            addToast({
                type,
                message: message,
                timeout: 5000
            });

            closeDrawer()
        },
        [callForPrice, closeDrawer, addToast]
    );

    const filedsFilted = useMemo(() => {
        return fields.sort(
            (a, b) => parseInt(a.field_order) - parseInt(b.field_order)
        );
    }, [fields]);

    return {
        fields: filedsFilted,
        handleCallForPrice,
        callForPriceLoading
    };
};
