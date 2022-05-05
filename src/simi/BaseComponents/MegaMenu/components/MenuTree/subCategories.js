import React, { useMemo } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { number, shape, string, array } from 'prop-types';
import MenuItem from './menuItem';

import defaultClasses from './subCategories.module.css';

const SubCategories = props => {
  const { items, level, column_count, view } = props;
  const subCategories = useMemo(() => {
    if (!Array.isArray(items) || !items.length) {
      return null;
    }

    return items.map(item => (
      <MenuItem key={item.id} {...item} view={view} level={level + 1} />
    ));
  }, [items, level, view]);

  if (!subCategories) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);
  const levelClass = classes[`level${level}`];
  const rootClass = [classes.root, levelClass, classes[view]].join(' ');

  return (
    <ul
      className={rootClass}
      style={{ '--am-mega-menu-columns-count': column_count || 4 }}
    >
      {subCategories}
    </ul>
  );
};

SubCategories.propTypes = {
  level: number,
  items: array,
  column_count: number,
  classes: shape({
    root: string
  })
};

SubCategories.defaultProps = {
  level: 0,
  items: [],
  column_count: 4
};

export default SubCategories;
