import React from 'react';
import { FormattedMessage } from 'react-intl';

import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Image from '@magento/venia-ui/lib/components/Image';
import { useStyle } from '@magento/venia-ui/lib/classify';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import { useWindowSize } from '@magento/peregrine';
import Price from '@magento/venia-ui/lib/components/Price';
import defaultClasses from './item.module.css';
import ProductLabel from '../../ProductLabel';
import { WISHLIST_PAGE } from '../../ProductLabel/consts';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options,
        isHidden,
        configurableThumbnailSource,
        prices
    } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root;
    const configured_variant = configuredVariant(configurable_options, product);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 450;

    return (
        <div className={className}>
            <div className={classes.wrapperImage}>
                <Image
                    alt={product.name}
                    classes={{ root: classes.thumbnail }}
                    width={100}
                    resource={
                        configurableThumbnailSource === 'itself' &&
                        configured_variant &&
                        configured_variant.thumbnail &&
                        configured_variant.thumbnail.url
                            ? configured_variant.thumbnail.url
                            : product.thumbnail.url
                    }
                />
                <ProductLabel
                    page={WISHLIST_PAGE}
                    productLabel={product?.product_label}
                />
            </div>

            <span className={classes.name}>{product.name}</span>
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>
                {!isMobile ? (
                    <FormattedMessage
                        id={'checkoutPage.quantity'}
                        defaultMessage={'Qty :'}
                        values={{ quantity }}
                    />
                ) : (
                    `x${quantity}`
                )}
            </span>
            {isMobile && prices && prices.price && (
                <span className={classes.price}>
                    <Price
                        value={prices.price.value}
                        currencyCode={prices.price.currency}
                    />
                </span>
            )}
        </div>
    );
};

export default Item;
