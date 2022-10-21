import React, { Fragment, Suspense, useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';
import Identify from 'src/simi/Helper/Identify';
import Price from '@simicart/siminia/src/simi/App/core/PriceWrapper/Price.js';
import { configColor } from 'src/simi/Config';
import AlertMessages from './AlertMessages';
import { useProductFullDetail } from '../talons/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from 'src/simi/BaseComponents/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '../ProductImageCarousel';
// import FormError from '@magento/venia-ui/lib/components/FormError';
import FormError from '../Customer/Login/formError';
import { QuantityFields } from '@simicart/siminia/src/simi/App/core/Cart/ProductListing/quantity.js';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import defaultClasses from './productFullDetail.module.css';
import SizeChart from './SizeChart';
import GiftCardInformationForm from 'src/simi/App/nativeInner/GiftCard/ProductFullDetail/GiftCardInformationForm';
import GridCardTemplate from 'src/simi/App/nativeInner/GiftCard/ProductFullDetail/GridCardTemplate';
import { PriceAlertProductDetails } from './PriceAlertProductDetails';
import { PopupAlert } from './PopupAlert/popupAlert';
const WishlistButton = React.lazy(() =>
    import('@magento/venia-ui/lib/components/Wishlist/AddToListButton')
);
const Options = React.lazy(() =>
    import('@simicart/siminia/src/simi/App/core/ProductOptions')
);
const SimiProductOptions = React.lazy(() =>
    import('@simicart/siminia/src/simi/App/core/SimiProductOptions')
);
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import { ProductDetailExtraProducts as ProductDetailExtraProductsMB } from './productDetailExtraProducts.js';
import { ProductDetailExtraProducts } from '../../core/ProductFullDetail/productDetailExtraProducts';
import ProductReview from '@simicart/siminia/src/simi/App/nativeInner/ProductFullDetail/ProductReview';
import ProductLabel from '@simicart/siminia/src/simi/App/core/ProductFullDetail/ProductLabel';
import Pdetailsbrand from '@simicart/siminia/src/simi/App/core/ProductFullDetail/Pdetailsbrand';
import DataStructure from '@simicart/siminia/src/simi/App/core/Seo/Markup/Product.js';
import DataStructureBasic from '@simicart/siminia/src/simi/App/core/SeoBasic/Markup/Product.js';
import useProductReview from '../../../talons/ProductFullDetail/useProductReview';
import { useHistory, Link } from 'react-router-dom';
import {
    ArrowLeft,
    ShoppingCart,
    MoreVertical,
    ArrowRight
} from 'react-feather';
import { FaChevronRight } from 'react-icons/fa';
import { BiHelpCircle, BiHome } from 'react-icons/bi';
// import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useGiftCard } from '../GiftCard/talons/useGiftCard';
import { GET_ITEM_COUNT_QUERY } from '@simicart/siminia/src/simi/App/core/Header/cartTrigger.gql.js';
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import StatusBar from './statusBar';
import FooterFixedBtn from './footerFixedBtn';
import AddToCartPopup from './addToCartPopup';
import CallForPrice from './callForPrice';
import CustomAttributes from './CustomAttributes';
import { isCallForPriceEnable } from '../Helper/Module';
import PriceTiers from './PriceTiers';

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
    const { product } = props;
    const talonProps = useProductFullDetail({ product });

    const {
        breadcrumbCategoryId,
        errorMessage,
        userErrorsMessage,
        handleAddToCart,
        handleBuyNow,
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
        relatedProducts,
        isAddProductLoading,
        setAlertMsg,
        alertMsg,
        handleUpdateQuantity
    } = talonProps;

    const {
        giftCardProductData,
        giftCardData,
        giftCardActions,
        isAddGiftCardProductLoading,
        handleAddGiftCardProductToCart,
        handleByNowGiftCardProduct
    } = useGiftCard({ product, setAlertMsg });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [popupData, setPopUpData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const successMsg = `${productDetails.name} was added to shopping cart`;
    const [{ isSignedIn }] = useUserContext();
    const history = useHistory();
    const dataLocation = product.mp_callforprice_rule
        ? product.mp_callforprice_rule
        : null;

    const action =
        dataLocation && dataLocation.action ? dataLocation.action : '';
    const [moreBtn, setMoreBtn] = useState(false);
    const storeConfig = Identify.getStoreConfig();
    const enabledReview =
        storeConfig &&
        storeConfig.storeConfig &&
        parseInt(storeConfig.storeConfig.product_reviews_enabled);
    const [isOpen, setIsOpen] = useState(false);
    const [addToCartPopup, setAddToCartPopup] = useState(false);
    const [descripttion, setDescripttion] = useState(-1);
    const isMobileSite = window.innerWidth <= 450;
    const [typeBtn, setTypeBtn] = useState('');

    const { itemCount: itemsQty } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        },
        storeConfig
    });

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
    const avg_rating = items && items[0] ? items[0].average_rating : '';

    const { formatMessage } = useIntl();
    const productReview = useRef(null);
    const carouselImgSize = useRef(null);
    let positionFooterFixed =
        carouselImgSize && carouselImgSize.current
            ? (40 / carouselImgSize.current.clientHeight) * 100
            : 514;

    if (product.__typename === 'MpGiftCardProduct') positionFooterFixed - 100;
    const scrollToReview = () => {
        smoothScrollToView(document.querySelector('.reviewsContainer'));
    };
    const desStatus = status => {
        if (status === -1) {
            return 'description';
        } else if (status === false) {
            return 'description-close';
        } else return 'description-open';
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
    if (Array.isArray(userErrorsMessage) && userErrorsMessage.length > 0) {
        userErrorsMessage.forEach(userErrorMessage => {
            errors.set('form', [new Error(userErrorMessage)]);
        });
    }
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

    const cartCallToActionText = () => {
        if (typeBtn === 'add to cart') {
            return !isOutOfStock ? (
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
        } else
            return !isOutOfStock ? (
                <FormattedMessage id="Buy now" defaultMessage="Buy Now" />
            ) : (
                <FormattedMessage
                    id="productFullDetail.itemOutOfStock"
                    defaultMessage="Out of Stock"
                />
            );
    };

    const cartActionContent = isSupportedProductType ? (
        <Button
            disabled={isAddToCartDisabled || isAddGiftCardProductLoading}
            priority="high"
            type="submit"
        >
            {cartCallToActionText()}
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
    let topInsets = 0;
    let bottomInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            topInsets = parseInt(simicartRNinsets.top);
            bottomInsets = parseInt(simicartRNinsets.bottom);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            topInsets = parseInt(simpifyRNinsets.top);
            bottomInsets = parseInt(simpifyRNinsets.bottom);
        }
    } catch (err) {}

    const pricePiece =
        product.__typename === 'MpGiftCardProduct' ? (
            <Price
                currencyCode={productDetails.price.currency}
                value={
                    giftCardData && giftCardData.gcPrice
                        ? giftCardData.gcPrice
                        : 0
                }
            />
        ) : switchExtraPriceForNormalPrice ? (
            <Price
                currencyCode={extraPrice.currency}
                value={extraPrice.value}
            />
        ) : (
            <Price
                currencyCode={productDetails.price.currency}
                value={productDetails.price.value}
                fromValue={productDetails.price.fromValue}
                toValue={productDetails.price.toValue}
            />
        );
    const { price, sku, price_tiers } = product || {};

    const review =
        product && product.review_count && product.rating_summary ? (
            <div className="wrapperReviewSum">
                <section
                    onClick={() => scrollToReview()}
                    className={classes.reviewSum}
                >
                    <StaticRate
                        backgroundColor={
                            !isMobileSite
                                ? configColor.content_color
                                : '#FFC500'
                        }
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
                    id="Be the first to review this product"
                    defaultMessage="Be the first to review this product"
                />
            </div>
        );

    let wrapperPrice = (
        <React.Fragment>
            <div className="wrapperPrice">
                <span
                    className="labelPrice"
                    style={{ color: configColor.price_color }}
                >
                    {!isMobileSite ? (
                        <FormattedMessage
                            id="Per pack:"
                            defaultMessage="Per pack: "
                        />
                    ) : null}
                </span>
                <span
                    style={{ color: configColor.price_color }}
                    className={classes.productPrice}
                >
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
            {price_tiers &&
            Array.isArray(price_tiers) &&
            price_tiers.length > 0 ? (
                <PriceTiers priceTiers={price_tiers} price={price} />
            ) : null}
        </React.Fragment>
    );

    if (isCallForPriceEnable()) {
        if (
            !(action === 'login_see_price' && isSignedIn) ||
            action === 'redirect_url'
        ) {
            wrapperPrice = null;
        }
    }

    const wrapperQuantity =
        product.__typename !== 'GroupedProduct' ? (
            <div className="wrapperQuantity">
                <section
                    className={!isMobileSite ? classes.quantity : 'mbQuantity'}
                >
                    <span className={classes.quantityTitle}>
                        <FormattedMessage
                            id={'Quantity'}
                            defaultMessage={'Quantity: '}
                        />
                    </span>
                    <QuantityFields
                        classes={{ root: classes.quantityRoot }}
                        onChange={handleUpdateQuantity}
                        min={1}
                        message={errors.get('quantity')}
                    />
                </section>
                {/* {!isMobileSite ? ( */}
                <div>
                    <PriceAlertProductDetails
                        sku={sku}
                        setMessage={setMessage}
                        setMessageType={setMessageType}
                        setPopUpData={setPopUpData}
                        setShowPopup={setShowPopup}
                    />
                    <PopupAlert
                        popupData={popupData}
                        showPopup={showPopup}
                        setShowPopup={setShowPopup}
                    />
                </div>
                {/* ) : null} */}
            </div>
        ) : (
            ''
        );
    const renderSizeChart = product.mp_sizeChart ? (
        <SizeChart
            sizeChart={product.mp_sizeChart ? product.mp_sizeChart : null}
            isMobileSite={isMobileSite}
            topInsets={topInsets}
        />
    ) : null;
    const cartAction = (
        <div
            className={
                isAddToCartDisabled || isAddGiftCardProductLoading
                    ? 'addCartDisabled'
                    : 'wrapperActions'
            }
        >
            <section className={classes.actions}>
                {cartActionContent}
                {isMobileSite ? null : (
                    <Suspense fallback={null}>
                        <WishlistButton {...wishlistButtonProps} />
                    </Suspense>
                )}
            </section>
            {!isMobileSite &&
            product.mp_sizeChart &&
            product.mp_sizeChart.display_type == 'inline' ? (
                <SizeChart
                    sizeChart={
                        product.mp_sizeChart ? product.mp_sizeChart : null
                    }
                />
            ) : null}
        </div>
    );
    const productDetailCarousel = [];
    if (isMobileSite) {
        productDetailCarousel.push(
            <React.Fragment>
                <div className={classes.headerBtn} key="element-mobile">
                    <button
                        className={classes.backBtn}
                        onClick={() => history.goBack()}
                    >
                        <ArrowLeft />
                    </button>

                    <div className={classes.headerBtnRight}>
                        <span className="cart-qty">{itemsQty}</span>
                        <Link className="header-icon" to="/cart">
                            <ShoppingCart />
                        </Link>
                        <Suspense fallback={null}>
                            <WishlistButton {...wishlistButtonProps} />
                        </Suspense>{' '}
                        <div
                            onClick={() => setMoreBtn(!moreBtn)}
                            className="header-icon"
                        >
                            <MoreVertical />
                        </div>
                        {moreBtn ? (
                            <ul className="header-more">
                                <li>
                                    <BiHome />
                                    <Link to="/">
                                        <FormattedMessage
                                            id={'Home'}
                                            defaultMessage={'Home'}
                                        />
                                    </Link>
                                </li>
                                <li>
                                    <BiHelpCircle />
                                    <FormattedMessage
                                        id={'Help Center'}
                                        defaultMessage={'Help Center'}
                                    />
                                </li>
                            </ul>
                        ) : null}
                    </div>
                </div>
                <StatusBar
                    status={product.stock_status}
                    position={positionFooterFixed}
                />
            </React.Fragment>
        );
    }
    if (
        product.__typename === 'MpGiftCardProduct' &&
        giftCardProductData.template &&
        giftCardProductData.template.length > 0
    ) {
        productDetailCarousel.push(
            <GridCardTemplate
                key="grid-card-template"
                giftCardProductData={giftCardProductData}
                giftCardData={giftCardData}
                giftCardActions={giftCardActions}
            />
        );
    } else {
        productDetailCarousel.push(
            <Carousel
                key="product-detail-carousel"
                product={product}
                optionSelections={optionSelections}
                optionCodes={optionCodes}
                labelData={
                    product.mp_label_data && product.mp_label_data.length > 0
                        ? product.mp_label_data
                        : null
                }
                topInsets={topInsets}
            />
        );
    }

    return (
        <div className={isMobileSite ? 'main-product-detail-native' : null}>
            <div style={{ height: topInsets }} />
            <AlertMessages
                message={successMsg}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status="success"
                topInsets={topInsets}
            />

            {addToCartPopup ? (
                <AddToCartPopup
                    options={options}
                    wrapperQuantity={wrapperQuantity}
                    cartAction={cartAction}
                    handleAddToCart={
                        product.__typename === 'MpGiftCardProduct'
                            ? handleAddGiftCardProductToCart
                            : handleAddToCart
                    }
                    handleBuyNow={
                        product.__typename === 'MpGiftCardProduct'
                            ? handleByNowGiftCardProduct
                            : handleBuyNow
                    }
                    setAddToCartPopup={setAddToCartPopup}
                    typeBtn={typeBtn}
                    loading={isAddProductLoading}
                    setAlertMsg={setAlertMsg}
                    alertMsg={alertMsg}
                    productName={productDetails.name}
                    addToCartPopup={addToCartPopup}
                    bottomInsets={bottomInsets}
                    giftCardForm={
                        product.__typename === 'MpGiftCardProduct' && (
                            <GiftCardInformationForm
                                giftCardProductData={giftCardProductData}
                                giftCardData={giftCardData}
                                giftCardActions={giftCardActions}
                            />
                        )
                    }
                />
            ) : null}

            {/* <div className={'p-fulldetails-ctn container'}> */}
            <div
                className={'p-fulldetails-ctn'}
                style={{
                    backgroundColor: isMobileSite
                        ? configColor.app_background
                        : '#fff'
                }}
            >
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

                {isMobileSite ? null : breadcrumbs}
                <div className="wrapperForm ">
                    <Form
                        className={classes.root}
                        onSubmit={
                            product.__typename === 'MpGiftCardProduct'
                                ? handleAddGiftCardProductToCart
                                : handleAddToCart
                        }
                    >
                        {!isMobileSite ? (
                            <div className="wrapperTitle">
                                <section className={classes.title}>
                                    <h1 className={classes.productName}>
                                        {productDetails.name}
                                        <Pdetailsbrand product={product} />
                                    </h1>
                                </section>
                            </div>
                        ) : null}
                        {!isMobileSite ? (
                            <div className="wrapperSku">
                                <section className={classes.details}>
                                    <span className={classes.detailsTitle}>
                                        <FormattedMessage
                                            id={'SKU'}
                                            defaultMessage={'SKU'}
                                        />
                                        {': ' + productDetails.sku}
                                    </span>
                                </section>
                            </div>
                        ) : null}

                        {!isMobileSite ? review : null}
                        <section
                            ref={carouselImgSize}
                            className={classes.imageCarousel}
                        >
                            {productDetailCarousel}
                            {/* {isMobileSite ? <FooterFixedBtn /> : null} */}
                            {/* <ProductLabel productLabel = {product.mp_label_data.length > 0 ? product.mp_label_data : null} /> */}
                        </section>

                        <div className="productDescription">
                            {!isMobileSite && product.short_description ? (
                                <RichContent
                                    html={product.short_description.html}
                                />
                            ) : null}
                        </div>

                        {!isMobileSite ? (
                            <div className="wrapperOptions">
                                <section className={classes.options}>
                                    {options}
                                    {product.__typename ===
                                        'MpGiftCardProduct' && (
                                        <GiftCardInformationForm
                                            giftCardProductData={
                                                giftCardProductData
                                            }
                                            giftCardData={giftCardData}
                                            giftCardActions={giftCardActions}
                                        />
                                    )}
                                    {product.mp_sizeChart &&
                                    product.mp_sizeChart &&
                                    product.mp_sizeChart.display_type ==
                                        'popup' ? (
                                        <SizeChart
                                            sizeChart={
                                                product.mp_sizeChart
                                                    ? product.mp_sizeChart
                                                    : null
                                            }
                                            isMobileSite={isMobileSite}
                                        />
                                    ) : null}
                                    {!isMobileSite ? wrapperPrice : null}
                                </section>
                            </div>
                        ) : null}

                        {product.items
                            ? ''
                            : !isMobileSite
                            ? wrapperQuantity
                            : null}

                        {!isMobileSite ? cartAction : null}

                        <div className={classes.wrapperError}>
                            <FormError
                                classes={{
                                    root: classes.formErrors
                                }}
                                errors={errors.get('form') || []}
                            />
                        </div>

                        <div className={classes.wrapperDes}>
                            <section className={classes.description}>
                                <span
                                    onClick={() => setDescripttion(true)}
                                    className="descriptionTitle"
                                >
                                    <FormattedMessage
                                        id={'Product Description'}
                                        defaultMessage={'Product Description'}
                                    />
                                </span>

                                {!isMobileSite ? (
                                    <RichContent
                                        html={productDetails.description}
                                    />
                                ) : (
                                    <>
                                        <span>
                                            <FaChevronRight />
                                        </span>

                                        <div
                                            className={desStatus(descripttion)}
                                        >
                                            <div
                                                style={{ height: topInsets }}
                                            />
                                            <div
                                                className="des-title"
                                                onClick={() =>
                                                    setDescripttion(false)
                                                }
                                            >
                                                <ArrowLeft />
                                                <p>
                                                    <FormattedMessage
                                                        id={
                                                            'Product Description'
                                                        }
                                                        defaultMessage={
                                                            'Product Description'
                                                        }
                                                    />
                                                </p>
                                            </div>
                                            <RichContent
                                                html={
                                                    productDetails.description
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </section>
                            {product.short_description !== '' &&
                            isMobileSite ? (
                                <div className="short-description">
                                    <RichContent
                                        html={product.short_description.html}
                                    />
                                </div>
                            ) : null}
                        </div>
                        {!isMobileSite ? (
                            <section className={classes.details}>
                                {/* <span className={classes.detailsTitle}>
                                    <FormattedMessage
                                        id={'SKU'}
                                        defaultMessage={'SKU'}
                                    />
                                </span>
                                <strong>{productDetails.sku}</strong> */}
                            </section>
                        ) : (
                            <div className="sku-details">
                                <span className={classes.detailsTitle}>
                                    <FormattedMessage
                                        id={'SKU'}
                                        defaultMessage={'SKU'}
                                    />
                                </span>
                                <strong>{productDetails.sku}</strong>
                            </div>
                        )}
                    </Form>
                    {isMobileSite ? (
                        <div className="productInfo">
                            <div className="wrapperTitle">
                                <section className={classes.title}>
                                    <h1 className={classes.productName}>
                                        {/* {productDetails.name} */}
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: productDetails.name
                                            }}
                                        />
                                        <Pdetailsbrand product={product} />
                                    </h1>
                                </section>
                            </div>
                            {/* {wrapperPrice} */}
                            {/* {renderPriceWithCallForPrice(dataLocation)} */}
                            {wrapperPrice}
                            {review}
                        </div>
                    ) : null}
                </div>
                {isMobileSite ? renderSizeChart : null}
                {product.mp_sizeChart &&
                product.mp_sizeChart.display_type == 'tab' ? (
                    <SizeChart
                        sizeChart={
                            product.mp_sizeChart ? product.mp_sizeChart : null
                        }
                    />
                ) : null}
                {product.hasOwnProperty('custom_attributes') &&
                    product.custom_attributes.length > 0 && (
                        <CustomAttributes
                            customAttributes={product.custom_attributes}
                        />
                    )}
                <ProductReview
                    topInsets={topInsets}
                    product={product}
                    ref={productReview}
                />
                {isMobileSite ? (
                    <ProductDetailExtraProductsMB
                        classes={classes}
                        products={relatedProducts}
                        history={history}
                    >
                        <FormattedMessage
                            id="Related Products"
                            defaultMessage="Related Product"
                        />
                    </ProductDetailExtraProductsMB>
                ) : (
                    <ProductDetailExtraProducts
                        classes={classes}
                        products={relatedProducts}
                        history={history}
                    >
                        <FormattedMessage
                            id="Related Products"
                            defaultMessage="Related Products"
                        />
                    </ProductDetailExtraProducts>
                )}

                {isMobileSite ? (
                    <ProductDetailExtraProductsMB
                        classes={classes}
                        products={upsellProducts}
                        history={history}
                    >
                        <FormattedMessage
                            id="Upsell Product"
                            defaultMessage="Upsell Product"
                        />
                    </ProductDetailExtraProductsMB>
                ) : (
                    <ProductDetailExtraProducts
                        classes={classes}
                        products={upsellProducts}
                        history={history}
                    >
                        <FormattedMessage
                            id="Upsell Product"
                            defaultMessage="Upsell Product"
                        />
                    </ProductDetailExtraProducts>
                )}

                {isMobileSite ? (
                    <ProductDetailExtraProductsMB
                        classes={classes}
                        products={crosssellProducts}
                        history={history}
                    >
                        <FormattedMessage
                            id="Crosssell Product"
                            defaultMessage="Crosssell Product"
                        />
                    </ProductDetailExtraProductsMB>
                ) : (
                    <ProductDetailExtraProducts
                        classes={classes}
                        products={crosssellProducts}
                        history={history}
                    >
                        <FormattedMessage
                            id="Crosssell Product"
                            defaultMessage="Crosssell Product"
                        />
                    </ProductDetailExtraProducts>
                )}
            </div>
            {isMobileSite ? (
                <FooterFixedBtn
                    addToCartPopup={addToCartPopup}
                    setAddToCartPopup={setAddToCartPopup}
                    typeBtn={typeBtn}
                    setTypeBtn={setTypeBtn}
                    bottomInsets={bottomInsets}
                    data={dataLocation}
                    wrapperPrice={wrapperPrice}
                    item_id={product.id}
                />
            ) : null}
        </div>
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
