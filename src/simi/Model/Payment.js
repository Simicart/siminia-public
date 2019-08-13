import { sendRequest } from 'src/simi/Network/RestMagento';

export const paypalExpressStart = (callBack, getParams) => {
    sendRequest(`/rest/V1/simiconnector/ppexpressapis/start`, callBack, 'GET', getParams)
}

export const paypalPlaceOrder = (callBack, getParams) => {
    sendRequest(`/rest/V1/simiconnector/ppexpressapis/placeOrder`, callBack, 'GET', getParams)
}
