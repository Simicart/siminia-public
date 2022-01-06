import { useQuery } from '@apollo/client';
import { GET_BRANDS_BY_URL } from './Brand.gql';

export const useBrandDetails = props => {
    const { url_key } = props
    //get Brand Details useQuery
    const {
        data: brandData,
        loading: brandLoading,
        error: brandError
    } = useQuery(GET_BRANDS_BY_URL, {
        variables: {
            url_key: url_key
        },
        fetchPolicy:"cache-and-network"
    });

    let derivedErrorMessage;
    if (brandError) {
        const errorTarget = brandError;
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
        brandData,
        brandLoading,
        derivedErrorMessage
    }
}
