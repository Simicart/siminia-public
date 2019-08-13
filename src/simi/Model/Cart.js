import { sendRequest } from 'src/simi/Network/RestMagento';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const addToCart = (callBack, params) => {
    let getParams = storage.getItem('cartId');
    getParams = getParams?{quote_id: getParams}:{}
    sendRequest('rest/V1/simiconnector/quoteitems', callBack, 'POST', getParams, params)
}

export const removeItemFromCart = (callBack, itemId, isSignedIn) => {
    if (isSignedIn)
        sendRequest('rest/V1/carts/mine/items/' + itemId, callBack, 'DELETE')
    else {
        const cartId = storage.getItem('cartId');
        if (!cartId) {
            callBack({});
            return;
        }
        sendRequest('rest/V1/guest-carts/'+ cartId + '/items/' + itemId, callBack, 'DELETE')
    }
}

export const updateCoupon = (callBack, params) => {
    let getParams = storage.getItem('cartId');
    getParams = getParams ? {quote_id: getParams} : {};
    sendRequest('rest/V1/simiconnector/quoteitems', callBack, 'PUT', getParams, params)
}