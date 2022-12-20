
import { useMemo } from 'react';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../queries/rewardPoint.gql'
import Identify from 'src/simi/Helper/Identify';
import { useQuery } from '@apollo/client';

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

export const useRewardPoint = (props = {}) => {
    
    const operations = mergeOperations(defaultOperations, props.operations);

    const { getRewardPointConfig } = operations

    const smStoreConfig = Identify.getStoreConfig();

    console.log(smStoreConfig)

    const { storeConfig } = smStoreConfig || {}

    const storeConfigId = useMemo(() => {
        return (storeConfig && storeConfig.id) || null
    }, [storeConfig])

    console.log(storeConfigId)

    const { data } = useQuery(getRewardPointConfig, {
        skip: !(rewardPointEnabled && storeConfigId),
        variable: {
            storeId: storeConfigId
        }
        // nextFetchPolicy: 'cache-first'
    });

    const isActive = useMemo(() => {
        return (data && data.bssRewardPointStoreConfig && data.bssRewardPointStoreConfig.active) || false
    }, [data])

    return {
        isActive
    }
}
