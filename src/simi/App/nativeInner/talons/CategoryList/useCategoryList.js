import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import Identify from '../../../../Helper/Identify';

import DEFAULT_OPERATIONS from './categoryList.gql';

/**
 * Returns props necessary to render a CategoryList component.
 *
 * @param {object} props
 * @param {object} props.query - category data
 * @param {string} props.id - category id
 * @return {{ childCategories: array, error: object }}
 */
export const useCategoryList = props => {
    const storeConfigData = Identify.getStoreConfig();
    const id =
        props.id ||
        (storeConfigData &&
        storeConfigData.categoryList &&
        storeConfigData.categoryList[0] &&
        storeConfigData.categoryList[0]
            ? storeConfigData.categoryList[0].id
            : null);
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCategoryListQuery } = operations;

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;
    const { loading, error, data } = useQuery(getCategoryListQuery, {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        skip: !id,
        variables: {
            id
        }
    });
    return {
        childCategories:
            (data && data.category && data.category.children) || null,
        storeConfig,
        error,
        loading
    };
};
