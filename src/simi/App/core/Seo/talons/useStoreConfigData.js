import { GET_STORE_CONFIG_DATA } from '../queries/getStoreConfigData.gql';
import { useQuery } from '@apollo/client';

export const useStoreConfigData = props => {
    const {
        data: storeConfigData,
        loading: storeConfigLoading,
        error: storeConfigError
    } = useQuery(GET_STORE_CONFIG_DATA, {fetchPolicy:"cache-and-network"});

    return {
        storeConfigData,
        storeConfigLoading,
        storeConfigError
    }
}