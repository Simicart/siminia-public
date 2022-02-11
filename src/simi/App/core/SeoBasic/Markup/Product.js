import React from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { productUrlSuffix } from 'src/simi/Helper/Url';

/* 
props: {
    product: {},
    reviews: [{}]
}
*/
const Product = props => {
    const { product, reviews, price: replacePrice } = props;

    let dataStructure = window.productDataStructure; // Init data

    // Remove old structure
    const existedTag = document.getElementById('simi-product-details-stdata');
    if (existedTag) {
        existedTag.parentNode.removeChild(existedTag);
    }
    // Create script element
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('id', 'simi-product-details-stdata');

    const urlSuffix = productUrlSuffix();
    const urlBase = window.location.origin;

    let productUrl = '';
    let productName = '';
    let productDesc = '';
    let productImage = urlBase + '/static/logo.png';
    let productPriceAmount = '';

    // Product data
    if (product && product instanceof Object) {
        const {
            sku,
            name,
            price: originPrice,
            description,
            short_description,
            media_gallery,
            small_image,
            variants,
            rating_summary,
            review_count,
            url_key,
            type_id
        } = product || {};

        const price = replacePrice || originPrice; // allow price from props

        const images =
            media_gallery &&
            media_gallery.map(img => {
                if (img.url) {
                    return img.url;
                }
                return '';
            });

        productImage = (images && images[0]) || small_image || '';

        // check without rating
        if (
            (rating_summary &&
                rating_summary !== undefined &&
                parseInt(rating_summary) <= 0) ||
            price === 0
        ) {
            window.disabledProductDataStructure = true;
            return;
        }

        const { minimalPrice, regularPrice } = price || {};
        const productPrice = minimalPrice || regularPrice || {};

        if (short_description.html.length > 0) {
            productDesc = short_description || { html: '' };
            productDesc = productDesc.html.replace(/(<([^>]+)>)/gi, '');
        } else {
            productDesc = description;
            productDesc = productDesc.replace(/(<([^>]+)>)/gi, '');
        }
        productUrl = (url_key && urlBase + '/' + url_key + urlSuffix) || '';
        productName = name;

        productPriceAmount = productPrice.amount && productPrice.amount.value;

        dataStructure = {
            ...dataStructure,
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: name,
            image: images,
            description: productDesc,
            sku: sku,
            offers: {
                '@type': 'Offer',
                url: productUrl,
                priceCurrency:
                    (productPrice.amount && productPrice.amount.currency) ||
                    'USD',
                price: productPriceAmount || '',
                availability: 'InStock',
                seller: {
                    '@type': 'Organization'
                    // name: seller_name || ''
                }
            }
        };

        if (
            rating_summary &&
            rating_summary !== undefined &&
            parseInt(rating_summary) > 0
        ) {
            dataStructure = {
                ...dataStructure,
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: review_count,
                    bestRating: 100,
                    ratingCount: review_count
                }
            };
        }

        // window.productDataStructure = dataStructure; // save data to env
        // script.innerHTML = JSON.stringify(dataStructure);
        // document.head.appendChild(script);
    }

    // Reviews data
    if (
        window.disabledProductDataStructure !== true &&
        reviews &&
        reviews instanceof Array
    ) {
        let _reviews = reviews.map(item => {
            return {
                '@type': 'Review',
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: parseInt(item.avg_value)
                },
                author: {
                    '@type': 'Person',
                    name: item.nickname
                },
                reviewBody: item.detail
            };
        });
        if (_reviews.length) {
            dataStructure = {
                ...dataStructure,
                review: _reviews
            };
        }
    }

    window.productDataStructure = dataStructure; // save data to env
    script.innerHTML = JSON.stringify(dataStructure);
    document.head.appendChild(script);

    // Add <html prefix= "og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# product: http://ogp.me/ns/product#">

    var htmlTag = document.querySelectorAll('html')[0];
    htmlTag.setAttribute(
        'prefix',
        'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# product: http://ogp.me/ns/product#'
    );

    if (product && product instanceof Object) {
        // Crop by config
        let description_crop = productDesc || '';

        let meta_title_crop = productName || '';

        return (
            <>
                <Helmet>
                    <meta property="og:type" content="og:product" />
                    <meta name="twitter:card" content="summary" />
                    <meta property="og:title" content={meta_title_crop} />
                    <meta property="og:image" content={productImage} />
                    <meta
                        property="og:description"
                        content={description_crop}
                    />
                    <meta property="og:url" content={productUrl} />
                    <meta
                        property="product:price:amount"
                        content={productPriceAmount}
                    />
                    <meta property="product:price:currency" content={'USD'} />
                </Helmet>
            </>
        );
    }
    return null;
};

export default compose(withRouter)(Product);
