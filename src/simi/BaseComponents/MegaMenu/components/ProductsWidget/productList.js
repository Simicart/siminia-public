import React, { useMemo } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { bool, number, shape, string } from 'prop-types';
import SlickSlider from 'react-slick';
import Product from './product';
import defaultClasses from './productsWidget.module.css';

const ProductList = props => {
  const { items, layout, slidesToShow, autoplay, showCartBtn } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const products = useMemo(
    () =>
      items.map(item => (
        <Product key={item.id} product={item} showCartBtn={showCartBtn} />
      )),
    [items, showCartBtn]
  );

  const carouselSettings = useMemo(() => {
    return {
      dots: false,
      infinite: false,
      arrows: true,
      slidesToShow,
      slidesToScroll: 1,
      autoplay
    };
  }, [autoplay, slidesToShow]);

  if (layout === 'slider') {
    return (
      <div className={classes.carousel}>
        <SlickSlider {...carouselSettings}>{products}</SlickSlider>
      </div>
    );
  }

  return <div className={classes.grid}>{products}</div>;
};

ProductList.propTypes = {
  slidesToShow: number,
  autoplay: bool,
  layout: string,
  showCartBtn: bool,
  classes: shape({
    root: string
  })
};

ProductList.defaultProps = {
  slidesToShow: 3,
  autoplay: false,
  layout: 'slider',
  showCartBtn: false
};

export default ProductList;
