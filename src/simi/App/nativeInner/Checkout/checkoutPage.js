import React, { Fragment, useEffect, useRef, useState } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertCircle as AlertCircleIcon, ArrowLeft as ArrowLeftIcon } from 'react-feather';
import { Link, Redirect } from 'react-router-dom';

import { useWindowSize, useToasts } from '@magento/peregrine';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';
import FormError from '@magento/venia-ui/lib/components/FormError';
import AddressBook from './AddressBook';
import GuestSignIn from './GuestSignIn';
import PaymentInformation from './PaymentInformation';
import payments from './PaymentInformation/paymentMethodCollection';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';
// import OrderConfirmationPage from '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage';
import ItemsReview from './ItemsReview';

import defaultClasses from './checkoutPage.module.css';
import ScrollAnchor from '@magento/venia-ui/lib/components/ScrollAnchor/scrollAnchor';
import DeliveryDateTime from './DeliveryDateTime';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
const errorIcon = <Icon src={AlertCircleIcon} size={20} />;
import OrderSummary from './OrderSummary/orderSummary';
import PriceAdjustments from './PriceAdjustments';

import Identify from 'src/simi/Helper/Identify';
import ButtonLoader from '../../../BaseComponents/ButtonLoader';
import {configColor} from "../../../Config";
import Image from "@magento/venia-ui/lib/components/Image";

const deliveryTimeEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME) === 1;

require('./checkoutPage.scss');
const CheckoutPage = props => {
    const { classes: propClasses, history } = props;
    const { formatMessage } = useIntl();
    const talonProps = useCheckoutPage();
    const [openDeli, setOpenDeli] = useState(false);

    const [{ cartId }] = useCartContext();

    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        availablePaymentMethods,
        cartItems,
        checkoutStep,
        customer,
        error,
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
        setShippingInformationDone,
        scrollShippingInformationIntoView,
        setShippingMethodDone,
        scrollShippingMethodIntoView,
        setPaymentInformationDone,
        shippingInformationRef,
        shippingMethodRef,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        toggleAddressBookContent,
        toggleSignInContent
    } = talonProps;

    const deliveryDateTime = useRef(null);

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : formatMessage({
                          id: 'checkoutPage.errorSubmit',
                          defaultMessage:
                              'Oops! An error occurred while submitting. Please try again.'
                      });
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
    }, [addToast, error, formatMessage, hasError]);

    useEffect(() => {
        const svgSelector = document.querySelector('#siminia-text-header svg')
        const titleSelector = document.querySelector('#siminia-text-header span')
        switch(activeContent) {
            case 'addressBook':
                if(svgSelector) svgSelector.style.display = 'none'
                if(titleSelector) titleSelector.innerHTML = "Change Shipping Information"
                break
            case 'signIn':
                if(svgSelector) svgSelector.style.display = 'none'
                if(titleSelector) titleSelector.innerHTML = "Change Shipping Information"
                break
            default: 
                if(svgSelector) svgSelector.style.display = 'flex'
                if(titleSelector) titleSelector.innerHTML = "Checkout"
            // case 'addressBook':
            //     if(svgSelector) svgSelector.style.display = 'none'
            //     if(titleSelector) titleSelector.innerHTML = ""
            //     break
        }
            
        return () => {
            if(svgSelector) svgSelector.style.display = 'flex'
            if(titleSelector) titleSelector.innerHTML = "Checkout"
        }
    }, [activeContent])

    const classes = useStyle(defaultClasses, propClasses);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 450;

    let checkoutContent;

    const heading =
        formatMessage({
            id: 'checkoutPage.checkout',
            defaultMessage: 'Checkout'
        });

    if (orderNumber && orderDetailsData) {
        const selectedPaymentMethod = Identify.getDataFromStoreage(
            Identify.LOCAL_STOREAGE,
            'simi_selected_payment_code'
        );
        Identify.storeDataToStoreage(
            Identify.SESSION_STOREAGE,
            'simi_last_success_order_data',
            orderDetailsData
        );
        Identify.storeDataToStoreage(
            Identify.LOCAL_STOREAGE,
            'simi_last_success_order_data_id',
            orderNumber
        );
        if (selectedPaymentMethod === 'myfatoorah_gateway') {
            const storeConfig = Identify.getStoreConfig();
            if (
                storeConfig &&
                storeConfig.storeConfig &&
                storeConfig.storeConfig.base_url
            )
                window.location.replace(
                    storeConfig.storeConfig.base_url +
                        '/myfatoorah/checkout/index?gateway=myfatoorah&order_id=' +
                        orderNumber
                );
            return '';
        }
        return <Redirect to={`/checkout-success?orderNumber=${orderNumber}`} />;
        /*
        return (
            <OrderConfirmationPage
                data={orderDetailsData}
                orderNumber={orderNumber}
            />
        );
        */
    } else if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                {!isMobile && <div className={classes.heading_container}>
                    <h1 className={classes.heading}>{heading}</h1>
                </div>}
                {isMobile && <Image src={require('../../../../../static/images/empty-cart.png')}
                   alt={'no-cart'}
                    className={classes.emptyImage}
                />}
                <h3>
                    <FormattedMessage
                        id={'checkoutPage.emptyMessage'}
                        defaultMessage={'There are no items in your cart.'}
                    />
                </h3>
                {isMobile && <button 
                    onClick={() => history.push('/')} 
                    className={classes.emptyCartButton}
                    style={{
                        backgroundColor: configColor.button_background,
                        color: configColor.button_text_color,
                    }}
                >
                    <FormattedMessage
                        id={'Continue Shopping'}
                        defaultMessage={'Continue Shopping'}
                    />
                </button>}
            </div>
        );
    } else {
        const signInContainerElement = isGuestCheckout ? (
            <div className={classes.signInContainer}>
                <span className={classes.signInLabel}>
                    <FormattedMessage
                        id={'checkoutPage.signInLabel'}
                        defaultMessage={'Sign in for Express Checkout'}
                    />
                </span>
                <Button
                    className={classes.signInButton}
                    onClick={toggleSignInContent}
                    priority="normal"
                >
                    <FormattedMessage
                        id={'checkoutPage.signInButton'}
                        defaultMessage={'Sign In'}
                    />
                </Button>
            </div>
        ) : null;

        const shippingMethodSection =
            checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                <>
                    <ShippingMethod
                        pageIsUpdating={isUpdating}
                        onSave={setShippingMethodDone}
                        onSuccess={scrollShippingMethodIntoView}
                        setPageIsUpdating={setIsUpdating}
                    />
                    {deliveryTimeEnabled ? (
                        <React.Fragment>
                            <div className="main-delivery">
                                <label className="check-container">
                                    {formatMessage({ id: 'Delivery Time' })}
                                    <input
                                        onClick={() => setOpenDeli(!openDeli)}
                                        type="checkbox"
                                    />
                                    <span className="checkmark" />
                                </label>
                            </div>
                            {openDeli ? (
                                <DeliveryDateTime ref={deliveryDateTime} />
                            ) : null}
                        </React.Fragment>
                    ) : (
                        ''
                    )}
                </>
            ) : (
                <h3 className={classes.shipping_method_heading}>
                    <FormattedMessage
                        id={'checkoutPage.shippingMethodStep'}
                        defaultMessage={'2. Shipping Method'}
                    />
                </h3>
            );

        const formErrors = [];
        const paymentMethods = Object.keys(payments);

        // If we have an implementation, or if this is a "zero" checkout,
        // we can allow checkout to proceed.
        const isPaymentAvailable = !!availablePaymentMethods.find(
            ({ code }) => code === 'free' || paymentMethods.includes(code)
        );

        if (!isPaymentAvailable) {
            formErrors.push(
                new Error(
                    formatMessage({
                        id: 'checkoutPage.noPaymentAvailable',
                        defaultMessage: 'Payment is currently unavailable.'
                    })
                )
            );
        }

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                />
            ) : (
                <h3 className={classes.payment_information_heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformationStep'}
                        defaultMessage={'3. Payment Information'}
                    />
                </h3>
            );

        const priceAdjustmentsSection =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <div className={classes.price_adjustments_container}>
                    <PriceAdjustments setPageIsUpdating={setIsUpdating} />
                </div>
            ) : null;

        const reviewOrderButtonType =
            reviewOrderButtonClicked || isUpdating || !isPaymentAvailable ? (
                <ButtonLoader classes={classes.loader_button} />
            ) : (
                <Button
                    onClick={handleReviewOrder}
                    priority="high"
                    className={classes.review_order_button}
                    disabled={
                        reviewOrderButtonClicked ||
                        isUpdating ||
                        !isPaymentAvailable
                    }
                >
                    <FormattedMessage
                        id={'checkoutPage.reviewOrder'}
                        defaultMessage={'Review Order'}
                    />
                </Button>
            );

        const reviewOrderButton =
            checkoutStep === CHECKOUT_STEP.PAYMENT
                ? reviewOrderButtonType
                : null;

        const itemsReview =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <div className={classes.items_review_container}>
                    <ItemsReview />
                </div>
            ) : null;

        const placeOrderButton =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <Button
                    onClick={e => {
                        const selectedPaymentMethod = Identify.getDataFromStoreage(
                            Identify.LOCAL_STOREAGE,
                            'simi_selected_payment_code'
                        );

                        if (selectedPaymentMethod === 'paypal_express') {
                            history.push('/paypal_express.html');
                            return;
                        }
                        handlePlaceOrder(e);
                    }}
                    priority="high"
                    className={classes.place_order_button}
                    disabled={
                        isUpdating || placeOrderLoading || orderDetailsLoading
                    }
                >
                    <FormattedMessage
                        id={'checkoutPage.placeOrder'}
                        defaultMessage={'Place Order'}
                    />
                </Button>
            ) : null;

        // If we're on mobile we should only render price summary in/after review.
        const shouldRenderPriceSummary = !(
            isMobile && checkoutStep < CHECKOUT_STEP.REVIEW
        );

        const orderSummary = shouldRenderPriceSummary ? (
            <div className={classes.summaryContainer}>
                <OrderSummary isUpdating={isUpdating} />
            </div>
        ) : null;

        let headerText;

        if (isGuestCheckout) {
            headerText = formatMessage({
                id: 'checkoutPage.guestCheckout',
                defaultMessage: 'Guest Checkout'
            });
        } else if (customer.default_shipping) {
            headerText = formatMessage({
                id: 'checkoutPage.reviewAndPlaceOrder',
                defaultMessage: 'Review and Place Order'
            });
        } else {
            headerText = formatMessage(
                { id: 'checkoutPage.greeting', defaultMessage: 'Welcome' },
                { firstname: customer.firstname }
            );
        }

        const checkoutContentClass =
            activeContent === 'checkout'
                ? classes.checkoutContent
                : classes.checkoutContent_hidden;

        const stockStatusMessageElement = (
            <Fragment>
                <FormattedMessage
                    id={'checkoutPage.stockStatusMessage'}
                    defaultMessage={
                        'An item in your cart is currently out-of-stock and must be removed in order to Checkout. Please return to your cart to remove the item.'
                    }
                />
                <Link className={classes.cartLink} to={'/cart'}>
                    <FormattedMessage
                        id={'checkoutPage.returnToCart'}
                        defaultMessage={'Return to Cart'}
                    />
                </Link>
            </Fragment>
        );
        checkoutContent = (
            <div className={checkoutContentClass}>
                <div className={classes.heading_container}>
                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={formErrors}
                    />
                    <StockStatusMessage
                        cartItems={cartItems}
                        message={stockStatusMessageElement}
                    />
                    {!isMobile && <h1 className={classes.heading}>{headerText}</h1>}
                </div>
                {signInContainerElement}
                <div className={classes.shipping_information_container}>
                    <ScrollAnchor ref={shippingInformationRef}>
                        <ShippingInformation
                            onSave={setShippingInformationDone}
                            onSuccess={scrollShippingInformationIntoView}
                            toggleActiveContent={toggleAddressBookContent}
                        />
                    </ScrollAnchor>
                </div>
                <div className={classes.shipping_method_container}>
                    <ScrollAnchor ref={shippingMethodRef}>
                        {shippingMethodSection}
                    </ScrollAnchor>
                </div>
                <div className={classes.payment_information_container}>
                    {paymentInformationSection}
                </div>
                {priceAdjustmentsSection}
                {reviewOrderButton}
                {itemsReview}
                {orderSummary}
                {placeOrderButton}
                {/* <button onClick={()=>deliveryDateTime.current.handleSubmit()}>tesst</button> */}
            </div>
        );
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleAddressBookContent}
            onSuccess={scrollShippingInformationIntoView}
        />
    ) : null;

    const signInElement = isGuestCheckout ? (
        <GuestSignIn
            isActive={activeContent === 'signIn'}
            toggleActiveContent={toggleSignInContent}
        />
    ) : null;

    return (
        <div className={`${classes.root} checkout-step-${checkoutStep}`}>
            <StoreTitle>
                {formatMessage({
                    id: 'checkoutPage.titleCheckout',
                    defaultMessage: 'Checkout'
                })}
            </StoreTitle>
            {checkoutContent}
            {addressBookElement}
            {signInElement}
        </div>
    );
};

export default CheckoutPage;

CheckoutPage.propTypes = {
    classes: shape({
        root: string,
        checkoutContent: string,
        checkoutContent_hidden: string,
        heading_container: string,
        heading: string,
        cartLink: string,
        stepper_heading: string,
        shipping_method_heading: string,
        payment_information_heading: string,
        signInContainer: string,
        signInLabel: string,
        signInButton: string,
        empty_cart_container: string,
        shipping_information_container: string,
        shipping_method_container: string,
        payment_information_container: string,
        price_adjustments_container: string,
        items_review_container: string,
        summaryContainer: string,
        formErrors: string,
        review_order_button: string,
        place_order_button: string
    })
};
