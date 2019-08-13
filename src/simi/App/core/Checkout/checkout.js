import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import {
    array,
    bool,
    func,
    number,
    object,
    oneOf,
    shape,
    string
} from 'prop-types';
import {
    getCartDetails
} from 'src/actions/cart';

import {
    beginCheckout,
    cancelCheckout,
    editOrder,
    /* submitOrder, */
    /* submitShippingMethod, */
    submitPaymentMethod
} from 'src/actions/checkout';

import { submitShippingAddress, submitBillingAddress, submitOrder, submitShippingMethod } from 'src/simi/Redux/actions/simiactions';

import classify from 'src/classify';
import defaultClasses from './checkout.css';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb";
import OrderSummary from "./OrderSummary/index";
import { configColor } from 'src/simi/Config';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import { Link } from 'react-router-dom';
import isObjectEmpty from 'src/util/isObjectEmpty';
import EditableForm from './editableForm';
import Panel from 'src/simi/BaseComponents/Panel';
import { toggleMessages, simiSignedIn } from 'src/simi/Redux/actions/simiactions';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Loading from 'src/simi/BaseComponents/Loading';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import Coupon from 'src/simi/BaseComponents/Coupon';


const isCheckoutReady = checkout => {
    const {
        billingAddress,
        paymentData,
        shippingAddress,
        shippingMethod
    } = checkout;

    const objectsHaveData = [
        billingAddress,
        paymentData,
        shippingAddress
    ].every(data => {
        return !!data && !isObjectEmpty(data);
    });

    const stringsHaveData = shippingMethod && shippingMethod.length > 0;

    return objectsHaveData && stringsHaveData;
};

class Checkout extends Component {
    static propTypes = {
        beginCheckout: func,
        cancelCheckout: func,
        cart: shape({
            details: shape({
                items_count: number
            })
        }),
        checkout: shape({
            availableShippingMethods: array,
            billingAddress: object,
            editing: oneOf(['address', 'billingAddress', 'paymentMethod', 'shippingMethod']),
            invalidAddressMessage: string,
            isAddressInvalid: bool,
            paymentCode: string,
            paymentData: object,
            shippingAddress: object,
            shippingMethod: string,
            shippingTitle: string,
            step: oneOf(['cart', 'form', 'receipt']).isRequired,
            submitting: bool
        }).isRequired,
        classes: shape({
            root: string
        }),
        directory: object,
        editOrder: func,
        submitOrder: func,
        submitPaymentMethod: func,
        submitShippingAddress: func,
        submitShippingMethod: func,
        submitBillingAddress: func,
        user: object,
        simiSignedIn: func
    };

    constructor(...args) {
        super(...args);
        const isPhone = window.innerWidth < 1024;
        this.state = {
            isPhone: isPhone
        };
        const storeConfig = Identify.getStoreConfig();
        this.checkoutRedirect(storeConfig);
    }

    setIsPhone() {
        const obj = this;
        window.onresize = function () {
            const width = window.innerWidth;
            const isPhone = width < 1024
            if (obj.state.isPhone !== isPhone) {
                obj.setState({ isPhone: isPhone })
            }
        }
    }

    async componentDidMount() {
        const { props, setIsPhone, check3DSecure } = this;
        setIsPhone();

        const { beginCheckout, getCartDetails } = props;

        try {
            // get cart detail
            await getCartDetails();

            //beginning checkout
            await beginCheckout();

            await check3DSecure();
            // Do something
        } catch (err) {
            console.log(err)
        }
    }

    check3DSecure = () => {
        const { convertUrlQuery, props } = this;
        const { submitPaymentMethod } = props;
        const query = convertUrlQuery();
        const cc_3DSecure_stripe = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'cc_3DSecure_stripe');
        if (query.hasOwnProperty('confirmed_3d_secure') && query.confirmed_3d_secure === 'stripe' && cc_3DSecure_stripe && !isObjectEmpty(cc_3DSecure_stripe)) {
            cc_3DSecure_stripe.data['three_d_client_secret'] = query.client_secret;
            cc_3DSecure_stripe.data['three_d_src'] = query.source;
            submitPaymentMethod(cc_3DSecure_stripe);
        }
    }

    convertUrlQuery = () => {
        const params = new URLSearchParams(window.location.search)
        let json = {}
        for (const param of params.entries()) {
            const [key, value] = param;
            json[key] = value
        }
        return json
    }

    get breadcrumb() {
        return <BreadCrumb breadcrumb={[{ name: 'Home', link: '/' }, { name: 'Basket', link: '/cart.html' }, { name: 'Checkout', link: '/checkout.html' }]} />
    }

    get pageTitle() {
        return <div className={defaultClasses['checkout-page-title']}>{Identify.__("Checkout")}</div>;
    }

    handleLink(link) {
        this.props.history.push(link)
    }

    get cartDetail() {
        const { cart } = this.props;

        return cart && cart.details && cart.details.items && cart.details.items.length;
    }

    get cartCurrencyCode() {
        const { cart } = this.props;
        return (
            cart &&
            cart.details &&
            cart.details.currency &&
            cart.details.currency.quote_currency_code
        );
    }

    get userSignedIn() {
        const { user } = this.props;
        return user && user.isSignedIn;
    }

    placeOrder = () => {
        const { submitOrder, checkout, toggleMessages, cart, history } = this.props;
        const { paymentData, shippingAddress, shippingMethod, billingAddress } = checkout;

        if (toggleMessages) {
            if (!shippingAddress || isObjectEmpty(shippingAddress)) {
                smoothScrollToView($("#id-message"));
                toggleMessages([{ type: 'error', message: Identify.__('Please choose a shipping address'), auto_dismiss: true }])
                return;
            }
            if (!billingAddress || isObjectEmpty(billingAddress)) {
                smoothScrollToView($("#id-message"));
                toggleMessages([{ type: 'error', message: Identify.__('Please choose a billing address'), auto_dismiss: true }])
                return;
            }
            if (!cart.is_virtual && (!shippingMethod || !shippingMethod.length)) {
                smoothScrollToView($("#id-message"));
                toggleMessages([{ type: 'error', message: Identify.__('Please choose a shipping method '), auto_dismiss: true }])
                return;
            }
            if (!paymentData || isObjectEmpty(paymentData)) {
                smoothScrollToView($("#id-message"));
                toggleMessages([{ type: 'error', message: Identify.__('Please choose a payment method'), auto_dismiss: true }])
                return;
            }
        }

        if (isCheckoutReady(checkout)) {
            if (paymentData && paymentData.value === 'paypal_express')
                history.push('/paypal_express.html')
            else {
                showFogLoading();
                submitOrder();
            }
        }
        return;
    }

    get btnPlaceOrder() {
        const { classes } = this.props;
        return (
            <div className={defaultClasses['btn-place-order']}>
                <Colorbtn
                    style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color, width: '100%' }}
                    className={classes["go-place_order"]}
                    onClick={() => this.placeOrder()} text={Identify.__('PLACE ORDER')} />
            </div>
        )
    }

    get checkoutEmpty() {
        const { classes } = this.props;

        return <div className={classes['empty-cart-checkout']}>
            <span>{Identify.__("You have no items in your shopping cart.")}</span>
            <br />
            <span>
                {Identify.__('Click')}
                <Link to={'/'} >{Identify.__('here')}</Link>
                {Identify.__('to continue shopping.')}
            </span>
        </div>
    }

    checkoutRedirect = (merchant) => {
        const { user, history } = this.props;
        const { isSignedIn } = user;

        const guest_checkout = merchant && merchant.simiStoreConfig.config.checkout.enable_guest_checkout ? merchant.simiStoreConfig.config.checkout.enable_guest_checkout : 1;
        if (!isSignedIn && parseInt(guest_checkout, 10) === 0) {
            const location = {
                pathname: '/login.html',
                pushTo: '/checkout.html'
            };
            history.push(location);
        }
    }

    get checkoutInner() {
        const { props, cartCurrencyCode, checkoutEmpty, btnPlaceOrder, cartDetail, userSignedIn, breadcrumb, pageTitle } = this;
        const { isPhone } = this.state;
        const containerSty = isPhone ? { marginTop: 35 } : {};
        const { classes,
            cart,
            checkout,
            directory,
            editOrder,
            submitShippingMethod,
            submitShippingAddress,
            submitOrder,
            submitPaymentMethod,
            submitBillingAddress,
            user,
            simiSignedIn,
            toggleMessages,
            getCartDetails } = props;
        const { shippingAddress,
            submitting,
            availableShippingMethods,
            shippingMethod,
            billingAddress,
            paymentData,
            paymentCode,
            invalidAddressMessage,
            isAddressInvalid,
            shippingTitle } = checkout;

        const { cartId, isLoading, paymentMethods, is_virtual } = cart;
        const { editing } = checkout;

        const stepProps = {
            availableShippingMethods,
            billingAddress,
            cancelCheckout,
            cart,
            directory,
            editOrder,
            editing,
            hasPaymentMethod: !!paymentData && !isObjectEmpty(paymentData),
            hasShippingAddress:
                !!shippingAddress && !isObjectEmpty(shippingAddress),
            hasShippingMethod:
                !!shippingMethod && !isObjectEmpty(shippingMethod),
            invalidAddressMessage,
            isAddressInvalid,
            paymentCode,
            paymentData,
            ready: isCheckoutReady(checkout),
            shippingAddress,
            shippingMethod,
            shippingTitle,
            submitShippingAddress,
            submitOrder,
            submitPaymentMethod,
            submitBillingAddress,
            submitShippingMethod,
            submitting,
            paymentMethods,
            user,
            simiSignedIn,
            toggleMessages,
            cartCurrencyCode
        };

        let cpValue = "";
        if (cart.totals.coupon_code) {
            cpValue = cart.totals.coupon_code;
        }

        const childCPProps = {
            classes,
            value: cpValue,
            toggleMessages,
            getCartDetails
        }

        if (checkout.step && checkout.step === 'receipt') {
            sessionStorage.removeItem('cc_card_data');
            sessionStorage.removeItem('cc_3DSecure_stripe');
            const locate = {
                pathname: '/thankyou.html',
                state: {
                    isUserSignedIn: userSignedIn
                }
            };
            this.handleLink(locate);
        }
        
        if (!isCheckoutReady(checkout)) {
            hideFogLoading();
        }

        const cartLoading = (!cartDetail && cartId && !isLoading && (!cart.details || !cart.details.item))
        
        return <Fragment>
            {breadcrumb}
            {pageTitle}
            {!cartDetail ? cartLoading ? checkoutEmpty : <Loading /> : 
                (
                <div className={defaultClasses['checkout-column']}>
                    <div className={defaultClasses[`checkout-col-1`]}>
                        <Panel title={<div className={defaultClasses['checkout-section-title']}>{Identify.__('Shipping Address')}</div>}
                            renderContent={<EditableForm {...stepProps} editing='address' />}
                            isToggle={true}
                            expanded={true}
                            headerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        />
                    </div>
                    <div className={defaultClasses[`checkout-col-2`]}>
                        <Panel title={<div className={defaultClasses['checkout-section-title']}>{Identify.__('Billing Information')}</div>}
                            renderContent={<EditableForm {...stepProps} editing='billingAddress' />}
                            isToggle={true}
                            expanded={true}
                            containerStyle={containerSty}
                            headerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        />

                        {!is_virtual && <Panel title={<div className={defaultClasses['checkout-section-title']}>{Identify.__('Shipping Method')}</div>}
                            renderContent={<EditableForm {...stepProps} editing='shippingMethod' />}
                            isToggle={true}
                            expanded={true}
                            containerStyle={{ marginTop: 35 }}
                            headerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        />}

                        <Panel title={<div className={defaultClasses['checkout-section-title']}>{Identify.__('Payment Method')}</div>}
                            renderContent={<EditableForm {...stepProps} editing='paymentMethod' />}
                            isToggle={true}
                            expanded={true}
                            containerStyle={{ marginTop: 35 }}
                            headerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        />

                        <Panel title={<div className={defaultClasses['checkout-section-title']}>{Identify.__('Coupon Code')}</div>}
                            renderContent={<Coupon {...childCPProps} />}
                            isToggle={true}
                            expanded={false}
                            containerStyle={{ marginTop: 35 }}
                            headerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        />

                    </div>
                    <div className={defaultClasses[`checkout-col-3`]}>
                        <div className={defaultClasses['col-3-content']}>
                            <OrderSummary parent={this} isPhone={isPhone} cart={cart} cartCurrencyCode={cartCurrencyCode} checkout={checkout} />
                            {btnPlaceOrder}
                        </div>
                    </div>
                </div>
                )
            }
        </Fragment>
    }

    render() {
        return (
            <div className="container">
                {TitleHelper.renderMetaHeader({
                    title: Identify.__('Checkout')
                })}
                {this.checkoutInner}
            </div>
        );
    }
}

const mapStateToProps = ({ cart, checkout, directory, user }) => ({
    cart,
    checkout,
    directory,
    user
});

const mapDispatchToProps = {
    getCartDetails,
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitShippingMethod,
    submitBillingAddress,
    submitPaymentMethod,
    toggleMessages,
    simiSignedIn
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Checkout);
