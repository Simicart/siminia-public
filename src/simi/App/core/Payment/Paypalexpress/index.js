import React, { useEffect, useCallback } from 'react';
import Identify from 'src/simi/Helper/Identify';
import PAYPAL_TOKEN_MUTATION from 'src/simi/queries/payment/createPaypalExpressToken.graphql';
import PAYPAL_SETPAYPMENT_MUTATION from 'src/simi/queries/payment/setPaymentMethodOnCart.graphql';
import PLACE_ORDER_MUTATION from 'src/simi/queries/payment/placeOrderMutation.graphql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useApolloClient, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';

import Icon from '@magento/venia-ui/lib/components/Icon';
import { useToasts } from '@magento/peregrine';
import { AlertCircle } from 'react-feather';

const ErrorIcon = <Icon size={20} src={AlertCircle} />;

const PaypalExpress = props => {
    const { history } = props;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const [cartData, { removeCart }] = useCartContext();
    const { details } = cartData;
    const [user] = useUserContext();
    const apolloClient = useApolloClient();

    const { cartId } = cartData;
    const isUserSignedIn = user && user.isSignedIn;

    let tokenDataGraphql = {};
    const [
        createToken,
        {
            data: tokenData,
            loading: createTokenLoading,
            error: createTokenError,
            called: createTokenCalled
        }
    ] = useMutation(PAYPAL_TOKEN_MUTATION);
    if (tokenData && tokenData.createPaypalExpressToken)
        tokenDataGraphql = tokenData.createPaypalExpressToken;

    let dataSetPaymentGraphql = {};
    const [
        setPaymentMethodOnCart,
        {
            data: dataSetPayment,
            loading: setPaymentLoading,
            error: setPaymentError,
            called: setPaymentCalled
        }
    ] = useMutation(PAYPAL_SETPAYPMENT_MUTATION);
    if (dataSetPayment && dataSetPayment.setPaymentMethodOnCart) {
        Identify.storeDataToStoreage(
            Identify.LOCAL_STOREAGE,
            'simi_last_paypalexpress_cart',
            dataSetPayment.setPaymentMethodOnCart
        );
        dataSetPaymentGraphql = dataSetPayment.setPaymentMethodOnCart;
    }

    const [
        placeOrder,
        {
            data: placeOrderData,
            loading: placeOrderLoading,
            error: placeOrderError,
            called: placeOrderCalled
        }
    ] = useMutation(PLACE_ORDER_MUTATION);

    useEffect(() => {
        if (createTokenError) {
            const errorMessage =
                (createTokenError.message &&
                    createTokenError.message.replace('GraphQL error: ', '')) ||
                '';

            addToast({
                type: 'info',
                message: formatMessage({ id: errorMessage }),
                icon: ErrorIcon,
                timeout: 5000
            });
            history.push('/cart');
            return;
        }

        if (setPaymentError) {
            const errorMessage =
                (setPaymentError.message &&
                    setPaymentError.message.replace('GraphQL error: ', '')) ||
                '';

            addToast({
                type: 'info',
                message: formatMessage({ id: errorMessage }),
                icon: ErrorIcon,
                timeout: 5000
            });
            history.push('/cart');
            return;
        }

        if (placeOrderError) {
            const errorMessage =
                (placeOrderError.message &&
                    placeOrderError.message.replace('GraphQL error: ', '')) ||
                '';
            addToast({
                type: 'info',
                message: formatMessage({ id: errorMessage }),
                icon: ErrorIcon,
                timeout: 5000
            });
            history.push('/');
            return;
        }
    }, [createTokenError, setPaymentError, placeOrderError, history]);

    useEffect(() => {
        if (cartId) {
            if (
                !placeOrderCalled &&
                !createTokenLoading &&
                createTokenCalled &&
                tokenDataGraphql.token &&
                tokenDataGraphql.paypal_urls &&
                tokenDataGraphql.paypal_urls.start
            ) {
                window.location.replace(tokenDataGraphql.paypal_urls.start);
                return;
            }

            if (!placeOrderLoading && placeOrderCalled && placeOrderData) {
                const data = placeOrderData;
                if (
                    data &&
                    data.placeOrder &&
                    data.placeOrder.order &&
                    data.placeOrder.order.order_number
                ) {
                    removeCart();
                    clearCartDataFromCache(apolloClient);
                    const lastPPexpressCart = Identify.getDataFromStoreage(
                        Identify.LOCAL_STOREAGE,
                        'simi_last_paypalexpress_cart'
                    );
                    if (lastPPexpressCart)
                        Identify.storeDataToStoreage(
                            Identify.SESSION_STOREAGE,
                            'simi_last_success_order_data',
                            lastPPexpressCart
                        );
                    history.push(
                        '/checkout-success?lastOrderId=' +
                            data.placeOrder.order.order_number
                    );
                } else {
                    if (data.errors && data.errors.length) {
                        data.errors.map(error => {
                            alert(error.message);
                        });
                    }

                    addToast({
                        type: 'info',
                        message: formatMessage({ id: 'Payment Failed' }),
                        icon: ErrorIcon,
                        timeout: 5000
                    });
                    history.push('/');
                }
                return;
            }

            if (
                !setPaymentLoading &&
                setPaymentCalled &&
                dataSetPaymentGraphql.cart &&
                dataSetPaymentGraphql.cart.selected_payment_method
            ) {
                const cartMethod =
                    dataSetPaymentGraphql.cart.selected_payment_method;
                if (cartMethod && cartMethod.code === 'paypal_express') {
                    if (!placeOrderCalled) {
                        placeOrder({ variables: { cartId } });
                    }
                }
            }

            const token = Identify.findGetParameter('token');
            const payerId = Identify.findGetParameter('PayerID'); //PayerID param
            if (payerId && token && !setPaymentCalled) {
                setPaymentMethodOnCart({
                    variables: { cartId, payerId, token }
                });
            } else if (!createTokenCalled && !setPaymentCalled) {
                createToken({ variables: { cartId } });
            }
        }
    }, [
        tokenData,
        dataSetPayment,
        placeOrderData,
        cartId,
        setPaymentMethodOnCart,
        createToken,
        createTokenCalled,
        createTokenLoading,
        dataSetPaymentGraphql.cart,
        isUserSignedIn,
        placeOrder,
        placeOrderCalled,
        placeOrderLoading,
        setPaymentCalled,
        setPaymentLoading,
        tokenDataGraphql.paypal_urls,
        tokenDataGraphql.token,
        history,
        details,
        apolloClient,
        removeCart
    ]);

    return (
        <div style={{ width: '100%', textAlign: 'center', marginTop: '50px' }}>
            <span>
                {formatMessage({ id: 'Paypal Express checkout inprocessing!' })}
            </span>
        </div>
    );
};
export default PaypalExpress;
