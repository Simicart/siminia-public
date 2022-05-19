import React from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { resourceUrl, productUrlSuffix } from 'src/simi/Helper/Url';
import { useStoreConfigData } from '../talons/useStoreConfigData';

/* 
props: {
    product: {},
    reviews: [{}]
}
*/
const Product = props => {
    const {
        storeConfigData,
        storeConfigLoading,
        derivedErrorMessage
    } = useStoreConfigData();
    if (storeConfigLoading) return '';
    if (derivedErrorMessage) return '';

    const { currency } = storeConfigData;

    const mageworx_seo =
        storeConfigData && storeConfigData.storeConfig
            ? storeConfigData.storeConfig.mageworx_seo
            : '';

    let seo;
    try {
        seo = JSON.parse(mageworx_seo);
    } catch {}

    const { default_display_currency_code } = currency;

    const { markup, xtemplates } = seo || {};
    const productConfig = (markup && markup.product) || {};

    const {
        crop_meta_title,
        max_title_length,
        crop_meta_description,
        max_description_length
    } = xtemplates || {};

    const { name: seller_name } =
        (seo && seo.markup && seo.markup.seller) || {};
    const {
        is_specific_product, //without offers and rating
        rs_enabled,
        og_enabled,
        tw_enabled,
        tw_username,
        best_rating,
        add_reviews,
        use_multiple_offer,
        crop_html_in_description,
        sku_enabled,
        sku_code,
        category_enabled,
        category_deepest,
        color_enabled,
        color_code,
        manufacturer_enabled,
        manufacturer_code,
        brand_enabled,
        brand_code,
        model_enabled,
        model_code,
        gtin_enabled,
        gtin_code,
        weight_enabled,
        special_price_functionality,
        price_valid_until_default_value,
        condition_enabled,
        condition_code,
        condition_value_new,
        condition_value_used,
        condition_value_damaged,
        condition_value_refurbished,
        condition_value_default
    } = productConfig || {};

    const { product, reviews, price: replacePrice, avg_rating } = props;

    const { mageworx_canonical_url } = product || {};

    const { extraData } = mageworx_canonical_url || {};

    let extData;
    try {
        extData = JSON.parse(extraData);
    } catch {}

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
    if (rs_enabled && product && product instanceof Object) {
        const {
            sku,
            name,
            price: originPrice,
            description,
            short_description,
            media_gallery,
            small_image,
            simiExtraField,
            variants,
            rating_summary,
            review_count,
            url_key,
            weight,
            categories,
            type_id,
            mpbrand
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

        const { pre_order, is_salable } = extData || {};

        // check without rating
        if (
            !is_specific_product &&
            ((rating_summary &&
                rating_summary !== undefined &&
                parseInt(rating_summary) <= 0) ||
                price === 0)
        ) {
            window.disabledProductDataStructure = true;
            return;
        }

        // const category_ids = categories && categories.map(({id}) => id) || [];

        const { minimalPrice, regularPrice } = price || {};
        const productPrice = minimalPrice || regularPrice || {};

        if (short_description.html.length > 0) {
            productDesc = short_description || { html: '' };
            productDesc = crop_html_in_description
                ? productDesc.html.replace(/(<([^>]+)>)/gi, '')
                : productDesc.html;
        } else {
            productDesc = description;
            productDesc = crop_html_in_description
                ? productDesc.replace(/(<([^>]+)>)/gi, '')
                : productDesc;
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
                availability:
                    parseInt(pre_order) === 1 && !is_salable
                        ? 'PreOrder'
                        : !is_salable
                        ? 'OutOfStock'
                        : 'InStock',
                seller: {
                    '@type': 'Organization',
                    name: seller_name || ''
                }
            }
        };

        let itemCondition = '';
        if (condition_enabled) {
            const conditionMarkupMatch = {
                condition_value_new: 'https://schema.org/NewCondition',
                condition_value_used: 'https://schema.org/UsedCondition',
                condition_value_damaged: 'https://schema.org/DamagedCondition',
                condition_value_refurbished:
                    'https://schema.org/RefurbishedCondition'
            };
            switch (condition_code) {
                case condition_value_new:
                    itemCondition = conditionMarkupMatch['condition_value_new'];
                    break;
                case condition_value_used:
                    itemCondition =
                        conditionMarkupMatch['condition_value_used'];
                    break;
                case condition_value_damaged:
                    itemCondition =
                        conditionMarkupMatch['condition_value_damaged'];
                    break;
                case condition_value_refurbished:
                    itemCondition =
                        conditionMarkupMatch['condition_value_refurbished'];
                    break;
                default:
                    itemCondition =
                        'https://schema.org/' + condition_value_default;
            }
            /* dataStructure = {
                ...dataStructure,
                "offers": {
                    ...(dataStructure.offers || {}),
                    "itemCondition": itemCondition
                }
            } */
        }

        if (use_multiple_offer && type_id === 'configurable') {
            let offers = (dataStructure.offers && [dataStructure.offers]) || [];
            if (variants && variants.length) {
                variants.map(variant => {
                    const {
                        stock_status,
                        simple_warehouses,
                        url_key: offerUrlKey,
                        price: offerPrice
                    } = variant.product || {};
                    const isOfferInstock =
                        simple_warehouses &&
                        !simple_warehouses.every(
                            ({ stock_quantity }) => stock_quantity < 0
                        );
                    let _offer = {
                        '@type': 'Offer',
                        url:
                            (offerUrlKey &&
                                urlBase + '/' + offerUrlKey + urlSuffix) ||
                            productUrl,
                        priceCurrency:
                            offerPrice.regularPrice.amount.currency || 'USD',
                        price: offerPrice.regularPrice.amount.value || '',
                        availability:
                            isOfferInstock || stock_status || 'OutOfStock',
                        seller: {
                            '@type': 'Organization',
                            name: seller_name || ''
                        }
                    };
                    if (itemCondition) {
                        _offer.itemCondition = itemCondition;
                    }
                    if (special_price_functionality) {
                        _offer.priceValidUntil = price_valid_until_default_value;
                    }
                    offers.push(_offer);
                });
            }
            dataStructure = {
                ...dataStructure,
                offers: offers
            };
        } else {
            if (itemCondition) {
                dataStructure = {
                    ...dataStructure,
                    offers: {
                        ...(dataStructure.offers || {}),
                        itemCondition: itemCondition
                    }
                };
            }
            if (special_price_functionality) {
                dataStructure = {
                    ...dataStructure,
                    offers: {
                        ...(dataStructure.offers || {}),
                        priceValidUntil: price_valid_until_default_value
                    }
                };
            }
        }

        const getCategory = (categores, id) => {
            let cateFound = {};
            categores.every(cate => {
                if (cate.id === id) {
                    cateFound = cate;
                    return false;
                }
                if (cate.children && cate.children.length) {
                    cateFound = getCategory(cate.children, id);
                }
                return true;
            });
            return cateFound;
        };

        // if (category_enabled) {
        //     let categoryId = category_ids[0];
        //     let category = {};
        //     if (category_deepest || true) {
        //         categoryId = category_ids.pop();
        //     }
        //     if (simiRootCate.id === parseInt(categoryId)) {
        //         category = simiRootCate;
        //     } else {
        //         category = getCategory(simiRootCate.children, parseInt(categoryId));
        //     }
        //     dataStructure = {
        //         ...dataStructure,
        //         "category": category.name || '',
        //     }
        // }

        if (color_enabled) {
            if (extData[color_code]) {
                dataStructure = {
                    ...dataStructure,
                    color: 'extData[color_code]'
                };
            }
        }

        if (manufacturer_enabled) {
            if (extData[manufacturer_code]) {
                dataStructure = {
                    ...dataStructure,
                    manufacturer: extData[manufacturer_code]
                };
            }
        }

        if (weight_enabled) {
            dataStructure = {
                ...dataStructure,
                weight: weight
            };
        }

        if (gtin_enabled) {
            if (extData[gtin_code]) {
                dataStructure = {
                    ...dataStructure,
                    gtin14: extData[gtin_code]
                };
            }
        }

        if (brand_enabled) {
            if (extData[brand_code] || (mpbrand && mpbrand.value)) {
                dataStructure = {
                    ...dataStructure,
                    brand: {
                        '@type': 'Brand',
                        name: (mpbrand && mpbrand.value) || extData[brand_code]
                    }
                };
            }
        }

        if (model_enabled) {
            if (extData[model_code]) {
                dataStructure = {
                    ...dataStructure,
                    model: extData[model_code]
                };
            }
        }

        if (
            rating_summary &&
            rating_summary !== undefined &&
            parseInt(rating_summary) > 0
        ) {
            dataStructure = {
                ...dataStructure,
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: avg_rating,
                    bestRating: best_rating || 5,
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
        rs_enabled &&
        window.disabledProductDataStructure !== true &&
        add_reviews &&
        reviews &&
        reviews instanceof Array
    ) {
        let _reviews = reviews.map(item => {
            const value =
                item &&
                item.ratings_breakdown &&
                item.ratings_breakdown[0] &&
                item.ratings_breakdown[0].value
                    ? item.ratings_breakdown[0].value
                    : '';
            return {
                '@type': 'Review',
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: parseInt(value)
                },
                author: {
                    '@type': 'Person',
                    name: item.nickname
                },
                reviewBody: item.text,
                bestRating: best_rating || 5
            };
        });
        if (_reviews.length) {
            dataStructure = {
                ...dataStructure,
                review: _reviews
            };
        }
    }

    if (rs_enabled) {
        window.productDataStructure = dataStructure; // save data to env
        script.innerHTML = JSON.stringify(dataStructure);
        document.head.appendChild(script);
    }

    // Add <html prefix= "og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# product: http://ogp.me/ns/product#">
    if (og_enabled) {
        var htmlTag = document.querySelectorAll('html')[0];
        htmlTag.setAttribute(
            'prefix',
            'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# product: http://ogp.me/ns/product#'
        );
    }

    if (product && product instanceof Object) {
        // Crop by config
        let description_crop = productDesc || '';
        if (crop_meta_description && max_description_length) {
            description_crop = description_crop.substr(
                0,
                parseInt(max_description_length)
            );
        }
        let meta_title_crop = productName || '';
        if (crop_meta_title && max_title_length) {
            meta_title_crop = meta_title_crop.substr(
                0,
                parseInt(max_title_length)
            );
        }

        return (
            <>
                {og_enabled && (
                    <Helmet>
                        <meta property="og:type" content="og:product" />
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
                        <meta
                            property="product:price:currency"
                            content={default_display_currency_code || 'USD'}
                        />
                    </Helmet>
                )}
                {tw_enabled && (
                    <Helmet>
                        <meta name="twitter:card" content="summary" />
                        <meta name="twitter:site" content={`@${tw_username}`} />
                        <meta property="og:url" content={productUrl} />
                        <meta property="og:title" content={meta_title_crop} />
                        <meta
                            property="og:description"
                            content={description_crop}
                        />
                        <meta property="og:image" content={productImage} />
                    </Helmet>
                )}
            </>
        );
    }
    return null;
};

export default compose(withRouter)(Product);
