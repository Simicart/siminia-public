import { Util } from '@magento/peregrine';
import actions from './actions';
import userActions from 'src/actions/user/actions';
import checkoutActions from 'src/actions/checkout/actions';
import { getCartDetails, removeCart } from 'src/actions/cart';
import { getUserDetails, setToken } from 'src/actions/user';
import { refresh } from 'src/util/router-helpers';

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const beginCheckout = () =>
    async function thunk(dispatch) {
        dispatch(checkoutActions.begin());
        dispatch(getShippingMethods());
    };

export const changeSampleValue = value => async dispatch => {
    dispatch(actions.changeSampleValue(value));
};

export const setStoreConfig = value => async dispatch => {
    dispatch(actions.setStoreConfig(value));
};

export const simiSignedIn = response => async dispatch => {
    localStorage.removeItem('M2_VENIA_BROWSER_PERSISTENCE__cartId');
    dispatch(removeCart());
    dispatch(setToken(response));
    dispatch(getUserDetails()).then(() => dispatch(fullFillAddress()));
    dispatch(getCartDetails({ forceRefresh: true }));
    // dispatch(fullFillAddress());
};

export const simiSignOut = ({ history }) => async dispatch => {
    // Sign the user out in local storage and Redux.
    await clearToken();

    // Now that we're signed out, forget the old (customer) cart
    // and fetch a new guest cart.
    dispatch(removeCart());
    dispatch(getCartDetails({ forceRefresh: true }));

    // remove address
    storage.removeItem('cartId');
    storage.removeItem('signin_token');
    sessionStorage.removeItem('shipping_address');
    sessionStorage.removeItem('billing_address');
    localStorage.removeItem('SIMI_SESS_ID');
    localStorage.removeItem('M2_VENIA_BROWSER_PERSISTENCE__cartId');
    await clearBillingAddress();
    await clearShippingAddress();

    // Finally, go back to the first page of the browser history.
    refresh({ history });
};

export const saveCustomerDetail = value => async dispatch => {
    dispatch(userActions.getDetails.receive(value));
};
