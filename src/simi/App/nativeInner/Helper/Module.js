export const isCallForPriceEnable = () => {
    return window.SMCONFIGS && window.SMCONFIGS.plugins && window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE && parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE) === 1;
}