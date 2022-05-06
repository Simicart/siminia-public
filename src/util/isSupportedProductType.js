const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct', 'GroupedProduct', 'BundleProduct', 'MpGiftCardProduct'];

export const isSupportedProductType = productType => {
    return SUPPORTED_PRODUCT_TYPES.includes(productType);
};
