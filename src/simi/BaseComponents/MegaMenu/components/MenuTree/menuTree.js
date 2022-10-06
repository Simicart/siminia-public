import React, { useMemo } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, array, bool } from 'prop-types';
import MenuItem from './menuItem';
import defaultClasses from './menuTree.module.css';

const MenuTree = props => {
  const { menuTree, view, classes: propsClasses, ...rest } = props;

  const menu = useMemo(
    () =>
      Array.isArray(menuTree) && menuTree.length
        ? menuTree.map(item => (
            <MenuItem key={item.id} view={view} {...item} {...rest} />
          ))
        : null,
    [menuTree, view, rest]
  );

  if (!menu) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, propsClasses);
  const menuClass = [classes.menu, classes[view]].join(' ');

  return (
    <nav id="menu-tree" className={classes.root} role="navigation">
      <ul className={menuClass}>{menu}</ul>
    </nav>
  );
};

MenuTree.propTypes = {
  loading: bool,
  menuTree: array,
  view: string,
  classes: shape({
    root: string
  })
};

MenuTree.defaultProps = {
  menuTree: [],
  view: 'topMenu'
};

export default MenuTree;
