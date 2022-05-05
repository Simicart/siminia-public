import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { number, shape, string } from 'prop-types';
import { useProductWidget } from '../../talons/useProductWidget';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './productsWidget.module.css';

const ProductsWidget = props => {
  const { widgetId } = props;
  const { items, loading, error, title } = useProductWidget({ widgetId });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !Array.isArray(items) || !items.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <div className={classes.root}>
      {title && <div className={classes.title}>{title}</div>}
    </div>
  );
};

ProductsWidget.propTypes = {
  widgetId: number.isRequired,
  classes: shape({
    root: string
  })
};

ProductsWidget.defaultProps = {
  widgetId: 1
};

export default ProductsWidget;
