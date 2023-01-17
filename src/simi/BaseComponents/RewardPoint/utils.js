import Identify from 'src/simi/Helper/Identify';

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

export const getRewardPointStoreConfig = () => {
    const storeConfig = Identify.getStoreConfig();

    return storeConfig?.bssRewardPointStoreConfig || {};
};

export const getStoreConfig = () => {
    const storeConfigData = Identify.getStoreConfig();

    return storeConfigData?.storeConfig || {};
};

export const getRewardPointActive = () => {
    const rewardPointConfig = getRewardPointStoreConfig();

    return (
        (parseInt(rewardPointConfig.active) === 1 && rewardPointEnabled) ||
        false
    );
};

export const getRewardPointIcon = () => {
    const rewardPointConfig = getRewardPointStoreConfig();

    return rewardPointConfig.point_icon || '';
};

export const getRewardPointSlider = () => {
    const rewardPointConfig = getRewardPointStoreConfig();

    return parseInt(rewardPointConfig.point_slider) === 1 || false
}

export const getRewardPointHeader = () => {
    const rewardPointConfig = getRewardPointStoreConfig();

    return parseInt(rewardPointConfig.sw_point_header) === 1 || false
}

export const getRewardPointMessRegister = () => {
    const rewardPointConfig = getRewardPointStoreConfig(); 

    return parseInt(rewardPointConfig.point_mess_register) === 1 || false
}

export const getRewardPointSubscrible = () => {
    const rewardPointConfig = getRewardPointStoreConfig(); 

    return parseInt(rewardPointConfig.point_subscrible) === 1 || false
}

export const getRewardPointProductReview = () => {
    const rewardPointConfig = getRewardPointStoreConfig(); 

    return parseInt(rewardPointConfig.product_page_tab_review) === 1 || false
}

export const getRewardPointProductPage = () => {
    const rewardPointConfig = getRewardPointStoreConfig(); 

    return parseInt(rewardPointConfig.product_page_reward_point) === 1 || false
}

export const getRewardPointCatePage = () => {
    const rewardPointConfig = getRewardPointStoreConfig(); 

    return parseInt(rewardPointConfig.cate_page_reward_point) === 1 || false
}

export const getRewardPointCartOrderSummary= () => {
    const rewardPointConfig = getRewardPointStoreConfig(); 

    return parseInt(rewardPointConfig.cart_order_summary) === 1 || false
}


export const getBaseCurrency = () => {
    const storeConfig = getStoreConfig();

    return storeConfig?.base_currency_code || 'USD';
};

export const formatDate = currentDate => {

    const date = new Date(currentDate);

    if (date instanceof Date && !isNaN(date)) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    return null
};
