//use to modify resourceUrl in order to call directly to merchant magento site instead of using upward
export const addMerchantUrl = (resouceUrl) => {
    if (
        !resouceUrl.includes('http://') && !resouceUrl.includes('https://') &&
        window.SMCONFIGS && window.SMCONFIGS.directly_request && window.SMCONFIGS.merchant_url
    ) {
        return (window.SMCONFIGS.merchant_url + resouceUrl)
    }
    return resouceUrl
}