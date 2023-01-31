import Identify from 'src/simi/Helper/Identify';

const callForPriceEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE) === 1;

export const getHidePriceConfig = () => {
    const storeConfig = Identify.getStoreConfig();

    return storeConfig?.getConfigAdvancedHidePrice || {};
};

export const getHidePriceEnable = () => {
    const hidePriceConfig = getHidePriceConfig();

    return (
        (parseInt(hidePriceConfig.enable) === 1 && callForPriceEnabled) ||
        false
    );
};

export const getFormFields = () => {
    const hidePriceConfig = getHidePriceConfig();

    return hidePriceConfig?.form_fields || []
}

export const getIsShowCustomerFields = () => {
    const hidePriceConfig = getHidePriceConfig();

    return hidePriceConfig?.is_show_customer_fields || false
}

export const getRecaptcha = () => {
    const hidePriceConfig = getHidePriceConfig();

    return hidePriceConfig?.recaptcha || false
}

export const getSiteKey = () => {
    const hidePriceConfig = getHidePriceConfig();

    return hidePriceConfig?.site_key || ''
}

