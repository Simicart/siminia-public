import { useEffect, useMemo } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CategoryTree/categoryTree.gql';
import Identify from 'src/simi/Helper/Identify';

/**
 * @typedef {object} CategoryNode
 * @prop {object} category - category data
 * @prop {boolean} isLeaf - true if the category has no children
 */

/**
 * @typedef { import("graphql").DocumentNode } DocumentNode
 */

/**
 * Returns props necessary to render a CategoryTree component.
 *
 * @param {object} props
 * @param {number} props.categoryId - category id for this node
 * @param {DocumentNode} props.query - GraphQL query
 * @param {function} props.updateCategories - bound action creator
 * @return {{ childCategories: Map<number, CategoryNode> }}
 */
export const useCategoryTree = props => {
    const storeConfig = Identify.getStoreConfig();
    const { categoryId, updateCategories } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getNavigationMenuQuery, getCategoryUrlSuffixQuery } = operations;

    const [runQuery, queryResult] = useLazyQuery(getNavigationMenuQuery, {
        fetchPolicy: 'cache-first'
    });
    const { data } = queryResult;

    // const { data: categoryUrlData } = useQuery(getCategoryUrlSuffixQuery, {
    //     fetchPolicy: 'cache-first'
    // });
    const categoryUrlData = storeConfig;

    const categoryUrlSuffix = useMemo(() => {
        if (categoryUrlData) {
            return categoryUrlData.storeConfig.category_url_suffix || '';
        }
    }, [categoryUrlData]);
    // fetch categories
    useEffect(() => {
        if (categoryId != null) {
            runQuery({ variables: { id: categoryId } });
        }
    }, [categoryId, runQuery]);

    // update redux with fetched categories
    useEffect(() => {
        if (data && data.category) {
            updateCategories(data.category);
        }
    }, [data, updateCategories]);

    const rootCategory = data && data.category;

    const { children = [] } = rootCategory || {};

    const childCategories = useMemo(() => {
        const childCategories = new Map();

        // Add the root category when appropriate.
        if (
            rootCategory &&
            rootCategory.include_in_menu &&
            rootCategory.url_path
        ) {
            childCategories.set(rootCategory.id, {
                category: rootCategory,
                isLeaf: true
            });
        }

        children.map(category => {
            if (category.include_in_menu) {
                const isLeaf = !parseInt(category.children_count);
                childCategories.set(category.id, { category, isLeaf });
            }
        });

        return childCategories;
    }, [children, rootCategory]);

    return { childCategories, data, categoryUrlSuffix };
};
