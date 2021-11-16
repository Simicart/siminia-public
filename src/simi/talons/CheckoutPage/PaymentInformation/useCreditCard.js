import { useCallback, useEffect, useState, useMemo } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useApolloClient } from '@apollo/client';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { fullFillAddress } from 'src/simi/Helper/CIM'

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

/**
 * Talon to handle Credit Card payment method.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onError callback to invoke when the braintree dropin component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 * @param {DocumentNode} props.queries.getBillingAddressQuery query to fetch billing address from cache
 * @param {DocumentNode} props.queries.getIsBillingAddressSameQuery query to fetch is billing address same checkbox value from cache
 * @param {DocumentNode} props.queries.getPaymentNonceQuery query to fetch payment nonce saved in cache
 * @param {DocumentNode} props.mutations.setBillingAddressMutation mutation to update billing address on the cart
 * @param {DocumentNode} props.mutations.setCreditCardDetailsOnCartMutation mutation to update payment method and payment nonce on the cart
 *
 * @returns {
 *   shouldRequestPaymentNonce: Boolean,
 *   onPaymentError: Function,
 *   onPaymentSuccess: Function,
 *   onPaymentReady: Function,
 *   isBillingAddressSame: Boolean,
 *   isLoading: Boolean,
 *   errors: Array<String>,
 *   stepNumber: Number,
 *   initialValues: {
 *      firstName: String,
 *      lastName: String,
 *      city: String,
 *      postalCode: String,
 *      phoneNumber: String,
 *      street1: String,
 *      street2: String,
 *      country: String,
 *      state: String,
 *      isBillingAddressSame: Boolean
 *   },
 *   shippingAddressCountry: String,
 *   shouldTeardownDropin: Boolean,
 *   resetShouldTeardownDropin: Function
 * }
 */
export const useCreditCard = props => {
    const {
        onSuccess,
        queries,
        mutations,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        isVirtual: is_virtual
    } = props;

    const {
        getBillingAddressQuery,
        getIsBillingAddressSameQuery,
        getPaymentNonceQuery,
        getShippingAddressQuery
    } = queries;

    const {
        setBillingAddressMutation,
        setBillingAddressByIdMutation,
        setCreditCardDetailsOnCartMutation
    } = mutations;

    /**
     * Definitions
     */

    const [isDropinLoading, setDropinLoading] = useState(true);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const [shouldTeardownDropin, setShouldTeardownDropin] = useState(false);
    /**
     * `stepNumber` depicts the state of the process flow in credit card
     * payment flow.
     *
     * `0` No call made yet
     * `1` Billing address mutation intiated
     * `2` Braintree nonce requsted
     * `3` Payment information mutation intiated
     * `4` All mutations done
     */
    const [stepNumber, setStepNumber] = useState(0);

    const client = useApolloClient();
    const formState = useFormState();
    const { validate: validateBillingAddressForm } = useFormApi();
    const [{ cartId }] = useCartContext();

    const isLoading = isDropinLoading || (stepNumber >= 1 && stepNumber <= 3);

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
        updateCCDetails,
        {
            error: ccMutationErrors,
            called: ccMutationCalled,
            loading: ccMutationLoading
        }
    ] = useMutation(setCreditCardDetailsOnCartMutation);

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

        if (ccMutationErrors && ccMutationErrors.graphQLErrors) {
            ccMutationErrors.graphQLErrors.forEach(({ message }) => {
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
    }, [ccMutationErrors, billingAddressMutationErrors, billingAddressByIdMutationErrors]);

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
     * This function sets the payment nonce details in the cache.
     * We use cache because there is no way to save this information
     * on the cart in the remote.
     *
     * We do not save the nonce code because it is a PII.
     */
    const setPaymentDetailsInCache = useCallback(
        braintreeNonce => {
            /**
             * We dont save the nonce code due to PII,
             * we only save the subset of details.
             */
            const { details, description, type } = braintreeNonce;
            client.writeQuery({
                query: getPaymentNonceQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        paymentNonce: {
                            details,
                            description,
                            type
                        }
                    }
                }
            });
        },
        [cartId, client, getPaymentNonceQuery]
    );

    /**
     * This function saves the nonce code from braintree
     * on the cart along with the payment method used in
     * this case `braintree`.
     */
    const updateCCDetailsOnCart = useCallback(
        braintreeNonce => {
            const { nonce } = braintreeNonce;
            updateCCDetails({
                variables: {
                    cartId,
                    paymentMethod: 'braintree',
                    paymentNonce: nonce
                }
            });
        },
        [updateCCDetails, cartId]
    );

    /**
     * Function to be called by the braintree dropin when the
     * nonce generation is successful.
     */
    const onPaymentSuccess = useCallback(
        braintreeNonce => {
            setPaymentDetailsInCache(braintreeNonce);
            /**
             * Updating payment braintreeNonce and selected payment method on cart.
             */
            updateCCDetailsOnCart(braintreeNonce);
            setStepNumber(3);
        },
        [setPaymentDetailsInCache, updateCCDetailsOnCart]
    );

    /**
     * Function to be called by the braintree dropin when the
     * nonce generation is not successful.
     */
    const onPaymentError = useCallback(
        error => {
            setStepNumber(0);
            setShouldRequestPaymentNonce(false);
            resetShouldSubmit();
            if (onError) {
                onError(error);
            }
        },
        [onError, resetShouldSubmit]
    );

    /**
     * Function to be called by the braintree dropin when the
     * credit card component has loaded successfully.
     */
    const onPaymentReady = useCallback(() => {
        setDropinLoading(false);
        setStepNumber(0);
        if (onReady) {
            onReady();
        }
    }, [onReady]);

    /**
     * Function to be called by braintree dropin when the payment
     * teardown is done successfully before re creating the new dropin.
     */
    const resetShouldTeardownDropin = useCallback(() => {
        setShouldTeardownDropin(false);
    }, []);

    /**
     * Effects
     */

    /**
     * Step 1 effect
     *
     * User has clicked the update button
     */
    useEffect(() => {
        try {
            if (shouldSubmit) {
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
            setShouldRequestPaymentNonce(false);
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
                setStepNumber(2);
                setShouldRequestPaymentNonce(true);
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
            setShouldRequestPaymentNonce(false);
        }
    }, [
        billingAddressMutationErrors,
        billingAddressMutationCalled,
        billingAddressMutationLoading,
        billingAddressByIdMutationErrors,
        billingAddressByIdMutationCalled,
        billingAddressByIdMutationLoading,
        resetShouldSubmit
    ]);

    /**
     * Step 3 effect
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
            const ccMutationCompleted = ccMutationCalled && !ccMutationLoading;

            if (ccMutationCompleted && errors.length === 0) {
                if (onSuccess) {
                    onSuccess();
                }
                resetShouldSubmit();
                setStepNumber(4);
            }

            if (ccMutationCompleted && errors.length) {
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
            setShouldRequestPaymentNonce(false);
            setShouldTeardownDropin(true);
        }
    }, [
        ccMutationCalled,
        ccMutationLoading,
        errors,
        onSuccess,
        setShouldRequestPaymentNonce,
        resetShouldSubmit
    ]);

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        isLoading,
        errors,
        shouldRequestPaymentNonce,
        stepNumber,
        initialValues,
        shippingAddressCountry,
        shouldTeardownDropin,
        resetShouldTeardownDropin
    };
};
