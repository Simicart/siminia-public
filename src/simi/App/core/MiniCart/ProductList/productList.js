import React, { useMemo } from 'react';
import { string, func, arrayOf, shape, number, oneOf } from 'prop-types';

import Item from './item';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './productList.module.css';

const ProductList = props => {
    const {
        items,
        handleRemoveItem,
        classes: propClasses,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix
    } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const cartItems = useMemo(() => {
        if (items) {
            return items.map(item => (
                <Item
                    item={item}
                    key={item.id}
                    {...item}
                    closeMiniCart={closeMiniCart}
                    handleRemoveItem={handleRemoveItem}
                    configurableThumbnailSource={configurableThumbnailSource}
                    storeUrlSuffix={storeUrlSuffix}
                />
            ));
        }
    }, [
        items,
        handleRemoveItem,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix
    ]);

    return <div className={classes.root}>{cartItems}</div>;
};

export default ProductList;

ProductList.propTypes = {
    classes: shape({ root: string }),
    items: arrayOf(
        shape({
            product: shape({
                name: string,
                thumbnail: shape({
                    url: string
                })
            }),
            id: string,
            quantity: number,
            configurable_options: arrayOf(
                shape({
                    label: string,
                    value: string
                })
            ),
            prices: shape({
                price: shape({
                    value: number,
                    currency: string
                })
            }),
            configured_variant: shape({
                thumbnail: shape({
                    url: string
                })
            })
        })
    ),
    configurableThumbnailSource: oneOf(['parent', 'itself']),
    handleRemoveItem: func
};
