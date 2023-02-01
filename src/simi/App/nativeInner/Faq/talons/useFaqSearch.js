import { useQuery } from '@apollo/client';
import { GET_SEARCH_FAQS } from './Faq.gql';

export const useFaqSearch = props => {
    const { key_word, category_id } = props;
    const {
        data: searchResults,
        loading: searchResultsLoading,
        error: searchResultsError
    } = useQuery(GET_SEARCH_FAQS, {
        variables: {
            key_word: key_word,
            category_id: category_id,
            sort_by: ''
        },
        fetchPolicy: 'no-cache'
    });

    let derivedErrorMessage;
    if (searchResultsError) {
        const errorTarget = searchResultsError;
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
        searchResults,
        searchResultsLoading,
        searchResultsError
    };
};
