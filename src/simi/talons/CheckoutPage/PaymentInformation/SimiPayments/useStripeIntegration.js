import { useCallback, useEffect, useState, useMemo } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useApolloClient } from '@apollo/client';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { fullFillAddress } from 'src/simi/Helper/CIM'
import { showToastMessage } from 'src/simi/Helper/Message'
import Identify from 'src/simi/Helper/Identify';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const mapAddressData = rawAddressData => {
    if (rawAddressData) {
        const {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            street,
            country,
            region,
            company
        } = rawAddressData;

        return {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            street1: street[0],
            street2: street[1],
            country: country.code,
            state: region.code ? region.code : region.label,
            company
        };
    } else {
        return {};
    }
};

export const useStripeIntegration = props => {
    const {
        onSuccess,
        queries,
        mutations,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        paymentCode,
        isVirtual: is_virtual
    } = props;

    const {
        getBillingAddressQuery,
        getIsBillingAddressSameQuery,
        getShippingAddressQuery
    } = queries;

    const {
        setBillingAddressMutation,
        setBillingAddressByIdMutation,
        setStripeIntegrationPayment
    } = mutations;

    /**
     * `stepNumber` depicts the state of the process flow in credit card
     * payment flow.
     *
     * `0` No call made yet
     * `1` Billing address mutation intiated
     * `2` Payment information mutation intiated
     * `3` All mutations done
     */
    const [stepNumber, setStepNumber] = useState(0);
    const client = useApolloClient();
    const formState = useFormState();
    const { validate: validateBillingAddressForm } = useFormApi();
    const [{ cartId }] = useCartContext();

    const isLoading = (stepNumber >= 1 && stepNumber <= 1); // ===1

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
            error: billingAddressMutationErrors,
            called: billingAddressMutationCalled,
            loading: billingAddressMutationLoading
        }
    ] = useMutation(setBillingAddressMutation);

    const [
        updateBillingAddressById,
        {
            error: billingAddressByIdMutationErrors,
            called: billingAddressByIdMutationCalled,
            loading: billingAddressByIdMutationLoading
        }
    ] = useMutation(setBillingAddressByIdMutation);

    const [
        setSelectedPaymentMethod,
        {
            error: setSelectedPaymentMethodError,
            called: setSelectedPaymentMethodCalled,
            loading: setSelectedPaymentMethodLoading
        }
    ] = useMutation(setStripeIntegrationPayment);
    let shippingAddressCountry
    try {
        shippingAddressCountry = shippingAddressData.cart.shippingAddresses[0].country.code
    } catch (err) {
        shippingAddressCountry = 'US'
    }
    const isBillingAddressSame = formState.values.isBillingAddressSame;

    const initialValues = useMemo(() => {
        const isBillingAddressSame = is_virtual ? false : (isBillingAddressSameData
            ? isBillingAddressSameData.cart.isBillingAddressSame
            : true);

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
    }, [isBillingAddressSameData, billingAddressData, is_virtual]);

    const errors = useMemo(() => {
        const errors = [];

        if (setSelectedPaymentMethodError && setSelectedPaymentMethodError.graphQLErrors) {
            setSelectedPaymentMethodError.graphQLErrors.forEach(({ message }) => {
                errors.push(message);
            });
        }

        if (
            billingAddressMutationErrors &&
            billingAddressMutationErrors.graphQLErrors
        ) {
            billingAddressMutationErrors.graphQLErrors.forEach(
                ({ message }) => {
                    errors.push(message);
                }
            );
        }

        if (
            billingAddressByIdMutationErrors &&
            billingAddressByIdMutationErrors.graphQLErrors
        ) {
            billingAddressByIdMutationErrors.graphQLErrors.forEach(
                ({ message }) => {
                    errors.push(message);
                }
            );
        }

        return errors;
    }, [billingAddressMutationErrors, setSelectedPaymentMethodError, billingAddressByIdMutationErrors]);

    /**
     * Helpers
     */

    /*
    * submitPaymentInfo
    */

    const submitPaymentInfo = useCallback(
        () => {
            const stripeData = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'simi_stripe_js_integration_customer_data')
            if (!stripeData) {
                showToastMessage(Identify.__('Please fill in your card data and click "Use Card"'))
                resetShouldSubmit();
                return;
            }
            setSelectedPaymentMethod({
                variables: {
                    cartId,
                    paymentCode,
                    simiCcStripejsToken: stripeData.id + ':' + stripeData.card.brand + ':' + stripeData.card.last4,
                    simiCcSave : !!stripeData.saveNewCard,
                    simiCcSaved : stripeData.isSavedCard ? stripeData.id + ':' + stripeData.card.brand + ':' + stripeData.card.last4 : false
                }
            });
        },
        [setSelectedPaymentMethod, cartId, paymentCode]
    );

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
                ...fullFillAddress(shippingAddress),
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
            state,
            postalCode,
            phoneNumber
        } = fullFillAddress(formState.values, true);
        updateBillingAddress({
            variables: {
                cartId,
                firstName,
                lastName,
                country,
                street1,
                street2,
                city,
                state,
                postalCode,
                phoneNumber,
                sameAsShipping: false
            }
        });
    }, [formState.values, updateBillingAddress, cartId]);

    const setBillingAddressById = useCallback((saved_address_for_billing) => {
        updateBillingAddressById({
            variables: {
                cartId,
                customerAddressId: parseInt(saved_address_for_billing)
            }
        });
    }, [updateBillingAddressById, cartId]);

    /**
     * Step 1 effect
     *
     * User has clicked the update button
     */
    useEffect(() => {
        try {
            if (shouldSubmit) {
                validateBillingAddressForm();

                const hasErrors = Object.keys(formState.errors).length;
                setStepNumber(1);
                if (formState.values.isBillingAddressSame) {
                    setShippingAddressAsBillingAddress();
                } else {
                    if (formState.values.saved_address_for_billing && (parseInt(formState.values.saved_address_for_billing) !== -1)) {
                        //use saved address
                        setBillingAddressById(formState.values.saved_address_for_billing);
                    } else {
                        if (!hasErrors) {
                            setBillingAddress();
                        } else {
                            throw new Error('Errors in the billing address form');
                        }
                    }
                }
                setIsBillingAddressSameInCache();
            }
        } catch (err) {
            console.error(err);
            setStepNumber(0);
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
        formState.values.saved_address_for_billing,
        setBillingAddressById
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

            const billingAddressByIdMutationCompleted =
                billingAddressByIdMutationCalled && !billingAddressByIdMutationLoading;


            if (
                (
                    billingAddressMutationCompleted &&
                    !billingAddressMutationErrors
                ) || (
                    billingAddressByIdMutationCompleted &&
                    !billingAddressByIdMutationErrors
                )
            ) {
                /**
                 * Billing address save mutation is successful
                 * we can initiate the braintree nonce request
                 */
                submitPaymentInfo()
                setStepNumber(2);
            }

            if (
                billingAddressMutationCompleted &&
                billingAddressMutationErrors
            ) {
                /**
                 * Billing address save mutation is not successful.
                 * Reset update button clicked flag.
                 */
                throw new Error('Billing address mutation failed');
            }
        } catch (err) {
            console.error(err);
            setStepNumber(0);
            resetShouldSubmit();
        }
    }, [
        billingAddressMutationErrors,
        billingAddressMutationCalled,
        billingAddressMutationLoading,
        resetShouldSubmit,
        billingAddressByIdMutationErrors,
        billingAddressByIdMutationCalled,
        billingAddressByIdMutationLoading,
        submitPaymentInfo
    ]);


    /**
     * Step 2 effect
     *
     * Credit card save mutation has completed
     */
    useEffect(() => {
        /**
         * Saved billing address, payment method and payment nonce on cart.
         *
         * Time to call onSuccess.
         */

        try {
            const setPaymentMethodMutationCompleted = setSelectedPaymentMethodCalled && !setSelectedPaymentMethodLoading;

            if (setPaymentMethodMutationCompleted && errors.length === 0) {
                if (onSuccess) {
                    onSuccess();
                }
                resetShouldSubmit();
                setStepNumber(3);
            }

            if (setPaymentMethodMutationCompleted && errors.length) {
                /**
                 * If credit card mutation failed, reset update button clicked so the
                 * user can click again and set `stepNumber` to 0.
                 */
                throw new Error('Credit card nonce save mutation failed.');
            }
        } catch (err) {
            console.error(err);
            setStepNumber(0);
            resetShouldSubmit();
        }
    }, [
        setSelectedPaymentMethodCalled,
        setSelectedPaymentMethodLoading,
        errors,
        onSuccess,
        resetShouldSubmit
    ]);


    return {
        isBillingAddressSame,
        isLoading,
        errors,
        stepNumber,
        initialValues,
        shippingAddressCountry
    };
};
