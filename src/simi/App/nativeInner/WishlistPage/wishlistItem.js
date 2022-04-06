import React, { useEffect, useMemo, useState } from 'react';
import { Trash2, User } from 'react-feather';
import {FormattedMessage, useIntl} from 'react-intl';
import { useToasts, useWindowSize } from '@magento/peregrine';
import { useWishlistItem } from '../talons/WishlistPage/useWishlistItem';
import AlertMessages from '../ProductFullDetail/AlertMessages';

import { useStyle } from '@magento/venia-ui/lib/classify.js';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';
import { FiShoppingCart } from 'react-icons/fi';
import { VscTrash } from 'react-icons/vsc';
import { BsFillShareFill } from 'react-icons/bs';
import defaultClasses from './wishlistItem.module.css';
import { Link } from 'react-router-dom';
import { ConfirmPopup } from '../Cart/ConfirmPopup';
import SocialShare from '../../../BaseComponents/SocialShare'
const WishlistItem = props => {
    const { item } = props;
    const { configurable_options: configurableOptions = [], product, __typename } = item;
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
        isSupportedProductType,
        setAlertMsg,
        alertMsg
    } = talonProps;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const windowSize = useWindowSize();
    const isMobileSite = windowSize.innerWidth <= 768;

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

    const addToCart = ( __typename === 'SimpleWishlistItem' ? 
        <button className={classes.addToCart} {...addToCartButtonProps}>
            {!isMobileSite ? (
                formatMessage({
                    id: 'wishlistItem.addToCart',
                    defaultMessage: 'Add to Cart'
                })
            ) : (
                <FiShoppingCart />
            )}
        </button> : <button className={classes.addToCart}>
            {!isMobileSite ? (
                formatMessage({
                    id: 'wishlistItem.addToCart',
                    defaultMessage: 'Add to Cart'
                })
            ) : (
                <Link to={`${product.url_key}${product.url_suffix}`}>
                    <FiShoppingCart />
                </Link>
            )}
        </button>
    );
    const successMsg = formatMessage({
        id: 'addCartSuccess',
        defaultMessage: `You added ${product.name} to your shopping cart`
    })
    const [share,setShare] = useState(false)
    const handleShare = () =>{
        setShare(!share);
    }
    return (
        <div className={rootClass}>
            <AlertMessages
                message={successMsg}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status="success"
            />
            <div className={classes.wrapImage}>
                <Image {...imageProps} />
            </div>
            <button
                className={classes.deleteItem}
                aria-label={removeProductAriaLabel}
            >
                {!isMobileSite ? (
                    <div className={classes.close} />
                ) : (
                    <ConfirmPopup
                            trigger={
                                <VscTrash size={25} />
                            }
                            content={<FormattedMessage
                                id={'Delete Warning'}
                                defaultMessage={'Are you sure about remove\n' +
                                    ' this item from wish list?'}
                            />
                            }
                            confirmCallback={handleRemoveProductFromWishlist}
                        />
                )}
            </button>
            <div className={classes.actionWrap}>
                <span className={classes.name}>{name}</span>{' '}
                <div className={classes.priceContainer}>
                    <Price currencyCode={currency} value={unitPrice} />
                </div>
            </div>
            <div className={classes.wrapSocialShare}>
                {share ? <SocialShare className={classes.socialShare} /> : '' }
                <button onClick={handleShare} className={classes.share}>
                    <BsFillShareFill />
                </button>
            </div>
            
            {optionElements}
            
            {addToCart}
        </div>
    );
};

export default WishlistItem;
