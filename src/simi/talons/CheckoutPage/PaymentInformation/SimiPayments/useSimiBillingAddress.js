import { useCallback, useEffect, useState, useRef } from 'react';
import { simiUseQuery as useQuery, simiUseMutation as useMutation } from 'src/simi/Network/Query';
import { useFormState } from 'informed';
import { validateEmail } from 'src/simi/Helper/Validation';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

window.simiCustomerAddress = []

export const useSimiBillingAddress = props => {
    const {
        queries: { getCustomerAddressesQuery, getCustomerCartAddressQuery },
        mutation: { setGuestEmailOnCartBilling },
        initialValues,
        isBillingAddressSame
    } = props;

    const [{ isSignedIn }] = useUserContext();
    const formState = useFormState();

    const [{
        cartId,
        details: {
            email
        }
    }] = useCartContext();
    const [selectedAddress, setSelectedAddress] = useState(initialValues.saved_address_for_billing ? initialValues.saved_address_for_billing : -1);

    const {
        data: customerAddressesData,
        error: customerAddressesError,
        loading: customerAddressesLoading
    } = useQuery(getCustomerAddressesQuery, { skip: !isSignedIn });

    const {
        data: customerCartAddressData,
        error: customerCartAddressError,
        loading: customerCartAddressLoading
    } = useQuery(getCustomerCartAddressQuery, { skip: (!isSignedIn || !isBillingAddressSame) });


    const [setGuestEmailOnCart, {
        data: setGuestEmailOnCartData,
        loading: setGuestEmailOnCartLoading,
        error: setGuestEmailOnCartError,
        called: setGuestEmailOnCartCalled
    }] = useMutation(setGuestEmailOnCartBilling);

    useEffect(() => {
        if (customerAddressesError) {
            console.error(customerAddressesError);
        }

        if (customerCartAddressError) {
            console.error(customerCartAddressError);
        }
    }, [customerAddressesError, customerCartAddressError]);

    //to save email to cart when cart is virtual (no shipping address with email before)
    const handleSetGuestEmailOnCart = useCallback((simi_guest_email) => {
        if (!setGuestEmailOnCartLoading && simi_guest_email && validateEmail(simi_guest_email)) {
            setGuestEmailOnCart({ variables: { cartId, email: simi_guest_email } })
        }
    }, [setGuestEmailOnCartLoading, setGuestEmailOnCart, cartId])

    const isLoading =
        customerAddressesLoading ||
        customerCartAddressLoading;

    if (customerAddressesData && customerAddressesData.customer.addresses &&
        customerAddressesData && customerAddressesData.customer.addresses.length) {
        window.simiCustomerAddress = customerAddressesData.customer.addresses
    }

    const customerAddresses = window.simiCustomerAddress

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

    return {
        customerAddresses,
        isLoading,
        handleSelectAddress,
        selectedAddress,
        isSignedIn,
        handleSetGuestEmailOnCart,
        cartEmail: email
    };
};
