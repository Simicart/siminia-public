import React, { useEffect, useMemo, useState } from 'react';
import { Trash2, User } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
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
import SocialShare from '../../../BaseComponents/SocialShare';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';

const WishlistItem = props => {
    const { item } = props;
    const {
        configurable_options: configurableOptions = [],
        product,
        __typename
    } = item;
    const {
        name,
        price_range: priceRange,
        stock_status: stockStatus
    } = product;
    const { maximum_price: maximumPrice } = priceRange;
    const { final_price: finalPrice } = maximumPrice;
    const { currency, value: unitPrice } = finalPrice;

    const talonProps = useWishlistItem({...props, operations: { createCartMutaion: CREATE_CART_MUTATION }});
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
                    id: 'Something went wrong. Please refresh and try again.',
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
                <div className={classes.option} key={id}>
                    {optionString}
                </div>
            );
        });
    }, [classes.option, configurableOptions]);

    let price = <Price currencyCode={currency} value={unitPrice} />;
    if (__typename === 'MpGiftCardWishlistItem') {
        const { information, min_amount, max_amount, price_rate } = product;
        if (
            information &&
            information.amounts &&
            information.amounts.length > 0
        ) {
            let min_price = (min_amount * price_rate) / 100;
            let max_price = (max_amount * price_rate) / 100;

            let giftCardPrices = [];
            if (
                information &&
                information.amounts &&
                information.amounts.length > 0
            ) {
                information.amounts.map(({ price }) => {
                    giftCardPrices.push(price);
                });
                giftCardPrices.sort((a, b) => {
                    return a - b;
                });
                min_price =
                    min_price > 0 && min_price < giftCardPrices[0]
                        ? min_price
                        : giftCardPrices[0];
                max_price =
                    max_price > 0 &&
                    max_price > giftCardPrices[giftCardPrices.length - 1]
                        ? max_price
                        : giftCardPrices[giftCardPrices.length - 1];
            }

            if (min_price !== max_price) {
                price = (
                    <div className={classes['giftcard-prices-wrapper']}>
                        From:{' '}
                        <span className={classes['giftcard-prices']}>
                            <Price value={min_price} currencyCode={currency} />
                        </span>
                        <br />
                        To:{' '}
                        <span className={classes['giftcard-prices']}>
                            <Price value={max_price} currencyCode={currency} />
                        </span>
                    </div>
                );
            } else {
                price = <Price value={min_price} currencyCode={currency} />;
            }
        }
    }

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
        id: 'Remove Product from wishlist',
        defaultMessage: 'Remove Product from wishlist'
    });

    const rootClass = isRemovalInProgress
        ? classes.root_disabled
        : classes.root;

    const addToCart =
        __typename === 'SimpleWishlistItem' ? (
            <button className={classes.addToCart} {...addToCartButtonProps}>
                {!isMobileSite ? (
                    formatMessage({
                        id: 'wishlistItem.addToCart',
                        defaultMessage: 'Add to Cart'
                    })
                ) : (
                    <FiShoppingCart size={20} />
                )}
            </button>
        ) : (
            <button className={classes.addToCart}>
                {!isMobileSite ? (
                    formatMessage({
                        id: 'wishlistItem.addToCart',
                        defaultMessage: 'Add to Cart'
                    })
                ) : (
                    <Link to={`${product.url_key}${product.url_suffix}`}>
                        <FiShoppingCart size={20} />
                    </Link>
                )}
            </button>
        );
    const successMsg = formatMessage({
        id: 'addCartSuccess',
        defaultMessage: `You added ${product.name} to your shopping cart`
    });
    const [share, setShare] = useState(false);
    const handleShare = () => {
        setShare(!share);
    };
    const handleShareMobile = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: 'My phone',
                    text: 'I shared this content via my mobile',
                    url: `/${product.url_key}${product.url_suffix}`
                })
                .then(() => {})
                .catch(error => {
                    console.error(
                        'Something went wrong sharing the blog',
                        error
                    );
                });
        } else {
        }
    };
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
                {/* {!isMobileSite ? (
                    <div className={classes.close} />
                ) : ( */}
                    <ConfirmPopup
                        trigger={isMobileSite ? <VscTrash size={25} /> : <div className={classes.close} />}
                        content={
                            <FormattedMessage
                                id={'Are you sure about remove this item from wish list?'}
                                defaultMessage={
                                    'Are you sure about remove this item from wish list?'
                                }
                            />
                        }
                        confirmCallback={handleRemoveProductFromWishlist}
                    />
                {/* )} */}
            </button>
            <div className={classes.actionWrap}>
                <span className={classes.name}>{name}</span>{' '}
                <div className={classes.priceContainer}>{price}</div>
                {optionElements}
            </div>
            <div className={classes.wrapSocialShare}>
                {isMobileSite ? (
                    <button
                        onClick={handleShareMobile}
                        className={classes.share}
                    >
                        <BsFillShareFill size={20} />
                    </button>
                ) : (
                    <>
                        <SocialShare
                            product={product}
                            className={classes.socialShare}
                        />
                    </>
                )}
                {addToCart}
            </div>
        </div>
    );
};

export default WishlistItem;
