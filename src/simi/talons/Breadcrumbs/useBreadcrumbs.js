import { useMemo} from 'react';
import { useQuery } from '@apollo/client';
import useInternalLink from '@magento/peregrine/lib/hooks/useInternalLink';
import Identify from 'src/simi/Helper/Identify';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Breadcrumbs/breadcrumbs.gql';
// import TitleHelper from "../../Helper/TitleHelper";

// Just incase the data is unsorted, lets sort it.
const sortCrumbs = (a, b) => a.category_level > b.category_level;

// Generates the path for the category.
const getPath = (path, suffix) => {
    if (path) {
        return `/${path}${suffix || ''}`;
    }

    // If there is no path this is just a dead link.
    return '#';
};

/**
 * Returns props necessary to render a Breadcrumbs component.
 *
 * @param {object} props
 * @param {object} props.query - the breadcrumb query
 * @param {string} props.categoryId - the id of the category for which to generate breadcrumbs
 * @return {{
 *   currentCategory: string,
 *   currentCategoryPath: string,
 *   isLoading: boolean,
 *   normalizedData: array,
 *   handleClick: function
 * }}
 */
export const useBreadcrumbs = props => {
    const storeConfig = Identify.getStoreConfig();
    const { categoryId } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getBreadcrumbsQuery, getStoreConfigQuery } = operations;

    const { data, loading, error } = useQuery(getBreadcrumbsQuery, {
        variables: { category_id: categoryId },
        skip: !categoryId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: storeConfigDataOri } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-first',
        skip: storeConfig && storeConfig.storeConfig
    });
    const storeConfigData = storeConfigDataOri || storeConfig;

    const categoryUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.category_url_suffix || '';
        }
    }, [storeConfigData]);

    // When we have breadcrumb data sort and normalize it for easy rendering.
    const normalizedData = useMemo(() => {
        if (!loading && data) {
            const breadcrumbData = data.category.breadcrumbs;

            return (
                breadcrumbData &&
                breadcrumbData
                    .map(category => ({
                        category_level: category.category_level,
                        text: category.category_name,
                        path: getPath(
                            category.category_url_path,
                            categoryUrlSuffix
                        )
                    }))
                    .sort(sortCrumbs)
            );
        }
    }, [categoryUrlSuffix, data, loading]);

    const { setShimmerType } = useInternalLink('category');

    return {
        currentCategory: (data && data.category.name) || '',
        currentCategoryPath:
            (data && `${data.category.url_path}${categoryUrlSuffix || ''}`) ||
            '#',
        isLoading: loading,
        hasError: !!error,
        normalizedData: normalizedData || [],
        handleClick: setShimmerType
    };
};
