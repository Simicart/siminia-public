import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { 
    simiUseMutation as useMutation, 
    simiUseQuery as useQuery, 
    simiUseLazyQuery as useLazyQuery
} from 'src/simi/Network/Query';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import Identify from 'src/simi/Helper/Identify';

import { MOCKED_ADDRESS } from 'src/simi/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

export const useShippingInformation = props => {
    const {
        mutations: { setDefaultAddressOnCartMutation },
        onSave,
        queries: { getDefaultShippingQuery, getShippingInformationQuery },
        toggleActiveContent
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const [hasUpdate, setHasUpdate] = useState(false);
    const hasLoadedData = useRef(false);

    const {
        data: shippingInformationData,
        loading: getShippingInformationLoading
    } = useQuery(getShippingInformationQuery, {
        skip: !cartId,
        variables: {
            cartId
        }
    });

    // const {
    //     data: defaultShippingData,
    //     loading: getDefaultShippingLoading
    // } = useQuery(getDefaultShippingQuery, { skip: !isSignedIn });
    const [loadGetDefaultShippingQuery, {
        data: defaultShippingData,
        loading: getDefaultShippingLoading
    }] = useLazyQuery(getDefaultShippingQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const [
        setDefaultAddressOnCart,
        { loading: setDefaultAddressLoading }
    ] = useMutation(setDefaultAddressOnCartMutation);

    const isLoading =
        getShippingInformationLoading ||
        getDefaultShippingLoading ||
        setDefaultAddressLoading;

    const shippingData = useMemo(() => {
        let filteredData;
        if (shippingInformationData) {
            const { cart } = shippingInformationData;
            const { email, shipping_addresses: shippingAddresses } = cart;
            if (shippingAddresses.length) {
                const primaryAddress = JSON.parse(JSON.stringify(shippingAddresses[0]));
                for (const field in MOCKED_ADDRESS) {
                    if (primaryAddress[field] === MOCKED_ADDRESS[field]) {
                        primaryAddress[field] = '';
                    }

                    if (
                        field === 'street' &&
                        primaryAddress[field][0] === MOCKED_ADDRESS[field][0]
                    ) {
                        primaryAddress[field] = [''];
                    }
                }

                filteredData = {
                    email,
                    ...primaryAddress
                };
            }
        }

        return filteredData;
    }, [shippingInformationData]);

    useEffect(() => {
        if (!defaultShippingData && isSignedIn) {
            loadGetDefaultShippingQuery()
        }
    }, []);

    useEffect(() => {
        if (defaultShippingData && isSignedIn && cartId) {
            const { customer } = defaultShippingData;
            const { default_shipping: defaultAddressId } = customer;
            const lastDefaultShippingAddressId = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'simi_last_shipping_default_address_id');
            if (lastDefaultShippingAddressId !== defaultAddressId) {
                // reset the default shipping address selected, set to current cart address
                setDefaultAddressOnCart({
                    variables: {
                        cartId,
                        addressId: parseInt(defaultAddressId)
                    }
                });
                Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'simi_last_shipping_default_address_id', defaultAddressId);
            }
        }
    }, [defaultShippingData]);

    // Simple heuristic to check shipping data existed prior to this render.
    // On first submission, when we have data, we should tell the checkout page
    // so that we set the next step correctly.
    const doneEditing = !!shippingData && !!shippingData.city;

    useEffect(() => {
        if (doneEditing) {
            onSave();
        }
    }, [doneEditing, onSave]);

    useEffect(() => {
        let updateTimer;
        if (shippingData !== undefined) {
            if (hasLoadedData.current) {
                setHasUpdate(true);
                updateTimer = setTimeout(() => {
                    setHasUpdate(false);
                }, 2000);
            } else {
                hasLoadedData.current = true;
            }
        }

        return () => {
            if (updateTimer) {
                clearTimeout(updateTimer);
            }
        };
    }, [hasLoadedData, shippingData]);

    useEffect(() => {
        if (
            shippingInformationData &&
            !doneEditing &&
            cartId &&
            defaultShippingData
        ) {
            const { customer } = defaultShippingData;
            const { default_shipping: defaultAddressId } = customer;
            if (defaultAddressId) {
                setDefaultAddressOnCart({
                    variables: {
                        cartId,
                        addressId: parseInt(defaultAddressId)
                    }
                });
            }
        }
    }, [
        cartId,
        doneEditing,
        defaultShippingData,
        setDefaultAddressOnCart,
        shippingInformationData
    ]);

    const handleEditShipping = useCallback(() => {
        if (isSignedIn) {
            toggleActiveContent();
        } else {
            toggleDrawer('shippingInformation.edit');
        }
    }, [isSignedIn, toggleActiveContent, toggleDrawer]);

    return {
        doneEditing,
        handleEditShipping,
        hasUpdate,
        isLoading,
        isSignedIn,
        shippingData
    };
};
