import { sendRequest } from 'src/simi/Network/RestMagento';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const createAccount = (callBack, accountInfo) => {
    sendRequest('/rest/V1/simiconnector/customers', callBack, 'POST', {}, accountInfo)
}

export const simiSignIn = (callBack, postData) => {
    const getData = {getSessionId: 1}
    const cartId = storage.getItem('cartId');
    if (cartId)
        getData.quote_id = cartId
    sendRequest('/rest/V1/integration/customer/token', callBack, 'POST', getData, postData)
}

export const editCustomer = (callBack, postData) => {
    sendRequest('/rest/V1/simiconnector/customers', callBack, 'PUT', {}, postData);
}

export const checkExistingCustomer = (callBack, email) => {
    const params = {};
    params['customer_email'] = email;
    sendRequest('/rest/V1/simiconnector/customers/checkexisting', callBack, 'GET', params);
}

export const forgotPassword = (callBack, email) => {
    sendRequest('/rest/V1/simiconnector/customers/forgetpassword', callBack, 'GET', {email});
}

export const logout = (callBack, params) => {
    sendRequest('/rest/V1/simiconnector/customers/logout', callBack, 'GET', params)
}

export const createPassword = (callBack, passwordInfo) => {
    sendRequest('/rest/V1/simiconnector/customers/createpassword', callBack, 'GET', passwordInfo)
}
