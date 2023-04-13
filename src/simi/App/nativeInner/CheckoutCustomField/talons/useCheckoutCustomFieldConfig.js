import { useQuery } from '@apollo/client';
import { GET_CHECKOUT_CUSTOM_FIELD_CONFIG } from './checkoutCustomField.gql';

const checkoutCustomFieldEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_CHECKOUT_CUSTOM_FIELD &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CHECKOUT_CUSTOM_FIELD) === 1;

console.log(checkoutCustomFieldEnabled)

export const useCheckoutCustomFieldConfig = props => {
    const {
        data: checkoutCustomFieldConfig,
        loading: checkoutCustomFieldConfigLoading,
        error: checkoutCustomFieldConfigError
    } = useQuery(GET_CHECKOUT_CUSTOM_FIELD_CONFIG, {
        skip: checkoutCustomFieldEnabled === 0
    });

    let derivedErrorMessage;
    if (checkoutCustomFieldConfigError) {
        const errorTarget = checkoutCustomFieldConfigError;
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
        checkoutCustomFieldConfig,
        checkoutCustomFieldConfigLoading,
        checkoutCustomFieldConfigError
    };
};
