import { useMemo } from 'react';
import { useAmMegaMenuContext } from '../context';
import { buildTree } from '../utils';

const CATEGORY_IDX = 'category-node-';

export const useAccordionTemplate = () => {
  const { allItems: items, isMobile, config } = useAmMegaMenuContext();
  const { root_category_uid: rootCategoryId } = config;

  const menuTree = useMemo(() => {
    if (!Array.isArray(items) || !items.length) {
      return null;
    }

    const itemList = isMobile
      ? items
      : items.filter(item => item.id.includes(CATEGORY_IDX));

    return buildTree(itemList, rootCategoryId);
  }, [items, isMobile, rootCategoryId]);

  return {
    menuTree
  };
};
