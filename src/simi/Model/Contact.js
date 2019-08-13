import { sendRequest } from 'src/simi/Network/RestMagento';

export const sendContact = (postData, callBack) => {
    sendRequest('rest/V1/simiconnector/contacts', callBack, 'POST',{}, postData)
}
