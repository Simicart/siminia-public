import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { useFieldState } from 'informed';
import Identify from 'src/simi/Helper/Identify'

import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const usePaymentMethods = props => {
    const { queries } = props;
    const { getPaymentMethodsQuery } = queries;
    const [{ cartId }] = useCartContext();
    const { data, loading } = useQuery(getPaymentMethodsQuery, {
        skip: !cartId,
        variables: { cartId }
    });
    
    const { value: currentSelectedPaymentMethod } = useFieldState(
        'selectedPaymentMethod'
    );

    if (currentSelectedPaymentMethod)
        Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'simi_selected_payment_code', currentSelectedPaymentMethod)

    const availablePaymentMethods =
        (data && data.cart.available_payment_methods) || [];

    let initialSelectedMethod = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'simi_selected_payment_code')    
    if (!initialSelectedMethod) {
        initialSelectedMethod =
        (availablePaymentMethods.length && availablePaymentMethods[0].code) ||
        null;
    }

    return {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        initialSelectedMethod,
        isLoading: loading,
        isVirtual: (data && data.cart && data.cart.is_virtual) ? data.cart.is_virtual : false
    };
};
