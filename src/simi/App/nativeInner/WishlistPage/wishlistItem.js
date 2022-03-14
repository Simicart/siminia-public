import React, { useEffect, useMemo } from 'react';
import { Trash2, User } from 'react-feather';
import { useIntl } from 'react-intl';
import { useToasts, useWindowSize } from '@magento/peregrine';
import { useWishlistItem } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItem';

import { useStyle } from '@magento/venia-ui/lib/classify.js';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';
import { FiShoppingCart } from 'react-icons/fi';
import { VscTrash } from 'react-icons/vsc';
import { BsFillShareFill } from 'react-icons/bs';
import defaultClasses from './wishlistItem.module.css';

const WishlistItem = props => {
    const { item } = props;

    const { configurable_options: configurableOptions = [], product } = item;
    const {
        name,
        price_range: priceRange,
        stock_status: stockStatus
    } = product;

    const { maximum_price: maximumPrice } = priceRange;
    const { final_price: finalPrice } = maximumPrice;
    const { currency, value: unitPrice } = finalPrice;

    const talonProps = useWishlistItem(props);
    const {
        addToCartButtonProps,
        handleRemoveProductFromWishlist,
        hasError,
        isRemovalInProgress,
        isSupportedProductType
    } = talonProps;

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const windowSize = useWindowSize();
    const isMobileSite = windowSize.innerWidth <= 768;
    // console.log("adddd", addToCartButtonProps);

    useEffect(() => {
        if (hasError) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'wishlistItem.addToCartError',
                    defaultMessage:
                        'Something went wrong. Please refresh and try again.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, hasError]);

    const classes = useStyle(defaultClasses, props.classes);

    const optionElements = useMemo(() => {
        return configurableOptions.map(option => {
            const {
                id,
                option_label: optionLabel,
                value_label: valueLabel
            } = option;

            const optionString = `${optionLabel} : ${valueLabel}`;

            return (
                <span className={classes.option} key={id}>
                    {optionString}
                </span>
            );
        });
    }, [classes.option, configurableOptions]);

    const imageProps = {
        classes: {
            image:
                stockStatus === 'OUT_OF_STOCK'
                    ? classes.image_disabled
                    : classes.image
        },
        ...talonProps.imageProps
    };

    const removeProductAriaLabel = formatMessage({
        id: 'wishlistItem.removeAriaLabel',
        defaultMessage: 'Remove Product from wishlist'
    });

    const rootClass = isRemovalInProgress
        ? classes.root_disabled
        : classes.root;

    const addToCart = isSupportedProductType ? (
        <button className={classes.addToCart} {...addToCartButtonProps}>
            {!isMobileSite ? (
                formatMessage({
                    id: 'wishlistItem.addToCart',
                    defaultMessage: 'Add to Cart'
                })
            ) : (
                <FiShoppingCart />
            )}
        </button>
    ) : null;

    return (
        <div className={rootClass}>
            <div className={classes.wrapImage}>
                <Image {...imageProps} />
            </div>
            <button
                className={classes.deleteItem}
                onClick={handleRemoveProductFromWishlist}
                aria-label={removeProductAriaLabel}
            >
                {/* <Icon  size={16} src={User} /> */}
                {!isMobileSite ? (
                    <div className={classes.close} />
                ) : (
                    <VscTrash size={25} />
                )}
            </button>
            <div className={classes.actionWrap}>
                <span className={classes.name}>{name}</span>{' '}
                <div className={classes.priceContainer}>
                    <Price currencyCode={currency} value={unitPrice} />
                </div>
            </div>

            {optionElements}
            <button className={classes.share}>
                <BsFillShareFill />
            </button>
            {addToCart}
        </div>
    );
};

export default WishlistItem;
