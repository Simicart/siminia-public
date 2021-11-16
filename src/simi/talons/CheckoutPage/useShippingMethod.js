import { useCallback, useEffect, useMemo, useState } from 'react';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing',
    INITIALIZING: 'initializing'
};

const serializeShippingMethod = method => {
    if (!method) return '';

    const { carrier_code, method_code } = method;

    return `${carrier_code}|${method_code}`;
};

const deserializeShippingMethod = serializedValue => {
    return serializedValue.split('|');
};

// Sorts available shipping methods by price.
const byPrice = (a, b) => a.amount.value - b.amount.value;

// Adds a serialized property to shipping method objects
// so they can be selected in the radio group.
const addSerializedProperty = shippingMethod => {
    if (!shippingMethod) return shippingMethod;

    const serializedValue = serializeShippingMethod(shippingMethod);

    return {
        ...shippingMethod,
        serializedValue
    };
};

const DEFAULT_SELECTED_SHIPPING_METHOD = null;
const DEFAULT_AVAILABLE_SHIPPING_METHODS = [];

export const useShippingMethod = props => {
    const {
        onSave,
        mutations: { setShippingMethod },
        queries: { getSelectedAndAvailableShippingMethods },
        setPageIsUpdating
    } = props;

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    /*
     *  Apollo Hooks.
     */
    const [
        setShippingMethodCall,
        { error: setShippingMethodError, loading: isSettingShippingMethod }
    ] = useMutation(setShippingMethod);

    const { data, loading: isLoadingShippingMethods } = useQuery(
        getSelectedAndAvailableShippingMethods,
        {
            variables: {
                cartId
            },
            fetchPolicy: 'cache-and-network',
            skip: !cartId
        }
    );

    /*
     *  State / Derived state.
     */
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const hasData =
        data &&
        data.cart.shipping_addresses.length &&
        data.cart.shipping_addresses[0].selected_shipping_method;

    const derivedPrimaryShippingAddress =
        data &&
            data.cart.shipping_addresses &&
            data.cart.shipping_addresses.length
            ? data.cart.shipping_addresses[0]
            : null;

    const derivedSelectedShippingMethod = (
        derivedPrimaryShippingAddress &&
        derivedPrimaryShippingAddress.selected_shipping_method &&
        derivedPrimaryShippingAddress.selected_shipping_method.carrier_code &&
        derivedPrimaryShippingAddress.selected_shipping_method.method_code &&
        derivedPrimaryShippingAddress.available_shipping_methods.find(
            available_shipping_method => (
                (available_shipping_method.carrier_code === derivedPrimaryShippingAddress.selected_shipping_method.carrier_code) &&
                (available_shipping_method.method_code === derivedPrimaryShippingAddress.selected_shipping_method.method_code)
            )
        )
    )
        ? addSerializedProperty(
            derivedPrimaryShippingAddress.selected_shipping_method
        )
        : DEFAULT_SELECTED_SHIPPING_METHOD;

    const derivedShippingMethods = useMemo(() => {
        if (!derivedPrimaryShippingAddress)
            return DEFAULT_AVAILABLE_SHIPPING_METHODS;

        // Shape the list of available shipping methods.
        // Sort them by price and add a serialized property to each.
        const rawShippingMethods =
            derivedPrimaryShippingAddress.available_shipping_methods;
        const shippingMethodsByPrice = [...rawShippingMethods].sort(byPrice);
        const result = shippingMethodsByPrice.map(addSerializedProperty);

        return result;
    }, [derivedPrimaryShippingAddress]);

    // Determine the component's display state.
    const isBackgroundAutoSelecting =
        isSignedIn &&
        !derivedSelectedShippingMethod &&
        Boolean(derivedShippingMethods.length);
    const displayState = derivedSelectedShippingMethod
        ? displayStates.DONE
        : isLoadingShippingMethods ||
            (isSettingShippingMethod && isBackgroundAutoSelecting)
            ? displayStates.INITIALIZING
            : displayStates.EDITING;

    /*
     *  Callbacks.
     */
    const handleSubmit = useCallback(
        async value => {
            const [carrierCode, methodCode] = deserializeShippingMethod(
                value.shipping_method
            );

            setPageIsUpdating(true);

            try {
                await setShippingMethodCall({
                    variables: {
                        cartId,
                        shippingMethod: {
                            carrier_code: carrierCode,
                            method_code: methodCode
                        }
                    }
                });
            } catch {
                return;
            } finally {
                setPageIsUpdating(false);
            }

            setIsUpdateMode(false);
        },
        [cartId, setIsUpdateMode, setPageIsUpdating, setShippingMethodCall]
    );

    const handleCancelUpdate = useCallback(() => {
        setIsUpdateMode(false);
    }, []);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);
    }, []);

    /*
     *  Effects.
     */

    // When we have data we should tell the checkout page
    // so that it can set the step correctly.
    useEffect(() => {
        if (hasData) {
            onSave();
        }
    }, [hasData, onSave]);

    // If an authenticated user does not have a preferred shipping method,
    // auto-select the least expensive one for them.
    useEffect(() => {
        if (!data) return;
        if (!cartId) return;
        if (!isSignedIn) return;

        if (!derivedSelectedShippingMethod) {
            // The shipping methods are sorted by price.
            const leastExpensiveShippingMethod = derivedShippingMethods[0];

            if (leastExpensiveShippingMethod) {
                const {
                    carrier_code,
                    method_code
                } = leastExpensiveShippingMethod;

                setShippingMethodCall({
                    variables: {
                        cartId,
                        shippingMethod: {
                            carrier_code,
                            method_code
                        }
                    }
                });
            }
        }
    }, [
        cartId,
        data,
        derivedSelectedShippingMethod,
        derivedShippingMethods,
        isSignedIn,
        setShippingMethodCall
    ]);

    return {
        displayState,
        formErrors: [setShippingMethodError],
        handleCancelUpdate,
        handleSubmit,
        isLoading: isLoadingShippingMethods,
        isUpdateMode,
        selectedShippingMethod: derivedSelectedShippingMethod,
        shippingMethods: derivedShippingMethods,
        showUpdateMode
    };
};
