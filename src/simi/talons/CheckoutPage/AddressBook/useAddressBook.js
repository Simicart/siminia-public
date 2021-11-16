import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useAddressBook = props => {
    const {
        mutations: { setCustomerAddressOnCartMutation },
        queries: { getCustomerAddressesQuery, getCustomerCartAddressQuery },
        toggleActiveContent
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const addressCount = useRef();
    const [activeAddress, setActiveAddress] = useState();
    const [selectedAddress, setSelectedAddress] = useState();

    const [
        setCustomerAddressOnCart,
        {
            error: setCustomerAddressOnCartError,
            loading: setCustomerAddressOnCartLoading
        }
    ] = useMutation(setCustomerAddressOnCartMutation);

    const {
        data: customerAddressesData,
        error: customerAddressesError,
        loading: customerAddressesLoading
    } = useQuery(getCustomerAddressesQuery, { skip: !isSignedIn });

    const {
        data: customerCartAddressData,
        error: customerCartAddressError,
        loading: customerCartAddressLoading
    } = useQuery(getCustomerCartAddressQuery, { skip: !isSignedIn });

    useEffect(() => {
        if (customerAddressesError) {
            console.error(customerAddressesError);
        }

        if (customerCartAddressError) {
            console.error(customerCartAddressError);
        }
    }, [customerAddressesError, customerCartAddressError]);

    const derivedErrorMessage = useMemo(() => {
        let errorMessage;

        if (setCustomerAddressOnCartError) {
            const { graphQLErrors, message } = setCustomerAddressOnCartError;
            errorMessage = graphQLErrors
                ? graphQLErrors.map(({ message }) => message).join(', ')
                : message;
        }

        return errorMessage;
    }, [setCustomerAddressOnCartError]);

    const isLoading =
        customerAddressesLoading ||
        customerCartAddressLoading ||
        setCustomerAddressOnCartLoading;

    const customerAddresses =
        (customerAddressesData && customerAddressesData.customer.addresses) ||
        [];

    useEffect(() => {
        if (customerAddresses.length !== addressCount.current) {
            // Auto-select newly added address when count changes
            if (addressCount.current) {
                const newestAddress =
                    customerAddresses[customerAddresses.length - 1];
                setSelectedAddress(newestAddress.id);
            }

            addressCount.current = customerAddresses.length;
        }
    }, [customerAddresses]);

    const handleEditAddress = useCallback(
        address => {
            setActiveAddress(address);
            toggleDrawer('shippingInformation.edit');
        },
        [toggleDrawer]
    );

    const handleAddAddress = useCallback(() => {
        handleEditAddress();
    }, [handleEditAddress]);

    const handleSelectAddress = useCallback(addressId => {
        setSelectedAddress(addressId);
    }, []);

    // GraphQL doesn't return which customer address is selected, so perform
    // a simple search to initialize this selected address value.
    if (
        customerAddresses.length &&
        customerCartAddressData &&
        !selectedAddress
    ) {
        const { customerCart } = customerCartAddressData;
        const { shipping_addresses: shippingAddresses } = customerCart;
        if (shippingAddresses.length) {
            const primaryCartAddress = shippingAddresses[0];

            const foundSelectedAddress = customerAddresses.find(
                customerAddress =>
                    customerAddress.street[0] ===
                        primaryCartAddress.street[0] &&
                    customerAddress.firstname ===
                        primaryCartAddress.firstname &&
                    customerAddress.lastname === primaryCartAddress.lastname
            );

            if (foundSelectedAddress) {
                setSelectedAddress(foundSelectedAddress.id);
            }
        }
    }

    const handleApplyAddress = useCallback(async () => {
        try {
            await setCustomerAddressOnCart({
                variables: {
                    cartId,
                    addressId: selectedAddress
                }
            });
        } catch {
            return;
        }

        toggleActiveContent();
    }, [
        cartId,
        selectedAddress,
        setCustomerAddressOnCart,
        toggleActiveContent
    ]);

    const handleCancel = useCallback(() => {
        setSelectedAddress();
        toggleActiveContent();
    }, [toggleActiveContent]);

    return {
        activeAddress,
        customerAddresses,
        errorMessage: derivedErrorMessage,
        isLoading,
        handleAddAddress,
        handleApplyAddress,
        handleCancel,
        handleSelectAddress,
        handleEditAddress,
        selectedAddress
    };
};
