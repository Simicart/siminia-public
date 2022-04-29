import React, { useCallback } from 'react';
import { number, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './productsWidget.module.css';
import Image from '@magento/venia-ui/lib/components/Image';
import { Price } from '@magento/peregrine';
import { Link, useHistory } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import Button from '@magento/venia-ui/lib/components/Button';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import {
  ADD_CONFIGURABLE_MUTATION,
  ADD_SIMPLE_MUTATION
} from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '@magento/venia-ui/lib/queries/getCartDetails.graphql';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
  .set(640, IMAGE_WIDTH)
  .set(UNCONSTRAINED_SIZE_KEY, 840);

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

const Product = props => {
  const { product, showCartBtn } = props;
  const history = useHistory();

  const talonProps = useProductFullDetail({
    addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
    addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
    createCartMutation: CREATE_CART_MUTATION,
    getCartDetailsQuery: GET_CART_DETAILS_QUERY,
    product
  });

  const { handleAddToCart, isAddToCartDisabled } = talonProps;

  const classes = mergeClasses(defaultClasses, props.classes);

  const { name, price, small_image, url_key } = product;
  const productLink = resourceUrl(`/${url_key}${productUrlSuffix}`);
  const isConfigurable = isProductConfigurable(product);

  const addToCart = useCallback(() => {
    if (!isConfigurable) {
      handleAddToCart();
    } else {
      history.push(productLink);
    }
  }, [history, productLink, handleAddToCart, isConfigurable]);

  return (
    <li className={classes.product}>
      <Link to={productLink} className={classes.images}>
        <Image
          alt={name}
          classes={{
            image: classes.image,
            root: classes.imageContainer
          }}
          height={IMAGE_HEIGHT}
          resource={small_image}
          widths={IMAGE_WIDTHS}
        />
      </Link>
      <Link to={productLink} className={classes.name}>
        <span>{name}</span>
      </Link>
      <div className={classes.price}>
        <Price
          value={price.regularPrice.amount.value}
          currencyCode={price.regularPrice.amount.currency}
        />
      </div>

      {showCartBtn && (
        <div className={classes.actions}>
          <Button
            priority="high"
            onClick={addToCart}
            disabled={!isConfigurable && isAddToCartDisabled}
          >
            {'Add to Cart'}
          </Button>
        </div>
      )}
    </li>
  );
};

Product.propTypes = {
  product: shape({
    id: number.isRequired,
    name: string.isRequired,
    small_image: string.isRequired,
    url_key: string.isRequired,
    price: shape({
      regularPrice: shape({
        amount: shape({
          value: number.isRequired,
          currency: string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  })
};

export default Product;
