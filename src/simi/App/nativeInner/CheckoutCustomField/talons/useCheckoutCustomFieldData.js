import { useMutation, useQuery } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import {
    GET_ALL_CHECKOUT_CUSTOM_FIELD_DATA,
    SET_QUOTE_CHECKOUT_CUSTOM_FIELD
} from './checkoutCustomField.gql';

const checkoutCustomFieldEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_CHECKOUT_CUSTOM_FIELD &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CHECKOUT_CUSTOM_FIELD) === 1;

export const useCheckoutCustomFieldData = props => {
    const {
        data: checkoutCustomFieldData,
        loading: checkoutCustomFieldLoading,
        error: checkoutCustomFieldError
    } = useQuery(GET_ALL_CHECKOUT_CUSTOM_FIELD_DATA, {
        fetchPolicy: 'no-cache',
        skip: checkoutCustomFieldEnabled === 0
    });

    let derivedErrorMessage;
    if (checkoutCustomFieldError) {
        const errorTarget = checkoutCustomFieldError;
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

    const [inputs, setInputs] = useState({});
    const [isChecked, setIsChecked] = useState({});

    const [{ cartId }] = useCartContext();

    const handleChange = event => {
        const { name, value } = event.target;
        if (event.target.type === 'checkbox') {
            isChecked[value] = !isChecked[value];
            let newValue = '';
            for (let item in isChecked) {
                if (isChecked[item]) {
                    if (newValue !== '') {
                        newValue += ', ' + item;
                    } else {
                        newValue += item;
                    }
                }
            }
            setInputs(values => ({ ...values, [name]: newValue }));
        } else {
            setInputs(values => ({ ...values, [name]: value }));
        }
    };
    const [
        setQuoteCheckoutCustomFiel,
        {
            error: setQuoteCheckoutCustomFieldEror,
            loading: isSetCheckoutCustomField,
            data: setQuoteCheckoutCustomFieldData
        }
    ] = useMutation(SET_QUOTE_CHECKOUT_CUSTOM_FIELD);
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const handleSubmit = event => {
        event.preventDefault();
        let customFieldList = [];
        Object.entries(inputs).map(([key, value]) => {
            let obj = {
                attribute_code: key,
                attribute_value: value
            };
            customFieldList.push(obj);
        });
        setQuoteCheckoutCustomFiel({
            variables: {
                cartId: cartId,
                customFieldItems: customFieldList
            }
        });
        if (!setQuoteCheckoutCustomFieldEror) {
            addToast({
                type: 'info',
                message: formatMessage({
                    id: 'Set custom field  successfully'
                }),
                timeout: 3000
            });
        }
    };

    return {
        handleSubmit,
        handleChange,
        inputs,
        setInputs,
        checkoutCustomFieldData,
        loading: checkoutCustomFieldLoading,
        setQuoteCheckoutCustomFieldData,
        checkoutCustomFieldError
    };
};
