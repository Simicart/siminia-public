import { useUserContext } from '@magento/peregrine/lib/context/user';

export const flatten = data => {
    const { cart } = data ? data : {cart : {}};
    const { shipping_addresses } = cart ? cart : {};
    const address = (shipping_addresses && shipping_addresses[0]) ? shipping_addresses[0] : {};

    let shippingMethod = ''
    try {
        shippingMethod = `${
            address.selected_shipping_method.carrier_title
        } - ${address.selected_shipping_method.method_title}`;
    } catch (err) {

    }
    return {
        city: address.city,
        country: (address.country && address.country.label) ? address.country.label : null,
        email: cart.email,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: (address.region && address.region.label) ? address.region.label : null,
        shippingMethod,
        street: address.street,
        totalItemQuantity: cart.total_quantity
    };
};

export const useOrderConfirmationPage = props => {
    const { data } = props;
    const [{ isSignedIn }] = useUserContext();

    return {
        flatData: flatten(data),
        isSignedIn
    };
};
