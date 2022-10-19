import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './withoutContent.module.css';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import SubCategories from '../subCategories';

const WithoutContent = props => {
  const {
    subCategories,
    level,
    column_count,
    content,
    view,
    isMobile,
    elementRef,
    elementStyle
  } = props;

  const classes = mergeClasses(defaultClasses, props.classes);

  const subCategoriesMenu =
    subCategories && (isMobile || !content || level > 1) ? (
      <SubCategories
        items={subCategories}
        level={level}
        column_count={column_count}
        view={view}
      />
    ) : null;

  const itemContent =
    !isMobile && content && level === 1 ? (
      <RichContent
        html={content}
        classes={{ extendRoot: classes.richContent }}
        level={level}
        items={subCategories}
        column_count={column_count}
        view={view}
      />
    ) : null;

  const fullClass = [
    classes.root,
    level === 1 ? classes.main : classes.child,
    classes[`level${level}`],
    classes[view]
  ].join(' ');

  return (
    <div className={fullClass} ref={elementRef} style={elementStyle}>
      {subCategoriesMenu}
      {itemContent}
    </div>
  );
};

WithoutContent.propTypes = {
  classes: shape({
    root: string
  })
};

WithoutContent.defaultProps = {
  width: 0
};

export default WithoutContent;
