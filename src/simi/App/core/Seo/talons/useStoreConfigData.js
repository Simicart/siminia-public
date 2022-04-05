import { GET_STORE_CONFIG_DATA } from '../queries/getStoreConfigData.gql';
import { useQuery } from '@apollo/client';
import Identify from '../../../../Helper/Identify';

export const useStoreConfigData = props => {
    const smStoreConfig = Identify.getStoreConfig();
    // const {
    //     data: storeConfigData,
    //     loading: storeConfigLoading,
    //     error: storeConfigError
    // } = useQuery(GET_STORE_CONFIG_DATA, { fetchPolicy: 'cache-first' });
    // const storeConfigError = false;
    // const storeConfigData = smStoreConfig || false;

    // let derivedErrorMessage;
    // if (storeConfigError) {
    //     const errorTarget = storeConfigError;
    //     if (errorTarget.graphQLErrors) {
    //         // Apollo prepends "GraphQL Error:" onto the message,
    //         // which we don't want to show to an end user.
    //         // Build up the error message manually without the prepended text.
    //         derivedErrorMessage = errorTarget.graphQLErrors
    //             .map(({ message }) => message)
    //             .join(', ');
    //     } else {
    //         // A non-GraphQL error occurred.
    //         derivedErrorMessage = errorTarget.message;
    //     }
    // }

    return {
        storeConfigData: smStoreConfig,
        storeConfigLoading: !smStoreConfig,
        storeConfigError: false
    };
};
