import { GET_STORE_CONFIG_DATA } from '../queries/getStoreConfigData.gql';
import { useQuery } from '@apollo/client';

export const useStoreConfigData = props => {
    const {
        data: storeConfigData,
        loading: storeConfigLoading,
        error: storeConfigError
    } = useQuery(GET_STORE_CONFIG_DATA, {fetchPolicy:"cache-and-network"});
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
        storeConfigData,
        storeConfigLoading,
        storeConfigError
    }
}