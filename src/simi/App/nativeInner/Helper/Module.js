export const isCallForPriceEnable = () => {
    return window.SMCONFIGS && window.SMCONFIGS.plugins && window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE && parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE) === 1;
}

export const isGiftCardEnable = () => {
    return window.SMCONFIGS && window.SMCONFIGS.plugins && window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD && parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;
}