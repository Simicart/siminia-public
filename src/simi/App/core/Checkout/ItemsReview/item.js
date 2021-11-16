import React from 'react';

import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Image from '@magento/venia-ui/lib/components/Image';
import { mergeClasses } from 'src/classify';
import { HOPrice as Price } from 'src/simi/Helper/Pricing';
import Identify from 'src/simi/Helper/Identify';

import defaultClasses from './item.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options,
        isHidden,
        prices
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root;
    return (
        <div className={className}>
            <Image
                alt={product.name}
                classes={{ root: classes.thumbnail }}
                width={110}
                resource={product.thumbnail.url}
            />
            <span className={classes.name}>
                <span className={classes.item_name_string}>
                    {product.name}
                </span>
                <span className={classes.quantity}>{Identify.__('x%s').replace('%s', quantity)}</span>
            </span>
            {
                !!(prices && prices.price && prices.price.value) && (
                    <div className={classes.item_price}>
                        <Price value={prices.price.value} />
                    </div>
                )
            }
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
        </div>
    );
};

export default Item;
