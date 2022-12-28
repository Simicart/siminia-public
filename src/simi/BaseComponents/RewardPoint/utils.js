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

export const getRewardPointActive = () => {
    const rewardPointConfig = getRewardPointStoreConfig()

    return (parseInt(rewardPointConfig.active) === 1 && rewardPointEnabled) || false
}

export const getRewardPointIcon = () => {
  const rewardPointConfig = getRewardPointStoreConfig()

  return rewardPointConfig.point_icon || ''
}