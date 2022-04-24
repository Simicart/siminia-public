import { useQuery } from '@apollo/client';
import { GET_HOME_PAGE } from './Faq.gql';

export const useHomePage = props => {
    const {
        data: homepageData,
        loading: homepageLoading,
        error: homepageError
    } = useQuery(GET_HOME_PAGE, { fetchPolicy: 'no-cache' });

    let derivedErrorMessage;
    if (homepageError) {
        const errorTarget = homepageError;
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
        homepageData,
        homepageLoading,
        derivedErrorMessage
    };
};
