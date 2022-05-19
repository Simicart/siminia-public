import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, number } from 'prop-types';

import defaultClasses from './withContent.module.css';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import MenuLink from '../menuLink';
import { useSubMenuContent } from '../../../talons/useSubmenuContent';

const positions = {
  0: 'hideCategories',
  1: 'left',
  2: 'top'
};

const WithContent = props => {
  const {
    subCategories,
    level,
    content,
    id,
    subcategories_position,
    isShowIcons,
    elementRef,
    elementStyle
  } = props;

  const { onHover, activeId } = useSubMenuContent({ id });

  const classes = mergeClasses(defaultClasses, props.classes);
  const isShowSubCategories =
    Array.isArray(subCategories) &&
    subCategories.length &&
    subcategories_position !== 0;

  const links = isShowSubCategories
    ? subCategories.map(item => (
        <li
          key={item.id}
          onMouseOver={() => onHover(item.id)}
          onFocus={() => void 0}
          className={classes.categoriesItem}
        >
          <MenuLink {...item} isShowIcons={isShowIcons} />
        </li>
      ))
    : null;

  const itemContent = content ? (
    <div
      className={classes.block}
      style={{ display: id === activeId ? 'block' : 'none' }}
    >
      <RichContent html={content} hideCategories />
    </div>
  ) : null;

  const subContent =
    subCategories && subCategories.length
      ? subCategories.map(item => {
          if (item.subcategories_position === 0 && !item.content) {
            return null;
          }

          return (
            <div
              key={item.id}
              className={classes.blockChild}
              style={{ display: item.id === activeId ? 'block' : 'none' }}
            >
              <WithContent
                level={level + 1}
                {...item}
                isShowIcons={isShowIcons}
              />
            </div>
          );
        })
      : null;

  if (!itemContent && !subContent) {
    return null;
  }

  const fullClass = [
    classes.root,
    level === 1 ? classes.main : classes.child
  ].join(' ');

  const positionClass = positions[subcategories_position];

  return (
    <div
      style={elementStyle}
      ref={elementRef}
      className={fullClass}
      onMouseLeave={() => onHover(id)}
    >
      <div className={[classes.container, classes[positionClass]].join(' ')}>
        {links && <ul className={classes.categories}>{links}</ul>}

        <div className={classes.sidebar}>
          {itemContent}
          {subContent}
        </div>
      </div>
    </div>
  );
};

WithContent.propTypes = {
  subcategories_position: number,
  content: string,
  id: string,
  level: number,
  classes: shape({
    root: string
  })
};

WithContent.defaultProps = {
  subcategories_position: 1,
  level: 1
};

export default WithContent;
