import React, { useMemo } from 'react';
import defaultClasses from './item.module.css';
import { configColor } from 'src/simi/Config';
import PropTypes from 'prop-types';
import { mergeClasses } from 'src/classify';
import Price from './Price';
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
import { useGridItem } from '../../talons/Category/useGridItem';
import { useHistory } from 'react-router-dom';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import AddToListButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import ProductLabel from '../../App/core/ProductFullDetail/ProductLabel';
// const AddToListButton = React.lazy(() =>
//     import('@magento/venia-ui/lib/components/Wishlist/AddToListButton')
// );
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
        mp_label_data
    } = item;

    const product_url = `/${url_key}${productUrlSuffix()}`;
    // const imageWidth = document.querySelector("#product-image-label").offsetWidth

    //if uncomment this - should comment out useDelayedTransition() at src/simi/app.js
    //saveDataToUrl(product_url, item);

    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item
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


  


    const image = (
        <div
            className={itemClasses['siminia-product-image']}
            style={{
                borderColor: configColor.image_border_color,
                backgroundColor: 'white'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    padding: 1
                }}
                
            >
                <Link to={location}>
                    <Image
                        src={imageUrl}
                        alt={name}
                        fallBackUrl={small_image}
                        className="product-image-label"
                    />
                    <ProductLabel  productLabel = {mp_label_data ? mp_label_data : null} label_tyle="gallery"/>
                </Link>
            </div>
        </div>
    );
    const productOutStock = item.stock_status === 'OUT_OF_STOCK';
    
    
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
                        id={`price-${id}`}
                    >
                        {type_id === 'configurable' && (
                            <div
                                className={itemClasses['configurable-aslowas']}
                            >
                                {formatMessage({ id: 'As low as' })}
                            </div>
                        )}
                        <Price
                            prices={price}
                            type={type_id}
                            classes={itemClasses}
                        />
                    </div>
                </div>
            </div>
            <div
                className={`${itemClasses['product-grid-actions']} ${loading &&
                    itemClasses['action-loading']}`}
            >
                <button
                    className={itemClasses['product-grid-addcartbtn']}
                    onClick={() => {
                        if (!loading && !productOutStock) handleAddCart(item);
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
