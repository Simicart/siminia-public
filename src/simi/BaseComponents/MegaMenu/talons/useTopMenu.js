import { useMemo } from 'react';
import { useAmMegaMenuContext } from '../context';
import { buildTree } from '../utils';

const CATEGORY_IDX = 'category-node-';

export const useTopMenu = () => {
  const {
    allItems: items,
    config,
    isEnabledMegaMenu,
    isMobile
  } = useAmMegaMenuContext() || {};

  const menuTree = useMemo(() => {
    const { ammegamenu_general_hamburger_enabled: isHamburger } = config || {};

    if (!Array.isArray(items) || !items.length) {
      return null;
    }

    const itemList = isHamburger
      ? items.filter(item => !item.id.includes(CATEGORY_IDX))
      : items;

    return buildTree(itemList);
  }, [items, config]);

  const isEnabled = !isMobile && isEnabledMegaMenu;

  return {
    menuTree,
    isEnabled
  };
};
