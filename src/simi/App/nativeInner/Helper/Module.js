export const isCallForPriceEnable = () => {
    return window.SMCONFIGS && window.SMCONFIGS.plugins && window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE && parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE) === 1;
}

export const isStoreLocatorEnable = () => {
    return window.SMCONFIGS && window.SMCONFIGS.plugins && window.SMCONFIGS.plugins.SM_ENABLE_STORE_LOCATOR && parseInt(window.SMCONFIGS.plugins.SM_ENABLE_STORE_LOCATOR) === 1;
}