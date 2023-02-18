import React, { Suspense, useRef, useState } from 'react';
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
import GiftCardInformationForm from 'src/simi/App/nativeInner/GiftCard/ProductFullDetail/GiftCardInformationForm';
import GridCardTemplate from 'src/simi/App/nativeInner/GiftCard/ProductFullDetail/GridCardTemplate';
import { PriceAlertProductDetails } from './PriceAlertProductDetails';
import { PopupAlert } from './PopupAlert/popupAlert';
import RewardPointShowing from 'src/simi/BaseComponents/RewardPoint/components/PointShowing';
import {
    HidePrice,
    HideAddToCartBtn,
    checkIsHidePriceEnable
} from 'src/simi/BaseComponents/CallForPrice/components/Product';

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

// import icon describe tab show/hidden state
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

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
import CustomAttributes from './CustomAttributes';
// import { isCallForPriceEnable } from '../Helper/Module';
import PriceTiers from './PriceTiers';
import SocialShare from '../../../BaseComponents/SocialShare';
import RewardPointProduct from 'src/simi/BaseComponents/RewardPoint/components/Product';

// import talons and size chart component
import useProductData from '../../../../sizechart/talons/useProductData';
import useSizeChartData from '../../../../sizechart/talons/useSizeChartData';
import SizeChart from '../../../../sizechart/components/SizeChart';
import FaqProductDetail from '../Faq/FaqProductDetail';
import ButtonFaq from '../Faq/FaqProductDetail/buttonFaq';

require('./productFullDetail.scss');

const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

// get size chart extension enable/disable state
const sizeChartEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SIZE_CHART &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SIZE_CHART) === 1;

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

    // tab display/hidden state
    const [showTab, setShowTab] = useState(0);

    // tabs display/hidden state native site
    const [showDes, setShowDes] = useState(false);
    const [showRev, setShowRev] = useState(false);
    const [showSiz, setShowSiz] = useState(false);

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

    // get size chart data and display style
    const sizeChartData = useSizeChartData({
        id: useProductData(talonProps.productDetails.sku).id,
        sizeChartEnabled: sizeChartEnabled
    })?.sizeChartData;
    const arr = sizeChartData?.display_popup;
    const display = arr ? arr[0] : null;

    const enabledSizeChart =
        sizeChartEnabled && sizeChartData?.storeConfig?.isEnabled;

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
        smoothScrollToView(document.querySelector('.wrapperReviews'));
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

    const specialPrice =
        product && product.price && product.price.has_special_price ? (
            <div className="wrapperSpecialPrice">
                <span className="specialPrice">
                    <Price
                        currencyCode={productDetails.price.currency}
                        value={product.price.regularPrice.amount.value}
                    />
                </span>
                <span className="regularPrice">
                    <Price
                        currencyCode={productDetails.price.currency}
                        value={product.price.maximalPrice.amount.value}
                    />
                </span>
            </div>
        ) : (
            ''
        );

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

    const productPrice =
        product && product.price && product.price.has_special_price
            ? specialPrice
            : pricePiece;

    const { price, sku, price_tiers } = product || {};

    const review =
        product && product.review_count && product.rating_summary ? (
            <div className="wrapperReviewSum">
                <RewardPointShowing type="review" />
                <section
                    onClick={() => scrollToReview()}
                    className={classes.reviewSum}
                >
                    <StaticRate
                        size={25}
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
                    <span className="submitReview">
                        {formatMessage({
                            id: 'Submit Review',
                            defaultMessage: 'Submit Review'
                        })}
                    </span>
                </section>
            </div>
        ) : (
            <div onClick={() => scrollToReview()} className={classes.noReview}>
                <FormattedMessage
                    id="Be the first to review this product"
                    defaultMessage="Be the first to review this product"
                />
            </div>
        );

    const productStock = isOutOfStock ? (
        <span className="outOfStock">
            <FormattedMessage
                id="productFullDetail.outOfStoc"
                defaultMessage="Out of stock"
            />
        </span>
    ) : (
        <span className="inStock">
            <FormattedMessage id="In stock" defaultMessage="In stock" />
        </span>
    );

    const showPrice = (
        <React.Fragment>
            <div className="wrapperPrice">
                <span
                    style={{ color: configColor.price_color }}
                    className={classes.productPrice}
                >
                    {productPrice}
                </span>
                {productStock}
            </div>
            {price_tiers &&
            Array.isArray(price_tiers) &&
            price_tiers.length > 0 ? (
                <PriceTiers priceTiers={price_tiers} price={price} />
            ) : null}
        </React.Fragment>
    );

    const hidePrice = (
        <div className="wrapperPrice noPrice">{productStock}</div>
    );

    const wrapperPrice = (
        <HidePrice
            showPrice={showPrice}
            hidePrice={hidePrice}
            product={product}
        />
    );

    const wrapperQuantity = (
        <div className="wrapperQuantity">
            <section
                className={!isMobileSite ? classes.quantity : 'mbQuantity'}
            >
                <QuantityFields
                    classes={{ root: classes.quantityRoot }}
                    onChange={handleUpdateQuantity}
                    min={1}
                    message={errors.get('quantity')}
                />
            </section>
        </div>
    );

    const cartAction = (
        <div
            className={
                isAddToCartDisabled || isAddGiftCardProductLoading
                    ? 'addCartDisabled'
                    : 'wrapperActions'
            }
        >
            <section className={classes.actions}>{cartActionContent}</section>
        </div>
    );

    const formError = (
        <div className={classes.wrapperError}>
            <FormError
                classes={{
                    root: classes.formErrors
                }}
                errors={errors.get('form') || []}
            />
        </div>
    );

    const productDetailCarousel = [];
    if (isMobileSite) {
        productDetailCarousel.push(
            <React.Fragment key="element-mobile">
                <div className={classes.headerBtn}>
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
                // labelData={
                //     product.mp_label_data && product.mp_label_data.length > 0
                //         ? product.mp_label_data
                //         : null
                // }
                topInsets={topInsets}
            />
        );
    }

    const addToCartArea = !isMobileSite ? (
        <div
            className={`${
                product.__typename === 'GroupedProduct' ||
                product.__typename === 'BundleProduct'
                    ? 'groupCartAction'
                    : ''
            } quantityCartAction`}
        >
            {wrapperQuantity}
            {cartAction}
        </div>
    ) : null;

    const wrapperAddToCartArea = !isMobileSite ? (
        <HideAddToCartBtn product={product} addToCartBtn={addToCartArea} />
    ) : null;

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
                    formError={
                        <div className={classes.wrapperError}>
                            <FormError
                                classes={{
                                    root: classes.formErrors
                                }}
                                errors={errors.get('form') || []}
                            />
                        </div>
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

                {/* {isMobileSite ? null : breadcrumbs} */}
                <div className="wrapperForm ">
                    <Form
                        className={classes.root}
                        onSubmit={
                            !isMobileSite || !checkIsHidePriceEnable(product)
                                ? product.__typename === 'MpGiftCardProduct'
                                    ? handleAddGiftCardProductToCart
                                    : handleAddToCart
                                : () => {}
                        }
                    >
                        {!isMobileSite ? (
                            <div className="wrapperTitle">
                                <section className={classes.title}>
                                    <h1 className={classes.productName}>
                                        {productDetails.name}
                                        {/* <Pdetailsbrand product={product} /> */}
                                    </h1>
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
                        </section>

                        {!isMobileSite ? (
                            <div className="wrapperOptions">
                                <section
                                    className={`${classes.options} ${
                                        product.__typename ===
                                            'GroupedProduct' ||
                                        product.__typename === 'BundleProduct'
                                            ? 'groupOptions'
                                            : ''
                                    }`}
                                >
                                    {wrapperPrice}
                                    <div className="optionsSizeChart">
                                        {options}
                                    </div>
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
                                </section>
                            </div>
                        ) : null}

                        {/*pop up size chart*/}
                        {enabledSizeChart && display === 0 && !isMobileSite ? (
                            <SizeChart
                                display={display}
                                sizeChartData={sizeChartData}
                                isMobileSite={isMobileSite}
                            />
                        ) : null}
                        {wrapperAddToCartArea}
                        <div className="wrapperWishlist">
                            {!isMobileSite && (
                                <Suspense fallback={null}>
                                    <div className="btnWishlist">
                                        <WishlistButton
                                            {...wishlistButtonProps}
                                        />
                                        <span>
                                            <FormattedMessage
                                                id={'Add to Favourites'}
                                                defaultMessage={
                                                    'Add to Favourites'
                                                }
                                            />
                                        </span>
                                    </div>
                                </Suspense>
                            )}
                        </div>

                        {/*inline size chart web and native*/}
                        {enabledSizeChart && display === 2 ? (
                            <SizeChart
                                display={display}
                                sizeChartData={sizeChartData}
                                isMobileSite={isMobileSite}
                            />
                        ) : null}

                        <div className="productDescription">
                            {!isMobileSite && product.short_description ? (
                                <RichContent
                                    html={product.short_description.html}
                                />
                            ) : null}
                        </div>
                        {!isMobileSite && (
                            <div className={classes.wrapperError}>
                                <FormError
                                    classes={{
                                        root: classes.formErrors
                                    }}
                                    errors={errors.get('form') || []}
                                />
                            </div>
                        )}

                        <div className="sku-share-shop-by-brand">
                            {!isMobileSite ? (
                                <div className="wrapperSku">
                                    <section className={classes.details}>
                                        <span className={classes.detailsTitle}>
                                            <span>
                                                <FormattedMessage
                                                    id={'SKU:'}
                                                    defaultMessage={'SKU:'}
                                                />
                                            </span>
                                            <span>{productDetails.sku}</span>
                                        </span>
                                    </section>
                                </div>
                            ) : null}
                            <RewardPointProduct item={product} type="detail" />
                            <div className="socialShare">
                                <FormattedMessage
                                    id={'Share:'}
                                    defaultMessage={'Share:'}
                                />
                                <SocialShare product={product} />
                            </div>

                            <div className="shopByBrand">
                                <FormattedMessage
                                    id={'Shop by brand:'}
                                    defaultMessage={'Shop by brand:'}
                                />
                                <div>
                                    <Pdetailsbrand product={product} />
                                </div>
                            </div>

                            {/*pop up size chart native*/}
                            {enabledSizeChart &&
                            display === 0 &&
                            isMobileSite ? (
                                <SizeChart
                                    display={display}
                                    sizeChartData={sizeChartData}
                                    isMobileSite={isMobileSite}
                                />
                            ) : null}

                            <div className="wrapperPriceAlertProductDetails">
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
                        </div>

                        {/*Description*/}
                        <div className={classes.wrapperDes}>
                            {/*convert info to tab style*/}
                            {!isMobileSite ? (
                                <>
                                    <div className="button-wrapper">
                                        <button
                                            type="button"
                                            className={
                                                showTab === 0
                                                    ? 'selected-button'
                                                    : 'deselected-button'
                                            }
                                            onClick={() => setShowTab(0)}
                                        >
                                            Description
                                        </button>
                                        <button
                                            type="button"
                                            className={
                                                showTab === 1
                                                    ? 'selected-button'
                                                    : 'deselected-button'
                                            }
                                            onClick={() => setShowTab(1)}
                                        >{`Reviews (${
                                            useProductData(
                                                talonProps.productDetails.sku
                                            ).reviewCount
                                        })`}</button>
                                        {enabledSizeChart && display === 1 && (
                                            <button
                                                type="button"
                                                className={
                                                    showTab === 2
                                                        ? 'selected-button'
                                                        : 'deselected-button'
                                                }
                                                onClick={() => setShowTab(2)}
                                            >
                                                Size Chart
                                            </button>
                                        )}

                                        {/* <button
                                            type="button"
                                            className={
                                                showTab === 3
                                                    ? 'selected-button'
                                                    : 'deselected-button'
                                            }
                                            onClick={() => setShowTab(3)}
                                        >
                                            FAQs
                                        </button> */}
                                        <ButtonFaq
                                            showTab={showTab}
                                            setShowTab={setShowTab}
                                        />
                                    </div>

                                    <div className="show-content">
                                        {showTab === 0 && (
                                            <>
                                                <section
                                                    className={
                                                        classes.description
                                                    }
                                                >
                                                    <RichContent
                                                        html={
                                                            productDetails.description
                                                        }
                                                    />
                                                </section>
                                            </>
                                        )}

                                        {showTab === 1 && (
                                            <>
                                                <ProductReview
                                                    topInsets={topInsets}
                                                    product={product}
                                                    ref={productReview}
                                                />
                                            </>
                                        )}

                                        {/*tab size chart*/}
                                        {showTab === 2 && (
                                            <SizeChart
                                                display={display}
                                                sizeChartData={sizeChartData}
                                                isMobileSite={isMobileSite}
                                            />
                                        )}
                                        {showTab === 3 && (
                                            <FaqProductDetail
                                                urlKey={product?.url_key}
                                                productId={product?.id}
                                            />
                                        )}
                                    </div>
                                </>
                            ) : (
                                /*convert info to tab drop down style on native*/
                                <>
                                    <div className="des-wrapper">
                                        <div className="des-title">
                                            <div style={{ marginTop: 10 }}>
                                                <p
                                                    style={{
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Description
                                                </p>
                                            </div>
                                            <div style={{ marginTop: 15 }}>
                                                {showDes ? (
                                                    <FaChevronUp
                                                        onClick={() =>
                                                            setShowDes(false)
                                                        }
                                                    />
                                                ) : (
                                                    <FaChevronDown
                                                        onClick={() =>
                                                            setShowDes(true)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {showDes && (
                                                <section
                                                    className={
                                                        classes.description
                                                    }
                                                >
                                                    <RichContent
                                                        html={
                                                            productDetails.description
                                                        }
                                                    />
                                                </section>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rev-wrapper">
                                        <div className="rev-title">
                                            <div style={{ marginTop: 5 }}>
                                                <p
                                                    style={{
                                                        fontWeight: 'bold'
                                                    }}
                                                >{`Reviews (${
                                                    useProductData(
                                                        talonProps
                                                            .productDetails.sku
                                                    ).reviewCount
                                                })`}</p>
                                            </div>
                                            <div style={{ marginTop: 10 }}>
                                                {showRev ? (
                                                    <FaChevronUp
                                                        onClick={() =>
                                                            setShowRev(false)
                                                        }
                                                    />
                                                ) : (
                                                    <FaChevronDown
                                                        onClick={() =>
                                                            setShowRev(true)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {showRev && (
                                                <ProductReview
                                                    topInsets={topInsets}
                                                    product={product}
                                                    ref={productReview}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/*tab size chart native*/}
                                    {enabledSizeChart && display === 1 && (
                                        <div className="siz-wrapper">
                                            <div className="siz-title">
                                                <div style={{ marginTop: 5 }}>
                                                    <p
                                                        style={{
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        Size chart
                                                    </p>
                                                </div>
                                                <div style={{ marginTop: 10 }}>
                                                    {showSiz ? (
                                                        <FaChevronUp
                                                            onClick={() =>
                                                                setShowSiz(
                                                                    false
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <FaChevronDown
                                                            onClick={() =>
                                                                setShowSiz(true)
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                {showSiz && (
                                                    <SizeChart
                                                        display={display}
                                                        sizeChartData={
                                                            sizeChartData
                                                        }
                                                        isMobileSite={
                                                            isMobileSite
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {!isMobileSite ? (
                            // <section className={classes.details}>
                            //     <span className={classes.detailsTitle}>
                            //         <FormattedMessage
                            //             id={'SKU'}
                            //             defaultMessage={'SKU'}
                            //         />
                            //     </span>
                            //     <strong>{productDetails.sku}</strong>
                            // </section>
                            ''
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
                                        {/* <Pdetailsbrand product={product} /> */}
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

                {product.hasOwnProperty('custom_attributes') &&
                    product.custom_attributes.length > 0 && (
                        <CustomAttributes
                            customAttributes={product.custom_attributes}
                        />
                    )}

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
                    wrapperPrice={wrapperPrice}
                    product={product}
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
