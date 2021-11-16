import React, { useEffect, useCallback } from 'react';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify'
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';
import PAYPAL_TOKEN_MUTATION from 'src/simi/queries/payment/createPaypalExpressToken.graphql';
import PAYPAL_SETPAYPMENT_MUTATION from 'src/simi/queries/payment/setPaymentMethodOnCart.graphql';
import PLACE_ORDER_MUTATION from 'src/simi/queries/payment/placeOrderMutation.graphql';
import SET_GUEST_EMAIL_MUTATION from 'src/simi/queries/payment/setGuestEmailOnCartMutation.graphql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory } from 'react-router-dom';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useApolloClient } from '@apollo/client';

const PaypalExpress = props => {
    const { toggleMessages } = props;
    const history = useHistory()
    const [cartData, { removeCart }] = useCartContext();
    const { details } = cartData
    const [user] = useUserContext();
    const apolloClient = useApolloClient();

    const { cartId } = cartData
    const { email } = cartData.details
    const isUserSignedIn = user && user.isSignedIn

    let tokenDataGraphql = {};
    const [createToken, {
        data: tokenData,
        loading: createTokenLoading,
        error: createTokenError,
        called: createTokenCalled
    }] = useMutation(PAYPAL_TOKEN_MUTATION);
    if (tokenData && tokenData.createPaypalExpressToken) tokenDataGraphql = tokenData.createPaypalExpressToken;

    let dataSetPaymentGraphql = {};
    const [setPaymentMethodOnCart, {
        data: dataSetPayment,
        loading: setPaymentLoading,
        error: setPaymentError,
        called: setPaymentCalled
    }] = useMutation(PAYPAL_SETPAYPMENT_MUTATION);
    if (dataSetPayment && dataSetPayment.setPaymentMethodOnCart) dataSetPaymentGraphql = dataSetPayment.setPaymentMethodOnCart;

    const [placeOrder, {
        data: placeOrderData,
        loading: placeOrderLoading,
        error: placeOrderError,
        called: placeOrderCalled
    }] = useMutation(PLACE_ORDER_MUTATION);

    const [setGuestEmailOnCart, {
        data: emailOnCartData,
        loading: emailOnCartLoading,
        error: emailOnCartError,
        called: emailOnCartCalled
    }] = useMutation(SET_GUEST_EMAIL_MUTATION);


    const updateGuestEmailOnCart = useCallback(opts => {
        setGuestEmailOnCart(opts)
    }, [setGuestEmailOnCart])

    useEffect(() => {
        hideFogLoading()
        if (createTokenError) {
            const errorMessage = createTokenError.message && createTokenError.message.replace('GraphQL error: ', '') || '';
            toggleMessages([{ type: 'error', message: Identify.__('Payment error.') + ' ' + errorMessage, auto_dismiss: true }])
            history.push('/cart.html')
            return;
        }

        if (setPaymentError) {
            const errorMessage = setPaymentError.message && setPaymentError.message.replace('GraphQL error: ', '') || '';
            toggleMessages([{ type: 'error', message: Identify.__('Payment error.') + ' ' + errorMessage, auto_dismiss: true }])
            history.push('/cart.html')
            return;
        }

        if (placeOrderError) {
            const errorMessage = placeOrderError.message && placeOrderError.message.replace('GraphQL error: ', '') || '';
            toggleMessages([{ type: 'error', message: Identify.__('Payment error.') + ' ' + errorMessage, auto_dismiss: true }])
            history.push('/')
            return;
        }
    }, [createTokenError, setPaymentError, placeOrderError, history, toggleMessages])

    useEffect(() => {
        if (cartId) {
            if (!placeOrderCalled && !createTokenLoading && createTokenCalled
                && tokenDataGraphql.token && tokenDataGraphql.paypal_urls && tokenDataGraphql.paypal_urls.start) {
                window.location.replace(tokenDataGraphql.paypal_urls.start);
                hideFogLoading()
                return;
            }

            if (!placeOrderLoading && placeOrderCalled && placeOrderData) {
                hideFogLoading();
                const data = placeOrderData
                if (data && data.placeOrder && data.placeOrder.order && data.placeOrder.order.order_number) {
                    removeCart();
                    clearCartDataFromCache(apolloClient);
                    history.push('/checkout.html?lastOrderId=' + data.placeOrder.order.order_number)
                } else {
                    if (data.errors && data.errors.length) {
                        data.errors.map(error => {
                            alert(error.message)
                        });
                    }
                    toggleMessages([{ type: 'error', message: Identify.__('Payment Failed'), auto_dismiss: true }])
                    history.push('/')
                }
                return;
            }

            if (!setPaymentLoading && setPaymentCalled && dataSetPaymentGraphql.cart
                && dataSetPaymentGraphql.cart.selected_payment_method) {
                const cartMethod = dataSetPaymentGraphql.cart.selected_payment_method;
                if (cartMethod && cartMethod.code === 'paypal_express') {
                    if (!placeOrderCalled) {
                        if (!isUserSignedIn) {
                            console.log(emailOnCartData)
                            console.log(emailOnCartCalled)
                            console.log(emailOnCartLoading)
                            if (emailOnCartData && emailOnCartCalled && !emailOnCartLoading) {
                                placeOrder({ variables: { cartId, email } });
                            } else if (email) {
                                updateGuestEmailOnCart({ variables: { cartId, email } });
                            }
                        } else {
                            placeOrder({ variables: { cartId } });
                        }
                    }
                }
            }

            const token = Identify.findGetParameter('token')
            const payerId = Identify.findGetParameter('PayerID'); //PayerID param
            if (payerId && token && !setPaymentCalled) {
                setPaymentMethodOnCart({ variables: { cartId, payerId, token } })
            } else if (!createTokenCalled && !setPaymentCalled) {
                createToken({ variables: { cartId } });
            }
        }
    }, [
        tokenData, dataSetPayment, placeOrderData, emailOnCartData,
        cartId, setPaymentMethodOnCart,
        createToken, createTokenCalled, createTokenLoading, dataSetPaymentGraphql.cart,
        emailOnCartLoading, emailOnCartCalled, isUserSignedIn,
        placeOrder, placeOrderCalled, placeOrderLoading,
        updateGuestEmailOnCart, setPaymentCalled, setPaymentLoading, tokenDataGraphql.paypal_urls,
        tokenDataGraphql.token, email, history, toggleMessages,
        details, apolloClient, removeCart
    ])

    showFogLoading();
    return <div style={{ width: '100%', textAlign: 'center', marginTop: '50px' }}>
        <span>{Identify.__('Paypal Express checkout inprocessing!')}</span>
    </div>
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(null, mapDispatchToProps)(PaypalExpress);
