import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useApolloClient, useQuery, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './PaypalButtons.gql';
import PLACE_ORDER_MUTATION from 'src/simi/queries/payment/placeOrderMutation.graphql';
import { useToasts } from '@magento/peregrine';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { mapAddressData } from '../PlainOffline/usePlainOffline';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';

import {
    showFogLoading,
    hideFogLoading
} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertCircle } from 'react-feather';
const ErrorIcon = <Icon size={20} src={AlertCircle} />;

const getRegion = region => {
    return region.region_id || region.label || region.code;
};

export const usePaypalButtons = props => {
    const history = useHistory();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const {
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        paymentCode
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getBillingAddressQuery,
        getIsBillingAddressSameQuery,
        getShippingAddressQuery,
        setBillingAddressMutation,
        setPaymentMethodOnCartMutation,
        createPaypalExpressToken,
        getCartTotals
    } = operations;

    /**
     * Definitions
     */

    /**
     * `stepNumber` depicts the state of the process flow in credit card
     * payment flow.
     *
     * `0` No call made yet
     * `1` Billing address mutation intiated
     * `3` Payment information mutation intiated
     * `4` All mutations done
     */
    const [stepNumber, setStepNumber] = useState(0);

    const client = useApolloClient();
    const formState = useFormState();
    const { validate: validateBillingAddressForm } = useFormApi();
    const [{ cartId }, { removeCart }] = useCartContext();
    const [payerData, setPayerData] = useState(false);
    const { data: cartTotalData, loading: cartTotalLoading } = useQuery(
        getCartTotals,
        {
            skip: !cartId,
            variables: { cartId }
        }
    );

    const [
        createTokenMutation,
        { data: tokenData, error: tokenErr, loading: tokenLoading }
    ] = useMutation(createPaypalExpressToken);

    const { data: billingAddressData } = useQuery(getBillingAddressQuery, {
        skip: !cartId,
        variables: { cartId }
    });
    const { data: shippingAddressData } = useQuery(getShippingAddressQuery, {
        skip: !cartId,
        variables: { cartId }
    });
    const { data: isBillingAddressSameData } = useQuery(
        getIsBillingAddressSameQuery,
        { skip: !cartId, variables: { cartId } }
    );
    const [
        updateBillingAddress,
        {
            error: billingAddressMutationError,
            called: billingAddressMutationCalled,
            loading: billingAddressMutationLoading
        }
    ] = useMutation(setBillingAddressMutation);

    const [
        updateCCDetails,
        {
            error: ccMutationError,
            called: ccMutationCalled,
            loading: ccMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation);

    const [
        placeOrder,
        {
            data: placeOrderData,
            loading: placeOrderLoading,
            error: placeOrderError,
            called: placeOrderCalled
        }
    ] = useMutation(PLACE_ORDER_MUTATION, {
        onError: err => {
            hideFogLoading();
            const errorMessage =
                err && err.message
                    ? err.message.replace('GraphQL error: ', '')
                    : 'Something went wrong. Please refresh and try again.';
            addToast({
                type: 'info',
                message: formatMessage({ id: errorMessage }),
                icon: ErrorIcon,
                timeout: 5000
            });
            history.push('/');
        },
        onCompleted: data => {
            hideFogLoading();
            if (
                data &&
                data.placeOrder &&
                data.placeOrder.order &&
                data.placeOrder.order.order_number
            ) {
                removeCart();
                clearCartDataFromCache(client);
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
    });

    const shippingAddressCountry = shippingAddressData
        ? shippingAddressData.cart.shippingAddresses[0].country.code
        : DEFAULT_COUNTRY_CODE;
    const isBillingAddressSame = formState.values.isBillingAddressSame;

    let token = false;
    if (
        tokenData &&
        tokenData.createPaypalExpressToken &&
        tokenData.createPaypalExpressToken.token
    )
        token = tokenData.createPaypalExpressToken.token;

    const initialValues = useMemo(() => {
        const isBillingAddressSame = isBillingAddressSameData
            ? isBillingAddressSameData.cart.isBillingAddressSame
            : true;

        let billingAddress = {};
        /**
         * If billing address is same as shipping address, do
         * not auto fill the fields.
         */
        if (billingAddressData && !isBillingAddressSame) {
            if (billingAddressData.cart.billingAddress) {
                const {
                    // eslint-disable-next-line no-unused-vars
                    __typename,
                    ...rawBillingAddress
                } = billingAddressData.cart.billingAddress;
                billingAddress = mapAddressData(rawBillingAddress);
            }
        }

        return { isBillingAddressSame, ...billingAddress };
    }, [isBillingAddressSameData, billingAddressData]);

    /**
     * Helpers
     */

    /**
     * This function sets the boolean isBillingAddressSame
     * in cache for future use. We use cache because there
     * is no way to save this on the cart in remote.
     */
    const setIsBillingAddressSameInCache = useCallback(() => {
        client.writeQuery({
            query: getIsBillingAddressSameQuery,
            data: {
                cart: {
                    __typename: 'Cart',
                    id: cartId,
                    isBillingAddressSame
                }
            }
        });
    }, [client, cartId, getIsBillingAddressSameQuery, isBillingAddressSame]);

    /**
     * This function sets the billing address on the cart using the
     * shipping address.
     */
    const setShippingAddressAsBillingAddress = useCallback(() => {
        const shippingAddress = shippingAddressData
            ? mapAddressData(shippingAddressData.cart.shippingAddresses[0])
            : {};

        updateBillingAddress({
            variables: {
                cartId,
                ...shippingAddress,
                sameAsShipping: true
            }
        });
    }, [updateBillingAddress, shippingAddressData, cartId]);

    /**
     * This function sets the billing address on the cart using the
     * information from the form.
     */
    const setBillingAddress = useCallback(() => {
        const {
            firstName,
            lastName,
            country,
            street1,
            street2,
            city,
            region,
            postcode,
            phoneNumber
        } = formState.values;

        updateBillingAddress({
            variables: {
                cartId,
                firstName,
                lastName,
                country,
                street1,
                street2: street2 || '',
                city,
                region: getRegion(region),
                postcode,
                phoneNumber,
                sameAsShipping: false
            }
        });
    }, [formState.values, updateBillingAddress, cartId]);

    /**
     * This function saves the nonce code from braintree
     * on the cart along with the payment method used in
     * this case `braintree`.
     */
    const updatePaymentDetailsOnCart = useCallback(
        payerData => {
            updateCCDetails({
                variables: {
                    cartId,
                    payerId: payerData.payerID,
                    token
                }
            });
        },
        [updateCCDetails, cartId, token]
    );

    /**
     * Effects
     */

    useEffect(() => {
        if (!tokenData && cartId && !tokenErr && !tokenLoading)
            createTokenMutation({ variables: { cartId } });
    });
    /**
     * Step 1 effect
     *
     * User has clicked the update button
     */
    useEffect(() => {
        try {
            if (shouldSubmit || payerData) {
                /**
                 * Validate billing address fields and only process with
                 * submit if there are no errors.
                 *
                 * We do this because the user can click Review Order button
                 * without fillig in all fields and the form submission
                 * happens manually. The informed Form component validates
                 * on submission but that only happens when we use the onSubmit
                 * prop. In this case we are using manually submission because
                 * of the nature of the credit card submission process.
                 */
                validateBillingAddressForm();

                const hasErrors = Object.keys(formState.errors).length;

                if (!hasErrors) {
                    setStepNumber(1);
                    if (isBillingAddressSame) {
                        setShippingAddressAsBillingAddress();
                    } else {
                        setBillingAddress();
                    }
                    setIsBillingAddressSameInCache();
                } else {
                    throw new Error('Errors in the billing address form');
                }
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
            setStepNumber(0);
            setPayerData(false);
            resetShouldSubmit();
        }
    }, [
        shouldSubmit,
        isBillingAddressSame,
        setShippingAddressAsBillingAddress,
        setBillingAddress,
        setIsBillingAddressSameInCache,
        resetShouldSubmit,
        validateBillingAddressForm,
        formState.errors,
        payerData
    ]);

    /**
     * Step 2 effect
     *
     * Billing address mutation has completed
     */
    useEffect(() => {
        try {
            const billingAddressMutationCompleted =
                billingAddressMutationCalled && !billingAddressMutationLoading;

            if (
                billingAddressMutationCompleted &&
                !billingAddressMutationError &&
                payerData
            ) {
                /**
                 * Billing address save mutation is successful
                 * we can initiate the braintree nonce request
                 */
                setStepNumber(2);
                updatePaymentDetailsOnCart(payerData);
            }

            if (
                billingAddressMutationCompleted &&
                billingAddressMutationError
            ) {
                /**
                 * Billing address save mutation is not successful.
                 * Reset update button clicked flag.
                 */
                throw new Error('Billing address mutation failed');
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
            setStepNumber(0);
            resetShouldSubmit();
        }
    }, [
        billingAddressMutationError,
        billingAddressMutationCalled,
        billingAddressMutationLoading,
        resetShouldSubmit,
        payerData
    ]);

    /**
     * Step 3 effect
     *
     * Credit card save mutation has completed
     */
    useEffect(() => {
        try {
            const ccMutationCompleted = ccMutationCalled && !ccMutationLoading;

            if (ccMutationCompleted && !ccMutationError) {
                if (onSuccess) {
                    onSuccess();
                }
                if (!placeOrderCalled && !placeOrderLoading) {
                    placeOrder({ variables: { cartId } });
                    showFogLoading();
                }
                resetShouldSubmit();
                setStepNumber(4);
            }

            if (ccMutationCompleted && ccMutationError) {
                /**
                 * If credit card mutation failed, reset update button clicked so the
                 * user can click again and set `stepNumber` to 0.
                 */
                throw new Error('Payment save mutation failed.');
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
            setStepNumber(0);
            resetShouldSubmit();
        }
    }, [
        ccMutationCalled,
        ccMutationLoading,
        onSuccess,
        resetShouldSubmit,
        ccMutationError,
        placeOrderCalled,
        placeOrder,
        placeOrderLoading
    ]);

    const errors = useMemo(
        () =>
            new Map([
                ['setBillingAddressMutation', billingAddressMutationError],
                ['setOfflinePaymentOnCartMutation', ccMutationError]
            ]),
        [billingAddressMutationError, ccMutationError]
    );

    return {
        errors,
        isBillingAddressSame,
        stepNumber,
        initialValues,
        shippingAddressCountry,
        updatePaymentDetailsOnCart,
        cartTotalData,
        setPayerData,
        token,
        history,
        cartId,
        paypalLoading:
            tokenLoading ||
            cartTotalLoading ||
            ccMutationLoading ||
            billingAddressMutationLoading ||
            placeOrderLoading
    };
};
