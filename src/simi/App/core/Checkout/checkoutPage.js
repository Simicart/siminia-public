import React, { useEffect } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useWindowSize, useToasts } from '@magento/peregrine';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from 'src/simi/talons/CheckoutPage/useCheckoutPage';

import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import AddressBook from './AddressBook';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import PriceAdjustments from './PriceAdjustments';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';
import OrderConfirmationPage from './OrderConfirmationPage';
import ItemsReview from './ItemsReview';

import CheckoutPageOperations from './checkoutPage.gql.js';

import { mergeClasses } from 'src/classify';

import defaultClasses from './checkoutPage.css';

import TitleHelper from 'src/simi/Helper/TitleHelper'
import Identify from 'src/simi/Helper/Identify'
import { Link, Redirect } from 'src/drivers';
import TitleNumber from './titleNumber';
import ReactLoading from 'src/simi/BaseComponents/Loading/ReactLoading';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

const CheckoutPage = props => {
    const { classes: propClasses } = props;
    const talonProps = useCheckoutPage({
        ...CheckoutPageOperations
    });

    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        checkoutStep,
        customer,
        error,
        handleSignIn,
        handlePlaceOrder,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        setCheckoutStep,
        setIsUpdating,
        shippingMethodSelected,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        isVirtual,
        toggleActiveContent
    } = talonProps;

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : Identify.__('Oops! An error occurred while submitting. Please try again.');

            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, hasError]);

    useEffect(() => {
        if (
            (checkoutStep === CHECKOUT_STEP.REVIEW) && !isUpdating &&
            !placeOrderLoading && !orderDetailsLoading && !orderNumber && !isCartEmpty && !isLoading
            && !orderDetailsData
        ) {
            handlePlaceOrder();
        }
    }, [checkoutStep, isUpdating, placeOrderLoading, orderDetailsLoading, handlePlaceOrder, orderNumber, isCartEmpty, isLoading, orderDetailsData])

    const classes = mergeClasses(defaultClasses, propClasses);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 960;

    let checkoutContent;
    
    if (orderNumber) {
        if (
            orderDetailsData && orderDetailsData.cart && orderDetailsData.cart.items
            && orderDetailsData.cart.items.length
        ) {
            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'simi_last_success_order_data', orderDetailsData)
            window.history.pushState('', '', '/checkout.html?lastOrderId=' + orderNumber)
        }
        const lastSuccessOrderData = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'simi_last_success_order_data')
        return (
            <OrderConfirmationPage
                data={lastSuccessOrderData ? lastSuccessOrderData : orderDetailsData}
                orderNumber={orderNumber}
            />
        );
    } else if (!Identify.isEnabledCheckoutAsGuest() && isGuestCheckout) {
        return <Redirect to="/login.html" />
    } else if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {isGuestCheckout ? Identify.__('Guest Checkout') : Identify.__('Checkout')}
                    </h1>
                </div>
                <h3>{Identify.__('There are no items in your cart.')}</h3>
            </div>
        );
    } else {
        const loginButton = isGuestCheckout ? (
            <div className={classes.signin_container}>
                <Link className={classes.sign_in} to={{ pathname: '/login.html', state: { checkout: true } }}>
                    {Identify.__('Login and Checkout Faster')}
                </Link>
            </div>
        ) : null;

        const shippingMethodSection = <ShippingMethod
            pageIsUpdating={isUpdating}
            onSave={setShippingMethodDone}
            setPageIsUpdating={setIsUpdating}
        />;

        const paymentInformationSection = (
            <React.Fragment>
                <div className={classes.paymentInfoTitle}>{Identify.__('Payment Information')}</div>
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                />
            </React.Fragment>

        );

        const priceAdjustmentsSection = (
            <div className={classes.price_adjustments_container}>
                <PriceAdjustments setPageIsUpdating={setIsUpdating} />
            </div>
        );

        const reviewOrderButton =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <Button
                    onClick={handleReviewOrder}
                    priority="high"
                    className={`${classes.review_order_button} ${(isLoading || placeOrderLoading || orderDetailsLoading || !shippingMethodSelected) ? classes.review_order_button_loading : ''}`}
                    disabled={reviewOrderButtonClicked || isUpdating || (!shippingMethodSelected && !isVirtual)}
                >
                    {
                        (placeOrderLoading || orderDetailsLoading || reviewOrderButtonClicked) ?
                            <ReactLoading divStyle={{ marginTop: 0, position: 'absolute', top: 5, left: 0, height: 45 }} loadingStyle={{ height: 45, fill: 'white' }} /> :
                            Identify.__('Place Order')
                    }
                </Button>
            ) : null;

        const itemsReview = <div className={classes.items_review_container}>
            <ItemsReview orderNumber={orderNumber} />
        </div>

        const orderSummary = <div className={classes.summaryContainer}>
            <OrderSummary isUpdating={isUpdating} />
        </div>

        const checkoutContentClass =
            activeContent === 'checkout'
                ? classes.checkoutContent
                : classes.checkoutContent_hidden;

        checkoutContent = (
            <div className={checkoutContentClass}>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {Identify.__('Checkout')}
                    </h1>
                    <div className={classes.heading_strike} />
                </div>
                {loginButton}
                <div className={`${classes["simi-checkout-column"]} ${isVirtual && classes["simi-checkout-page-virtual"]}`}>
                    {
                        isVirtual ?
                            <React.Fragment>
                                <div className={classes["checkout-col-1"]}>
                                    <div className={classes.payment_information_container}>
                                        {paymentInformationSection}
                                    </div>
                                </div>
                                <div className={classes["checkout-col-2"]}>
                                    {priceAdjustmentsSection}
                                </div>
                            </React.Fragment> :
                            <React.Fragment>
                                <div className={classes["checkout-col-1"]}>
                                    <div className={classes.shipping_information_container}>
                                        <TitleNumber number={1} />
                                        <ShippingInformation
                                            onSave={setShippingInformationDone}
                                            toggleActiveContent={toggleActiveContent}
                                        />
                                    </div>
                                </div>
                                <div className={classes["checkout-col-2"]}>
                                    <div className={classes.shipping_method_container}>
                                        <TitleNumber number={2} />
                                        {shippingMethodSection}
                                    </div>
                                    <div className={classes.payment_information_container}>
                                        <TitleNumber number={3} />
                                        {paymentInformationSection}
                                    </div>
                                    {priceAdjustmentsSection}
                                </div>
                            </React.Fragment>
                    }
                    <div className={classes["checkout-col-3"]}>
                        <h3 className={classes["checkout-order-summery-title"]}>{'Order Summary'}</h3>
                        {itemsReview}
                        {orderSummary}
                        {reviewOrderButton}
                        {/* {placeOrderButton} */}
                    </div>
                </div>
            </div >
        );
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleActiveContent}
        />
    ) : null;

    return (
        <div className={`${classes.root} container`}>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Checkout')
            })}
            {checkoutContent}
            {addressBookElement}
        </div>
    );
};

export default CheckoutPage;
