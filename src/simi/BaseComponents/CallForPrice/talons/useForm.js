import { useCallback, useMemo } from 'react';
import { getFormFields , getIsShowCustomerFields} from '../utils';
import { useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
// import { getIsShowCustomerFields } from '../utils'
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/callForPrice.gql';


export const useForm = (props = {}) => {
    const { productSku, formatMessage } = props;

    const fields = getFormFields();
    const [{ isSignedIn, currentUser }] = useUserContext();
    const isShowCustomerFields = getIsShowCustomerFields()
    const operations = mergeOperations(defaultOperations, props.operations);
    const [, { addToast }] = useToasts();
    const [, { closeDrawer }] = useAppContext();
    const { callForPriceMutaion } = operations;

    const [callForPrice, { loading: callForPriceLoading }] = useMutation(
        callForPriceMutaion
    );

    const initialValues = useMemo(() => {
        const values = {};
        if (currentUser.email) values.email = currentUser.email;

        let name = '';
        if (currentUser.firstname) name += currentUser.firstname;
        if(name) name += ' '
        if (currentUser.lastname) name += currentUser.lastname;
        if(name) values.name = name
        return values
    }, [currentUser]);

    const hdieFieldWhenLogin = useMemo(() => {
        if(!isSignedIn) {
            return false
        }

        return parseInt(isShowCustomerFields) === 0
    }, [isSignedIn, isShowCustomerFields])

    const handleCallForPrice = useCallback(
        async formValues => {
            const { name, email, ...extraFields } = formValues;

            const { data } =
                (await callForPrice({
                    variables: {
                        skuProduct: productSku,
                        name,
                        mail: email,
                        extraField: JSON.stringify(extraFields)
                    }
                })) || {};

            let message = formatMessage({
                id: 'Something went wrong! Please try again',
                defaultMessage: 'Something went wrong! Please try again'
            });
            let type = 'error';

            if (
                data &&
                data.callForPrice &&
                data.callForPrice.status === 'success'
            ) {
                type = 'info';
                message = formatMessage({
                    id:
                        "Thanks for contacting us with your comments and questions. We'll respond to you very soon.",
                    defaultMessage:
                        "Thanks for contacting us with your comments and questions. We'll respond to you very soon."
                });
            }

            addToast({
                type,
                message: message,
                timeout: 5000
            });

            closeDrawer();
        },
        [callForPrice, productSku, formatMessage, addToast, closeDrawer]
    );

    const filedsFilted = useMemo(() => {
        return fields.sort(
            (a, b) => parseInt(a.field_order) - parseInt(b.field_order)
        );
    }, [fields]);

    return {
        fields: filedsFilted,
        initialValues,
        hdieFieldWhenLogin,
        handleCallForPrice,
        callForPriceLoading
    };
};
