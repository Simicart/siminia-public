import { useQuery } from '@apollo/client';
import { GET_CATEGORY_BY_URL } from './Faq.gql';

const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

export const useCategory = props => {
    const { url_key } = props
    const {
        data: categoriesData,
        loading: categoriesLoading,
        error: categoriesError
    } = useQuery(GET_CATEGORY_BY_URL, { 
        variables:{ url: url_key },
        fetchPolicy:"no-cache",
        skip: faqsEnabled === 0
    });
    let derivedErrorMessage;
    if (categoriesError) {
        const errorTarget = categoriesError;
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
        categoriesData,
        categoriesLoading,
        categoriesError
    };
};
