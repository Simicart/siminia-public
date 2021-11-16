import { useMemo } from 'react';
import { simiUseQuery as useQuery/* , simiUseLazyQuery as useLazyQuery */ } from 'src/simi/Network/Query';
import { useWindowSize } from '@magento/peregrine';

export const useLinkedProducts = props => {

    const {
        skuValues,
        maxItem,
        query: { getProductBySku }
    } = props;

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const variables = {
        stringSku: skuValues,
        currentPage: 1,
        pageSize: maxItem
    };

    const { data: dataProducts, error: productsError, loading } = useQuery(
        getProductBySku, { fetchPolicy: 'cache-and-network', variables, skip: !skuValues }
    );

    const initialData = useMemo(() => {
        if (dataProducts) {
            let modedData = JSON.parse(JSON.stringify(dataProducts))
            return modedData
        }
        return dataProducts;
    }, [dataProducts]);

    return {
        isPhone,
        initialData,
        loading,
        productsError
    };
}
