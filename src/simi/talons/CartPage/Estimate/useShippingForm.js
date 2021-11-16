import { useEffect, useCallback, useState } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';

export const useShippingForm = props => {
    const {
        mutations: { setShippingMethod },
        queries: { getSelectedAndAvailableShippingMethods },
        setPageIsUpdating
    } = props;


    const [{ cartId }] = useCartContext();

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
    let availableShippingMethods = []
    let shippingMethod = ''
    if (data && data.cart && data.cart.shipping_addresses &&
        data.cart.shipping_addresses[0] && data.cart.shipping_addresses[0]
    ) {
        if (
            data.cart.shipping_addresses[0].available_shipping_methods &&
            data.cart.shipping_addresses[0].available_shipping_methods.length) {
            availableShippingMethods = data.cart.shipping_addresses[0].available_shipping_methods
        }
        if (data.cart.shipping_addresses[0].selected_shipping_method) {
            shippingMethod = data.cart.shipping_addresses[0].selected_shipping_method
        }
    }


    const submitShippingMethod = useCallback(
        async value => {
            const [carrierCode, methodCode] = value

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
        },
        [cartId, setPageIsUpdating, setShippingMethodCall]
    );


    return {
        shippingMethod,
        availableShippingMethods,
        submitShippingMethod
    };
};
