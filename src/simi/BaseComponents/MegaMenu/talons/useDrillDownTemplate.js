import { useAmMegaMenuContext } from '../context';
import { useEffect, useMemo } from 'react';
import { buildTree, mapItems } from '../utils';
import { useLazyQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CategoryTree/categoryTree.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useDrillDownTemplate = props => {
  const { categoryId, updateCategories } = props;
  const { allItems, config, isShowIcons } = useAmMegaMenuContext();

  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { getNavigationMenuQuery } = operations;

  const [runQuery, queryResult] = useLazyQuery(getNavigationMenuQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });
  const { data } = queryResult;

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

  const { root_category_id: rootCategoryId } = config;
  const isTopLevel = categoryId === rootCategoryId;

  const categories = useMemo(() => {
    if (!Array.isArray(allItems)) {
      return null;
    }

    const tree = buildTree(mapItems(allItems), true);

    if (isTopLevel) {
      return [...tree.values()].filter(({ parent_id }) => !parent_id);
    }

    const category = tree.get(categoryId);
    const { subCategories, name } = category;

    return [
      { ...category, name: `All ${name}`, subCategories: null },
      ...subCategories
    ];
  }, [allItems, categoryId, isTopLevel]);

  return {
    categories,
    isShowIcons,
    isTopLevel
  };
};
