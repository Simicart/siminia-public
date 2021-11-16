import { useEffect, useCallback } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';

export const useEstimate = props => {
    const {
        queries: { estimateShippingMutation }
    } = props;

    const [{ cartId }] = useCartContext();

    const [
        estimateShipping,
        {
            error: estimateShippingError,
            called: estimateShippingCalled,
            loading: estimateShippingLoading
        }
    ] = useMutation(estimateShippingMutation);


    const submitShippingAddress = useCallback((addressData) => {
        estimateShipping({
            variables: {
                cartId,
                addressInput: addressData
            }
        })
    }, [estimateShipping, cartId])
    
    return {
        submitShippingAddress,
        shippingAddress: null
    };
};
