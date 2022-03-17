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
    const { id } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCategoryListQuery } = operations;

    const { loading, error, data } = useQuery(getCategoryListQuery, {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        skip: !id,
        variables: {
            id
        }
    });

    const storeConfigData = Identify.getStoreConfig();
    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        childCategories:
            (data && data.category && data.category.children) || null,
        storeConfig,
        error,
        loading
    };
};
