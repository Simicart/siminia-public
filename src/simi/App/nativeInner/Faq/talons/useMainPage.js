import { useQuery } from '@apollo/client';
import { GET_MAIN_PAGE_FAQS } from './Faq.gql';

export const useMainPage = props => {
    const {
        data: mainPageData,
        loading: mainPageLoading,
        error: mainPageError
    } = useQuery(GET_MAIN_PAGE_FAQS, { fetchPolicy: 'cache-and-network' });

    let derivedErrorMessage;
    if (mainPageError) {
        const errorTarget = mainPageError;
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
        mainPageData,
        mainPageLoading,
        mainPageError
    };
};
