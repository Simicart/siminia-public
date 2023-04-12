import { useQuery } from '@apollo/client';
import { GET_FAQ_CONFIG } from './Faq.gql';

const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

export const useStoreConfig = props => {
    const {
        data: storeConfig,
        loading: storeConfigLoading,
        error: storeConfigError
    } = useQuery(GET_FAQ_CONFIG, { fetchPolicy: 'no-cache', skip: faqsEnabled === 0 });

    let derivedErrorMessage;
    if (storeConfigError) {
        const errorTarget = storeConfigError;
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
        storeConfig,
        storeConfigLoading,
        storeConfigError
    };
};