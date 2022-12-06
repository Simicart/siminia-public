import { useMemo } from 'react';
import defaultOperations from '../queries/callForPriceQuery';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { isCallForPriceEnable } from 'src/simi/App/nativeInner/Helper/Module'
import { useQuery } from '@apollo/client'

export const useCallForPrice = (props = {}) => {

    const callForPriceEnabled = isCallForPriceEnable()
    console.log(callForPriceEnabled)
    const operations = mergeOperations(defaultOperations, props.operations);
    const { getCallForPriceConfig } = operations
    console.log(getCallForPriceConfig)

    const { data, loading } = useQuery(
        getCallForPriceConfig,
        {
            skip: !callForPriceEnabled
        }
    );

    console.log(data)

    const { enable, form_fields } = data || {}

    const isEnabledCallForPrice = useMemo(() => {
        return !!enable
    })

    const callForPriceFields = useMemo(() => {
        return form_fields || []
    })

    return {
        isEnabledCallForPrice,
        callForPriceFields
    }
}