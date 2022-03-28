import React, { Fragment, Suspense, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';
import Identify from 'src/simi/Helper/Identify';
import Price from '../PriceWrapper/Price';
import { configColor } from 'src/simi/Config';

import { useProductFullDetail } from 'src/simi/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from 'src/simi/BaseComponents/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '../ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { QuantityFields } from '../Cart/ProductListing/quantity';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import defaultClasses from './productFullDetail.module.css';
import SizeChart from './SizeChart';
const WishlistButton = React.lazy(() =>
    import('@magento/venia-ui/lib/components/Wishlist/AddToListButton')
);
const Options = React.lazy(() => import('../ProductOptions'));
const SimiProductOptions = React.lazy(() => import('../SimiProductOptions'));
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import { ProductDetailExtraProducts } from './productDetailExtraProducts';
import ProductReview from './ProductReview';
import ProductLabel from './ProductLabel';
import Pdetailsbrand from './Pdetailsbrand';
import DataStructure from '../Seo/Markup/Product';
import DataStructureBasic from '../SeoBasic/Markup/Product';
import useProductReview from '../../../talons/ProductFullDetail/useProductReview';

require('./productFullDetail.scss');

const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

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

const ProductFullDetail = props => {
    const { product, history } = props;

    const talonProps = useProductFullDetail({ product });
    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        wishlistButtonProps,
        optionSelections,
        optionCodes,
        extraPrice,
        switchExtraPriceForNormalPrice,
        upsellProducts,
        crosssellProducts,
        relatedProducts
    } = talonProps;

    const storeConfig = Identify.getStoreConfig();
    const enabledReview =
        storeConfig &&
        storeConfig.storeConfig &&
        parseInt(storeConfig.storeConfig.product_reviews_enabled);
    const [isOpen, setIsOpen] = useState(false);

    const {
        data,
        loading,
        submitReviewLoading,
        submitReview
    } = useProductReview({
        product,
        setIsOpen,
        enabledReview
    });
    const reviews =
        data && data.products.items[0] ? data.products.items[0].reviews : false;

    const items = (reviews && reviews.items) || [];

    let avg_rating =
        items.reduce((sum, item, index) => {
            let val =
                item.ratings_breakdown[0] && item.ratings_breakdown[0].value;
            return (sum = sum + parseInt(val));
        }, 0) / items.length;

    const { formatMessage } = useIntl();
    const productReview = useRef(null);

    const scrollToReview = () => {
        smoothScrollToView(document.querySelector('.reviewsContainer'));
    };

    const classes = useStyle(defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : (
        <SimiProductOptions
            product={product}
            useProductFullDetailProps={talonProps}
        />
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

    const cartCallToActionText = !isOutOfStock ? (
        <FormattedMessage
            id="productFullDetail.addItemToCart"
            defaultMessage="Add to Cart"
        />
    ) : (
        <FormattedMessage
            id="productFullDetail.itemOutOfStock"
            defaultMessage="Out of Stock"
        />
    );

    const cartActionContent = isSupportedProductType ? (
        <Button disabled={isAddToCartDisabled} priority="high" type="submit">
            {cartCallToActionText}
        </Button>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={
                        'This product is currently unavailable for purchase.'
                    }
                />
            </p>
        </div>
    );

    const pricePiece = switchExtraPriceForNormalPrice ? (
        <Price currencyCode={extraPrice.currency} value={extraPrice.value} />
    ) : (
        <Price
            currencyCode={productDetails.price.currency}
            value={productDetails.price.value}
            fromValue={productDetails.price.fromValue}
            toValue={productDetails.price.toValue}
            baseValue={productDetails.price.baseValue}
        />
    );
    const { price } = product || {};
    return (
        <>
        <div className="p-fulldetails-ctn container">
            {mageworxSeoEnabled ? (
                <DataStructure
                    avg_rating={avg_rating}
                    product={product}
                    price={price}
                />
            ) : (
                <DataStructureBasic
                    avg_rating={avg_rating}
                    product={product}
                    price={price}
                />
            )}
            {breadcrumbs}
            <div className="wrapperForm">
                <Form className={classes.root} onSubmit={handleAddToCart}>
                    <div className="wrapperTitle">
                        <section className={classes.title}>
                            <h1 className={classes.productName}>
                                {productDetails.name}
                                <Pdetailsbrand product={product} />
                            </h1>
                        </section>
                    </div>
                    <div className="wrapperSku">
                        <section className={classes.details}>
                            <span className={classes.detailsTitle}>
                                <FormattedMessage
                                    id={'global.labelSku'}
                                    defaultMessage={'SKU: '}
                                />
                                {productDetails.sku}
                            </span>
                        </section>
                    </div>
                    {product &&
                    product.review_count &&
                    product.rating_summary ? (
                        <div className="wrapperReviewSum">
                            <section
                                onClick={() => scrollToReview()}
                                className={classes.reviewSum}
                            >
                                <StaticRate
                                    backgroundColor={configColor.content_color}
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
                            </section>
                        </div>
                    ) : (
                        <div
                            onClick={() => productReview.current.togglePopup()}
                            className={classes.noReview}
                        >
                            <FormattedMessage
                                id="productFullDetail.noReview"
                                defaultMessage="Be the first to review this product"
                            />
                        </div>
                    )}
                    <section className={classes.imageCarousel}>
                        <Carousel
                            product={product}
                            optionSelections={optionSelections}
                            optionCodes={optionCodes}
                            labelData={
                                product.mp_label_data &&
                                product.mp_label_data.length > 0
                                    ? product.mp_label_data
                                    : null
                            }
                        />
                        {/* <ProductLabel productLabel = {product.mp_label_data.length > 0 ? product.mp_label_data : null} /> */}
                    </section>

                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={errors.get('form') || []}
                    />
                    <div className="wrapperOptions">
                        <section className={classes.options}>
                            {options}
                            {product.mp_sizeChart &&
                            product.mp_sizeChart.display_type == 'popup' ? (
                                <SizeChart
                                    sizeChart={
                                        product.mp_sizeChart
                                            ? product.mp_sizeChart
                                            : null
                                    }
                                />
                            ) : null}

                            <div className="wrapperPrice">
                                <span className="labelPrice">
                                    <FormattedMessage
                                        id="productFullDetail.labelPrice"
                                        defaultMessage="Per pack: "
                                    />
                                </span>
                                <span style={{color: configColor.price_color}} className={classes.productPrice}>
                                    {pricePiece}
                                </span>
                                {isOutOfStock ? (
                                    <span className="outOfStock">
                                        <FormattedMessage
                                            id="productFullDetail.outOfStoc"
                                            defaultMessage="Out of stock"
                                        />
                                    </span>
                                ) : (
                                    ''
                                )}
                            </div>
                        </section>
                    </div>

                    {product.items ? (
                        ''
                    ) : (
                        <div className="wrapperQuantity">
                            <section className={classes.quantity}>
                                <span className={classes.quantityTitle}>
                                    <FormattedMessage
                                        id={'productFullDetail.quantity'}
                                        defaultMessage={'Quantity: '}
                                    />
                                </span>
                                <QuantityFields
                                    classes={{ root: classes.quantityRoot }}
                                    min={1}
                                    message={errors.get('quantity')}
                                />
                            </section>
                        </div>
                    )}

                    <div
                        className={
                            isAddToCartDisabled
                                ? 'addCartDisabled'
                                : 'wrapperActions'
                        }
                    >
                        <section className={classes.actions}>
                            {cartActionContent}
                            <Suspense fallback={null}>
                                <WishlistButton {...wishlistButtonProps} />
                            </Suspense>
                        </section>
                        {product.mp_sizeChart &&
                        product.mp_sizeChart.display_type == 'inline' ? (
                            <SizeChart
                                sizeChart={
                                    product.mp_sizeChart
                                        ? product.mp_sizeChart
                                        : null
                                }
                            />
                        ) : null}
                    </div>
                    <section className={classes.description}>
                        <span className={classes.descriptionTitle}>
                            <FormattedMessage
                                id={'productFullDetail.productDescription'}
                                defaultMessage={'Product Description'}
                            />
                        </span>
                        <RichContent
                            html={
                                productDetails.description &&
                                productDetails.description.html
                                    ? productDetails.description.html
                                    : productDetails.description
                            }
                        />
                    </section>

                    <section className={classes.details}>
                        <span className={classes.detailsTitle}>
                            <FormattedMessage
                                id={'global.sku'}
                                defaultMessage={'SKU'}
                            />
                        </span>
                        <strong>{productDetails.sku}</strong>
                    </section>
                </Form>
            </div>
            {product.mp_sizeChart &&
            product.mp_sizeChart.display_type == 'tab' ? (
                <SizeChart
                    sizeChart={
                        product.mp_sizeChart ? product.mp_sizeChart : null
                    }
                />
            ) : null}
            <ProductReview product={product} ref={productReview} />
            <ProductDetailExtraProducts
                classes={classes}
                products={relatedProducts}
                history={history}
            >
                <FormattedMessage
                    id="productFullDetail.relatedProducts"
                    defaultMessage="Related Product"
                />
            </ProductDetailExtraProducts>

            <ProductDetailExtraProducts
                classes={classes}
                products={upsellProducts}
                history={history}
            >
                <FormattedMessage
                    id="productFullDetail.upsellProduct"
                    defaultMessage="Upsell Product"
                />
            </ProductDetailExtraProducts>

            <ProductDetailExtraProducts
                classes={classes}
                products={crosssellProducts}
                history={history}
            >
                <FormattedMessage
                    id="productFullDetail.crosssellProduct"
                    defaultMessage="Crosssell Product"
                />
            </ProductDetailExtraProducts>
        </div>
        </>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
