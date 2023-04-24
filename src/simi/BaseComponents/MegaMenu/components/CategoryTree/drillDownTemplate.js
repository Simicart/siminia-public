import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { func, shape, string } from 'prop-types';
import { useDrillDownTemplate } from '../../talons/useDrillDownTemplate';
import { isEnableMenuItem } from '../../utils';
import defaultClasses from './drillDownTemplate.module.css';
import MenuLink from '../MenuTree/menuLink';

const DrillDownTemplate = props => {
  const { categoryId, onNavigate, setCategoryId, updateCategories } = props;

  const { categories, isShowIcons, isTopLevel } = useDrillDownTemplate({
    categoryId,
    updateCategories
  });
  const classes = mergeClasses(defaultClasses, props.classes);

  if (!categories) {
    return null;
  }

  const tree = categories.map(cat => {
    if (!isEnableMenuItem(cat.status, true)) {
      return null;
    }

    return (
      <li className={classes.item} key={cat.id}>
        <MenuLink
          view={'hamburger'}
          {...cat}
          onNavigate={onNavigate}
          toggleAction={setCategoryId}
          isShowIcons={isShowIcons}
          classes={{ toggle: classes.toggle, menuLink: classes.menuLink }}
          level={isTopLevel ? 1 : 2}
        />
      </li>
    );
  });

  return (
    <nav className={classes.root}>
      <ul className={classes.tree}>{tree}</ul>
    </nav>
  );
};

DrillDownTemplate.propTypes = {
  categoryId: string.isRequired,
  onNavigate: func.isRequired,
  setCategoryId: func.isRequired,
  updateCategories: func.isRequired,
  classes: shape({
    root: string
  })
};

export default DrillDownTemplate;
