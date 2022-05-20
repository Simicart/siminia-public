import React, { useMemo } from 'react';
import defaultClasses from './item.module.css';
import { configColor } from 'src/simi/Config';
import PropTypes from 'prop-types';
import { mergeClasses } from 'src/classify';
import Price from './Price';
import { Price as CorePrice } from '@magento/peregrine';
import { prepareProduct } from 'src/simi/Helper/Product';
import { Link } from 'src/drivers';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import Image from 'src/simi/BaseComponents/Image';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import Identify from 'src/simi/Helper/Identify';
import { Heart } from 'react-feather';
import {
    productUrlSuffix,
    saveDataToUrl,
    resourceUrl,
    logoUrl
} from 'src/simi/Helper/Url';
import { useIntl } from 'react-intl';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { useGridItem } from '../../../talons/Category/useGridItem';
import { useHistory } from 'react-router-dom';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import AddToListButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import ProductLabel from '../../../App/core/ProductFullDetail/ProductLabel';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import CallForPrice from '../ProductFullDetail/callForPrice';

const HeartIcon = <Icon size={20} src={Heart} />;

const Griditem = props => {
    const { lazyImage } = props;
    const { formatMessage } = useIntl();
    const item = prepareProduct(props.item);
    const logo_url = logoUrl();
    const { classes, styles = {} } = props;
    const history = useHistory();
    const [{ cartId }] = useCartContext();
    const handleLink = linkInput => {
        history.push(linkInput);
    };
    const [{ isSignedIn }] = useUserContext();

    const itemClasses = mergeClasses(defaultClasses, classes);
    const {
        name,
        url_key,
        id,
        price,
        type_id,
        small_image,
        rating_summary,
        review_count,
        mp_label_data,
        price_rate,
        allow_amount_range,
        gift_card_amounts,
        __typename
    } = item;

    const callForPriceRule = item.mp_callforprice_rule;

    const product_url = `/${url_key}${productUrlSuffix()}`;
    // const imageWidth = document.querySelector("#product-image-label").offsetWidth

    //if uncomment this - should comment out useDelayedTransition() at src/simi/app.js
    //saveDataToUrl(product_url, item);

    let priceComponent = (
        <Price prices={price} type={type_id} classes={itemClasses} />
    );
    if (__typename === 'MpGiftCardProduct') {
        let min_price = (item.min_amount * price_rate) / 100;
        let max_price = (item.max_amount * price_rate) / 100;

        let giftCardPrices = [];
        if (!allow_amount_range && gift_card_amounts) {
            JSON.parse(gift_card_amounts).map(({ price }) => {
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

        if (min_price != max_price) {
            priceComponent = (
                <div className={itemClasses['giftcard-prices-wrapper']}>
                    From:{' '}
                    <span className={itemClasses['giftcard-prices']}>
                        <CorePrice
                            value={min_price}
                            currencyCode={price.regularPrice.amount.currency}
                        />
                    </span>
                    <br />
                    To:{' '}
                    <span className={itemClasses['giftcard-prices']}>
                        <CorePrice
                            value={max_price}
                            currencyCode={price.regularPrice.amount.currency}
                        />
                    </span>
                </div>
            );
        } else {
            priceComponent = (
                <div className={itemClasses['giftcard-prices-wrapper']}>
                    <span className={itemClasses['giftcard-prices']}>
                        <CorePrice
                            value={min_price}
                            currencyCode={price.regularPrice.amount.currency}
                        />
                    </span>
                </div>
            );
        }
    }

    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item,
            callForPriceRule: callForPriceRule
        }
    };
    const { handleAddCart, handleAddCompare, loading, isPhone } = useGridItem({
        location,
        handleLink,
        cartId
    });

    let imageUrl = small_image;
    //comment out this line when server got issue decoding images
    imageUrl = resourceUrl(imageUrl, { type: 'image-product', width: 260 });

    const productOutStock = item.stock_status === 'OUT_OF_STOCK';

    const image = (
        <div
            className={itemClasses['siminia-product-image']}
            style={{
                borderColor: configColor.image_border_color
                // backgroundColor: 'white'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '100%'
                    // padding: 1
                }}
            >
                <Link to={location}>
                    <Image
                        src={imageUrl}
                        alt={name}
                        fallBackUrl={small_image}
                        className="product-image-label"
                    />
                    <ProductLabel
                        productLabel={mp_label_data ? mp_label_data : null}
                        label_tyle="gallery"
                    />
                </Link>
                {productOutStock ? (
                    <div className={itemClasses.soldOut}>
                        {formatMessage({
                            id: 'soldOut',
                            defaultMessage: 'Sold Out'
                        })}
                    </div>
                ) : (
                    ''
                )}

                {item.price && item.price.has_special_price ? (
                    <div
                        className={itemClasses.discountBadge}
                        style={Identify.isRtl() ? { right: 8 } : { left: 8 }}
                    >
                        {`-${item.price.discount_percent}%`}
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );

    return (
        <div
            className={` ${
                itemClasses['siminia-product-grid-item']
            } siminia-product-grid-item ${productOutStock &&
                itemClasses['item-outstock']}`}
            style={styles['siminia-product-grid-item']}
        >
            {lazyImage ? (
                <LazyLoad
                    placeholder={
                        <img
                            alt={name}
                            src={logo_url}
                            style={{ maxWidth: 60, maxHeight: 60 }}
                        />
                    }
                >
                    {image}
                </LazyLoad>
            ) : (
                image
            )}
            <div className={itemClasses['siminia-product-des']}>
                {review_count ? (
                    <div className={itemClasses['item-review-rate']}>
                        <StaticRate
                            rate={rating_summary}
                            classes={itemClasses}
                        />
                        <span className={itemClasses['item-review-count']}>
                            ({review_count}{' '}
                            {review_count
                                ? formatMessage({ id: 'Reviews' })
                                : formatMessage({ id: 'Review' })}
                            )
                        </span>
                    </div>
                ) : (
                    ''
                )}
                <div
                    role="presentation"
                    className={`${itemClasses['product-name']} ${
                        itemClasses['small']
                    }`}
                    onClick={() => handleLink(location)}
                    dangerouslySetInnerHTML={{ __html: name }}
                />
                <div className={`${itemClasses['price-each-product']}`}>
                    <div
                        role="presentation"
                        className={`${itemClasses['prices-layout']} ${
                            Identify.isRtl()
                                ? itemClasses['prices-layout-rtl']
                                : ''
                        }`}
                        style={{
                            flexWrap:
                                type_id === 'configurable' ? 'wrap' : 'nowrap'
                        }}
                        id={`price-${id}`}
                    >
                        {type_id === 'configurable' && (
                            <div
                                className={itemClasses['configurable-aslowas']}
                            >
                                {formatMessage({ id: 'As low as' })}
                            </div>
                        )}
                        <CallForPrice
                            data={callForPriceRule}
                            wrapperPrice={priceComponent}
                            item_id={item.id}
                        />
                    </div>
                </div>

                {/* <div className={itemClasses['sold']}>
                        {formatMessage({ id: 'sold',defaultMessage:'123 sold' })}
                </div> */}
            </div>
            <div
                className={`${itemClasses['product-grid-actions']} ${loading &&
                    itemClasses['action-loading']}`}
            >
                {callForPriceRule?.action !== 'hide_add_to_cart' ? (
                    <button
                        className={itemClasses['product-grid-addcartbtn']}
                        onClick={() => {
                            if (!loading && !productOutStock)
                                handleAddCart(item);
                        }}
                    >
                        {formatMessage({
                            id: productOutStock
                                ? 'Out of stock'
                                : loading
                                ? 'Adding'
                                : 'Add To Cart'
                        })}
                    </button>
                ) : null}
                <div className={itemClasses['product-grid-wishlistbtn']}>
                    <AddToListButton
                        icon={HeartIcon}
                        item={{
                            quantity: 1,
                            sku: item.sku
                        }}
                        classes={{
                            root: itemClasses['wlbtnroot'],
                            root_selected: itemClasses['wlbtnselected']
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

Griditem.contextTypes = {
    item: PropTypes.object,
    classes: PropTypes.object,
    lazyImage: PropTypes.bool
};

export default Griditem;
