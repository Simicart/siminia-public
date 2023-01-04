import Identify from 'src/simi/Helper/Identify';

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;
  
export const getRewardPointStoreConfig = () => {
    const storeConfig = Identify.getStoreConfig();

    return (storeConfig && storeConfig.bssRewardPointStoreConfig) || {};
};

export const getStoreConfig = () => {
    const storeConfigData = Identify.getStoreConfig();

    return storeConfigData?.storeConfig || {}
}

export const getRewardPointActive = () => {
    const rewardPointConfig = getRewardPointStoreConfig()

    return (parseInt(rewardPointConfig.active) === 1 && rewardPointEnabled) || false
}

export const getRewardPointIcon = () => {
  const rewardPointConfig = getRewardPointStoreConfig()

  return rewardPointConfig.point_icon || ''
}

export const getBaseCurrency = () => {
    const storeConfig = getStoreConfig()

    return storeConfig?.base_currency_code || 'USD'
}

export const formatDate = (currentDate) => {
    if(!currentDate) return null

    const date = new Date(currentDate)

    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}