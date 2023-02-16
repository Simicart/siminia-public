import useStoreConfig from '../../talons/useStoreConfig'

const checkEnabledGiftCard = () => {
    const storeConfig = useStoreConfig()

    const giftCardEnabled =
        window.SMCONFIGS &&
        window.SMCONFIGS.plugins &&
        window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD &&
        parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;

    return storeConfig.data?.bssGiftCardStoreConfig.active === 1 && giftCardEnabled
}

export default checkEnabledGiftCard