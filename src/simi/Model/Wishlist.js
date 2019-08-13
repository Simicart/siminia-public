import { sendRequest } from 'src/simi/Network/RestMagento';

export const addToWishlist = (callBack , params) => {
    sendRequest('rest/V1/simiconnector/wishlistitems', callBack, 'POST', {}, params)
}

export const getWishlist = (callBack, params) => {
    sendRequest('rest/V1/simiconnector/wishlistitems', callBack, 'GET', params)
}

export const removeWlItem = (id, callBack) => {
    sendRequest(`rest/V1/simiconnector/wishlistitems/${id}`, callBack, 'DELETE')
}

export const addWlItemToCart = (id, callBack) =>{
    sendRequest(`rest/V1/simiconnector/wishlistitems/${id}`, callBack, 'GET', {add_to_cart: 1})
}