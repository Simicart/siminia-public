import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    useApolloClient
} from '@apollo/client';

import { simiUseMutation as useMutation, simiUseQuery as useQuery, simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';

import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import CheckoutError from './CheckoutError';
import Identify from 'src/simi/Helper/Identify'
import { useHistory } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js'; //Simi stripe-js handling
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { showToastMessage } from 'src/simi/Helper/Message';
import { confirmAlert } from 'src/simi/BaseComponents/ConfirmAlert';

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4
};

export const useCheckoutPage = props => {
    const {
        mutations: { createCartMutation, placeOrderMutation },
        queries: {
            getCheckoutDetailsQuery,
            getCustomerQuery,
            getOrderDetailsQuery
        }
    } = props;

    const [reviewOrderButtonClicked, setReviewOrderButtonClicked] = useState(
        false
    );

    const apolloClient = useApolloClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeContent, setActiveContent] = useState('checkout');
    const lastOrderId = Identify.findGetParameter('lastOrderId')
    const history = useHistory()
    const [checkoutStep, setCheckoutStep] = useState(
        lastOrderId ? CHECKOUT_STEP.REVIEW : CHECKOUT_STEP.SHIPPING_ADDRESS
    );
    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [cartData, { createCart, removeCart }] = useCartContext();
    const { cartId } = cartData
    const [fetchCartId] = useMutation(createCartMutation);
    const [
        placeOrder,
        {
            data: placeOrderData,
            error: placeOrderError,
            loading: placeOrderLoading,
            called: placeOrderCalled
        }
    ] = useMutation(placeOrderMutation);
    const [toFetchOrderDetails, setToFetchOrderDetails] = useState(false);
    const { data: orderDetailsData, loading: orderDetailsLoading }
        = useQuery(getOrderDetailsQuery, {
            // We use this query to fetch details _just_ before submission, so we
            // want to make sure it is fresh. We also don't want to cache this data
            // because it may contain PII.
            fetchPolicy: 'network-only',
            variables: {
                cartId
            },
            onCompleted: () => { setToFetchOrderDetails(false) },
            skip: (!cartId || !toFetchOrderDetails)
        });

    const { data: customerData, loading: customerLoading } = useQuery(
        getCustomerQuery,
        { skip: !isSignedIn }
    );

    const {
        data: checkoutData,
        networkStatus: checkoutQueryNetworkStatus
    } = useQuery(getCheckoutDetailsQuery, {
        /**
         * Skip fetching checkout details if the `cartId`
         * is a falsy value.
         */
        skip: !cartId,
        notifyOnNetworkStatusChange: true,
        variables: {
            cartId
        }
    });

    const [shippingMethodSelected, setShippingMethodSelected] = useState(false);

    /**
     * Simi stripe-js handling
     */
    const stripe = useStripe();

    /**
     * For more info about network statues check this out
     *
     * https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
     */
    const isLoading = useMemo(() => {
        const checkoutQueryInFlight = checkoutQueryNetworkStatus
            ? checkoutQueryNetworkStatus < 7
            : true;

        return checkoutQueryInFlight || customerLoading;
    }, [checkoutQueryNetworkStatus, customerLoading]);

    const customer = customerData && customerData.customer;

    const toggleActiveContent = useCallback(() => {
        const nextContentState =
            activeContent === 'checkout' ? 'addressBook' : 'checkout';
        setActiveContent(nextContentState);
    }, [activeContent]);

    const checkoutError = useMemo(() => {
        //simi async to create order the 2nd time
        async function simi2ndTimePlaceOrderAndCleanup() {
            try {
                await placeOrder({
                    variables: {
                        cartId
                    }
                });
                Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'simi_selected_payment_code', null)
                // Cleanup stale cart and customer info.
                await removeCart();
                await clearCartDataFromCache(apolloClient);
                await createCart({
                    fetchCartId
                });
                Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'simi_stripe_js_integration_customer_data', null)
                hideFogLoading();
            } catch (err) {
                hideFogLoading()
                console.error(
                    'An error occurred during when placing the order',
                    err
                );
                setReviewOrderButtonClicked(false);
                setCheckoutStep(CHECKOUT_STEP.PAYMENT);
            }
        }
        //simi end function creating order 2nd time

        if (placeOrderError) {
            //Simi stripe-js handling
            if (Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'simi_selected_payment_code') === 'stripe_payments' &&
                placeOrderError.graphQLErrors) {
                const derivedErrorMessage = placeOrderError.graphQLErrors
                    .map(({ message, debugMessage }) => debugMessage ? debugMessage : message)
                    .join(', ');
                if (derivedErrorMessage.includes("Authentication Required")) {
                    const paymentIntents = derivedErrorMessage.substring("Authentication Required: ".length).split(",");
                    if (paymentIntents && paymentIntents[0]) {
                        stripe.handleCardAction(paymentIntents[0])
                            .then(function (result) {
                                if (result && result.paymentIntent) {
                                    showFogLoading()
                                    simi2ndTimePlaceOrderAndCleanup()
                                } else {
                                    showToastMessage(Identify.__('Sorry, we cannot validate your card'))
                                    history.push('/cart.html')
                                }
                            });
                        return
                    }
                }
            }
            //end stripe js handling

            //need to reload the page cause we cannot push the button the second time (placeOrderCalled changed to true)
            let errMessageToAlert = Identify.__('An error occurred during when placing the order');
            if (placeOrderError.graphQLErrors) {
                errMessageToAlert += placeOrderError.graphQLErrors
                    .map(({ message, debugMessage }) => debugMessage ? debugMessage : message)
                    .join(', ');
            }
            confirmAlert({
                title: '',
                className: 'checkout-failure-confirm-alert',
                message: errMessageToAlert,
                afterClose: () => window.location.reload(),
                showCloseButton: false,
                buttons: [
                    {
                        label: Identify.__('Back to Home Screen'),
                        className: 'confirm-alert-cancel',
                        onClick: () => {
                            window.location.replace('/');
                        }
                    },
                    {
                        label: Identify.__('Try Again'),
                        className: 'confirm-alert-ok',
                        onClick: () => {
                            window.location.reload();
                        }
                    }
                ]
            });

            return new CheckoutError(placeOrderError);
        }
    }, [
        placeOrderError,
        stripe, cartId, apolloClient, createCart, fetchCartId, placeOrder, removeCart, history
    ]); //Simi stripe-js handling (add `stripe, cartId, apolloClient, createCart, fetchCartId, placeOrder, removeCart, history` to dependency)

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    const handleReviewOrder = useCallback(() => {
        setReviewOrderButtonClicked(true);
    }, []);

    const resetReviewOrderButtonClicked = useCallback(() => {
        setReviewOrderButtonClicked(false);
    }, [setReviewOrderButtonClicked]);

    const setShippingInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS) {
            setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
        }
    }, [checkoutStep, setCheckoutStep]);

    const setShippingMethodDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD) {
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
        }
        setShippingMethodSelected(true);
    }, [checkoutStep, setCheckoutStep]);

    const setPaymentInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.PAYMENT) {
            setCheckoutStep(CHECKOUT_STEP.REVIEW);
        }
    }, [checkoutStep, setCheckoutStep]);

    const handlePlaceOrder = useCallback(async () => {
        //open pp express checkout page
        const selectedPaymentMethod = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'simi_selected_payment_code')
        if (selectedPaymentMethod === "paypal_express") {
            history.push('/paypal_express.html')
            return
        }
        // Fetch order details and then use an effect to actually place the
        // order. If/when Apollo returns promises for invokers from useLazyQuery
        // we can just await this function and then perform the rest of order
        // placement.
        setToFetchOrderDetails(true);
        // getOrderDetails({
        //     variables: {
        //         cartId
        //     }
        // });
    }, [setToFetchOrderDetails, history]);

    //virtual cart handler
    useEffect(() => {
        if (
            checkoutData && checkoutData.cart && checkoutData.cart.is_virtual && (
                checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS ||
                checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD
            )
        ) {
            setCheckoutStep(CHECKOUT_STEP.PAYMENT)
        }
    }, [checkoutStep, setCheckoutStep, checkoutData])

    useEffect(() => {
        async function placeOrderAndCleanup() {
            try {
                await placeOrder({
                    variables: {
                        cartId
                    }
                });

                //simi session and local data cleanup
                Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'simi_selected_payment_code', null)

                // Cleanup stale cart and customer info.
                await removeCart();
                await clearCartDataFromCache(apolloClient);

                await createCart({
                    fetchCartId
                });
            } catch (err) {
                console.error(
                    'An error occurred during when placing the order',
                    err
                );
                setReviewOrderButtonClicked(false);
                setCheckoutStep(CHECKOUT_STEP.PAYMENT);
            }
        }

        if (orderDetailsData && !placeOrderCalled) {
            placeOrderAndCleanup();
        }
    }, [
        apolloClient,
        cartId,
        createCart,
        fetchCartId,
        orderDetailsData,
        placeOrder,
        placeOrderCalled,
        removeCart
    ]);

    return {
        activeContent,
        checkoutStep,
        error: checkoutError,
        customer,
        handleSignIn,
        handlePlaceOrder,
        hasError: !!checkoutError,
        isCartEmpty: !(checkoutData && checkoutData.cart.total_quantity),
        isGuestCheckout: !isSignedIn,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber:
            (placeOrderData && placeOrderData.placeOrder.order.order_number) ||
            lastOrderId,
        placeOrderLoading,
        setCheckoutStep,
        setIsUpdating,
        setShippingInformationDone,
        shippingMethodSelected,
        setShippingMethodDone,
        setPaymentInformationDone,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        isVirtual: (checkoutData && checkoutData.cart && checkoutData.cart.is_virtual),
        toggleActiveContent
    };
};
