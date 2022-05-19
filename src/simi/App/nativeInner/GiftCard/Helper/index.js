export const saveGiftCardData = (attribute, value) => {
    const giftCardData = window.giftCardData || {}
    giftCardData[attribute] = value
}