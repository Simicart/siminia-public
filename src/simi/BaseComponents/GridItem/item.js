import React, { useMemo } from 'react';
import defaultClasses from './item.css';
import { configColor } from 'src/simi/Config';
import PropTypes from 'prop-types';
import ReactHTMLParse from 'react-html-parser';
import { mergeClasses } from 'src/classify';
import { HOPrice } from 'src/simi/Helper/Pricing';
import Price from 'src/simi/BaseComponents/Price';
import { prepareProduct } from 'src/simi/Helper/Product';
import { Link } from 'src/drivers';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import Image from 'src/simi/BaseComponents/Image';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import Identify from 'src/simi/Helper/Identify';
import {
    productUrlSuffix,
    saveDataToUrl,
    resourceUrl,
    logoUrl
} from 'src/simi/Helper/Url';

const Griditem = props => {
    const { lazyImage } = props;
    const item = prepareProduct(props.item);
    const logo_url = logoUrl();
    const { classes } = props;
    if (!item) return '';
    const itemClasses = mergeClasses(defaultClasses, classes);
    const {
        name,
        url_key,
        id,
        price,
        type_id,
        small_image,
        rating_summary,
        review_count
    } = item;
    const product_url = `/${url_key}${productUrlSuffix()}`;

    saveDataToUrl(product_url, item);

    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item
        }
    };
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
                    />
                </Link>
            </div>
        </div>
    );

    return (
        <div
            className={`${itemClasses['product-item']} ${
                itemClasses['siminia-product-grid-item']
            } siminia-product-grid-item`}
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
                                ? Identify.__('Reviews')
                                : Identify.__('Review')}
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
                    onClick={() => props.handleLink(location)}
                >
                    {ReactHTMLParse(name)}
                </div>

                <div className={`${itemClasses['price-each-product']}`}>
                    <div
                        role="presentation"
                        className={`${itemClasses['prices-layout']} ${
                            Identify.isRtl()
                                ? itemClasses['prices-layout-rtl']
                                : ''
                        }`}
                        id={`price-${id}`}
                        onClick={() => props.handleLink(location)}
                    >
                        {type_id === 'configurable' && (
                            <div
                                className={itemClasses['configurable-aslowas']}
                            >
                                {Identify.__('As low as')}
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
        </div>
    );
};

Griditem.contextTypes = {
    item: PropTypes.object,
    handleLink: PropTypes.func,
    classes: PropTypes.object,
    lazyImage: PropTypes.bool
};

export default Griditem;
