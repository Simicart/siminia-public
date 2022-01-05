import React, { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';

import Price from '../PriceWrapper/Price';
import { useProductFullDetail } from 'src/simi/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from 'src/simi/BaseComponents/Breadcrumbs';
import Carousel from '../ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { QuantityFields } from '../Cart/ProductListing/quantity';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import ProductGrid from '../TapitaPageBuilder/Products/grid';
import defaultClasses from './productFullDetail.module.css';
import ReactDOM from 'react-dom';

const WishlistButton = React.lazy(() =>
    import('@magento/venia-ui/lib/components/Wishlist/AddToListButton')
);
const Options = React.lazy(() => import('../ProductOptions'));
const SimiProductOptions = React.lazy(() => import('../SimiProductOptions'));
import PageBuilderComponent from 'src/simi/App/core/TapitaPageBuilder/PageBuilderComponent';

import { StaticRate } from 'src/simi/BaseComponents/Rate';
import ProductReview from './ProductReview';

import { useWindowSize } from '@magento/peregrine';

require('./productbuilderFullDetail.scss');

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductBuilderFullDetail = props => {
    const { product, pageData, maskedId } = props;

    const talonProps = useProductFullDetail({ product, noRelatedQuery: true });
    //use windowsize to force render on screen resize
    const windowSize = useWindowSize();
    const productReview = useRef(null);

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isAddToCartDisabled,
        productDetails,
        wishlistButtonProps,
        optionSelections,
        optionCodes,
        extraPrice,
        switchExtraPriceForNormalPrice
    } = talonProps;
    const { formatMessage } = useIntl();
    const [forceRerender, setForceRerender] = useState(0);

    useEffect(() => {
        //when preview - need sometime to get page info to preview -> need time to refresh
        if (maskedId) {
            setTimeout(() => {
                setForceRerender(forceRerender + 1);
            }, 2000);
        }
    }, []);

    useEffect(() => {
        //fix the carousel height lower than its children
        try {
            const carouselChild = document.querySelector(
                '#smpb-product-image-wrapper > div > div'
            );
            if (carouselChild && carouselChild.offsetHeight) {
                document.getElementById(
                    'smpb-product-image-wrapper'
                ).style.minHeight = carouselChild.offsetHeight + 15 + 'px';
            }
        } catch (err) {}

        //force rerender when switching between pagebuilder pages
        if (pageData && pageData.publish_items) {
            const { publish_items } = pageData;
            if (
                (publish_items.indexOf('productbuilder_productimage') > -1 &&
                    !document.getElementById('product-detail-carousel')) ||
                (publish_items.indexOf('productbuilder_productoptions') > -1 &&
                    !document.getElementById('product-detail-option'))
            ) {
                setForceRerender(forceRerender + 1);
            }
        }
    });

    const classes = useStyle(defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <SimiProductOptions
                product={product}
                useProductFullDetailProps={talonProps}
            />
        </Suspense>
    );

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const pDetails = JSON.parse(JSON.stringify(product));
    // console.log('pdetail', pDetails);
    const overRender = (item, itemProps, innerContent) => {
        if (!item || !itemProps || !productDetails) return false;
        const { type } = item;
        if (type === 'productbuilder_productname') {
            return (
                <h1 className={classes.productName} {...itemProps}>
                    {productDetails.name}
                </h1>
            );
        } else if (type === 'productbuilder_productprice') {
            const priceProps = JSON.parse(JSON.stringify(itemProps));
            if (priceProps.style) priceProps.style.flexDirection = 'row';
            return <p {...priceProps} id="smpb-product-price-wrapper" />;
        } else if (type === 'productbuilder_productstock') {
            if (pDetails && pDetails.stock_status) {
                return (
                    <div {...itemProps}>
                        {pDetails.stock_status === 'IN_STOCK'
                            ? formatMessage({ id: 'In Stock' })
                            : formatMessage({ id: 'Out Of Stock' })}
                    </div>
                );
            }
            return '';
        } else if (type === 'productbuilder_productimage') {
            const imageProps = JSON.parse(JSON.stringify(itemProps));
            if (imageProps.style) imageProps.style.overflowX = 'hidden';
            return <div {...itemProps} id="smpb-product-image-wrapper" />;
        } else if (type === 'productbuilder_productaddcart') {
            return (
                <button
                    {...itemProps}
                    type="submit"
                    className={`${itemProps.className} ${
                        classes.smpbAddCartBtn
                    }`}
                >
                    <FormattedMessage
                        id={'productFullDetail.cartAction'}
                        defaultMessage={'Add to Cart'}
                    />
                </button>
            );
        } else if (type === 'productbuilder_productaddwishlist') {
            return (
                <div {...itemProps}>
                    <WishlistButton {...wishlistButtonProps} />
                </div>
            );
        } else if (type === 'productbuilder_productqty') {
            return (
                <div {...itemProps}>
                    <QuantityFields
                        classes={{ root: classes.quantityRoot }}
                        min={1}
                        message={errors.get('quantity')}
                    />
                </div>
            );
        } else if (type === 'productbuilder_productoptions') {
            return (
                <div
                    className={classes.options}
                    {...itemProps}
                    id="smpb-product-options-wrapper"
                />
            );
        } else if (type === 'productbuilder_productdesc') {
            return (
                <div {...itemProps}>
                    <RichContent html={productDetails.description} />
                </div>
            );
        } else if (type === 'productbuilder_productbreadcrumb') {
            return <div {...itemProps} id="smpb-product-breadcrumb-wrapper" />;
        } else if (type === 'productbuilder_productattribute') {
            if (item.name) {
                let attributeString = item.name;
                attributeString = attributeString.substring(
                    attributeString.indexOf('{{') + 2,
                    attributeString.lastIndexOf('}}')
                );
                let attributeVal;
                if (attributeString.includes('.')) {
                    try {
                        const attributepaths = attributeString.split('.');
                        if (attributepaths && attributepaths.length) {
                            attributeVal = pDetails;
                            attributepaths.map(attributepath => {
                                if (attributeVal[attributepath])
                                    attributeVal = attributeVal[attributepath];
                            });
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                }
                if (attributeVal && typeof attributeVal !== 'object')
                    return (
                        <div {...itemProps}>
                            <RichContent
                                html={item.name.replace(
                                    '{{' + attributeString + '}}',
                                    attributeVal
                                )}
                            />
                        </div>
                    );
            }
        } else if (type === 'productbuilder_productreview') {
            const reviewProps = JSON.parse(JSON.stringify(itemProps));
            if (reviewProps.style) reviewProps.style.flexDirection = 'row';
            if (pDetails && pDetails.review_count && pDetails.rating_summary) {
                return (
                    <div className={classes.reviewSum} {...reviewProps}>
                        <StaticRate
                            rate={product.rating_summary}
                            classes={{
                                'static-rate': classes['static-rate']
                            }}
                        />
                        <span className={classes.reviewSumCount}>
                            ({product.review_count}{' '}
                            {product.review_count > 1
                                ? formatMessage({ id: 'Reviews' })
                                : formatMessage({ id: 'Review' })}
                            )
                        </span>
                    </div>
                );
            } else
                return (
                    <div
                        onClick={() => {
                            if (productReview)
                                productReview.current.togglePopup();
                        }}
                        className={`${classes.noReview} ${
                            reviewProps.className
                        }`}
                        {...reviewProps}
                    >
                        <FormattedMessage
                            id="productFullDetail.noReview"
                            defaultMessage="Be the first to review this product"
                        />
                    </div>
                );
        } else if (type === 'productbuilder_productreview_details') {
            return (
                <div {...itemProps}>
                    <ProductReview product={product} ref={productReview} />
                </div>
            );
        } else if (type === 'productbuilder_relatedproducts') {
            let limit = 8;
            let relatedField = 'related_products';
            let listTitle = 'Related Products';
            if (item && item.dataParsed) {
                if (item.dataParsed.relatedProductType) {
                    if (item.dataParsed.relatedProductType === 'upsell') {
                        listTitle = 'Upsells Products';
                        relatedField = 'upsell_products';
                    } else if (
                        item.dataParsed.relatedProductType === 'crosssell'
                    ) {
                        listTitle = 'Cross-Sells Products';
                        relatedField = 'crosssell_products';
                    }
                }
                if (item.dataParsed.openProductsWidthSortPageSize) {
                    limit = parseInt(
                        item.dataParsed.openProductsWidthSortPageSize
                    );
                }
            }
            if (
                pDetails &&
                pDetails[relatedField] &&
                pDetails[relatedField].length
            ) {
                const skus = [];
                pDetails[relatedField].map((relatedP, indx) => {
                    if (indx < limit) skus.push(relatedP.sku);
                });
                const containerStyle = Object.assign({}, itemProps.style, {
                    display: 'block'
                });
                const productGridStyle = Object.assign({}, itemProps.style, {
                    paddingTop: 5,
                    paddingBottom: 80,
                    paddingLeft: 5,
                    paddingRight: 5
                });

                return (
                    <div {...itemProps} style={containerStyle}>
                        <div className={classes.relatedTitle}>
                            {formatMessage({ id: listTitle })}
                        </div>
                        <div {...itemProps} id={null} style={productGridStyle}>
                            <ProductGrid
                                item={{
                                    dataParsed: {
                                        openProductsWidthSKUs: skus.join(',')
                                    }
                                }}
                            />
                        </div>
                    </div>
                );
            }
            return <></>;
        }
        return false;
    };

    const pricePiece = switchExtraPriceForNormalPrice ? (
        <Price currencyCode={extraPrice.currency} value={extraPrice.value} />
    ) : (
        <Price
            currencyCode={productDetails.price.currency}
            value={productDetails.price.value}
            fromValue={productDetails.price.fromValue}
            toValue={productDetails.price.toValue}
        />
    );

    return (
        <div
            className={`${classes.smProductBuilderRoot} ${
                isAddToCartDisabled || isOutOfStock
                    ? classes.addToCartDisabled
                    : ''
            } smProductBuilderRoot`}
        >
            <Form
                className={classes.root}
                onSubmit={handleAddToCart}
                style={{ display: 'flex' }}
            >
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <div style={{ width: '100%' }}>
                    {useMemo(
                        () => (
                            <PageBuilderComponent
                                lazyloadPlaceHolder={null}
                                maskedId={maskedId}
                                pageData={pageData}
                                overRender={overRender}
                                toPreview={maskedId ? true : false}
                            />
                        ),
                        [product.id, maskedId, pageData]
                    )}
                </div>
                {!!document.getElementById('smpb-product-image-wrapper') &&
                    ReactDOM.createPortal(
                        <Carousel
                            product={product}
                            optionSelections={optionSelections}
                            optionCodes={optionCodes}
                        />,
                        document.getElementById('smpb-product-image-wrapper')
                    )}
                {!!document.getElementById('smpb-product-breadcrumb-wrapper') &&
                    ReactDOM.createPortal(
                        breadcrumbs,
                        document.getElementById(
                            'smpb-product-breadcrumb-wrapper'
                        )
                    )}
                {!!document.getElementById('smpb-product-options-wrapper') &&
                    ReactDOM.createPortal(
                        <div id="product-detail-option">{options}</div>,
                        document.getElementById('smpb-product-options-wrapper')
                    )}
                {!!document.getElementById('smpb-product-price-wrapper') &&
                    ReactDOM.createPortal(
                        <>{pricePiece}</>,
                        document.getElementById('smpb-product-price-wrapper')
                    )}
            </Form>
        </div>
    );
};

export default ProductBuilderFullDetail;
