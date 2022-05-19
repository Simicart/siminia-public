/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
    [`@magento/venia-ui/lib/components/Routes/routes.js`]: '@simicart/siminia/src/override/routesNative.js',
    [`@magento/venia-ui/lib/components/App/localeProvider.js`]: '@simicart/siminia/src/override/localeProvider.js',
    [`@magento/peregrine/lib/talons/CategoryTree/useCategoryTree.js`]: '@simicart/siminia/src/override/useCategoryTree.js',
    [`@magento/peregrine/lib/talons/Header/useStoreSwitcher.js`]: '@simicart/siminia/src/simi/talons/Header/useStoreSwitcher.js',
    [`@magento/peregrine/lib/talons/Header/useCurrencySwitcher.js`]: '@simicart/siminia/src/simi/talons/Header/useCurrencySwitcher.js',
    [`@magento/peregrine/lib/talons/MegaMenu/useMegaMenu.js`]: '@simicart/siminia/src/override/useMegaMenu.js',
    [`@magento/venia-ui/lib/components/Button/button.module.css`]: '@simicart/siminia/src/override/button.module.css',
    [`@magento/peregrine/lib/util/deriveErrorMessage.js`]: '@simicart/siminia/src/override/deriveErrorMessage.js',
    [`@magento/venia-ui/lib/components/LoadingIndicator/index.js`]: '@simicart/siminia/src/override/LoadingIndicator/index.js'
    // [`@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation/AddressForm/guestForm.js`] : '@simicart/siminia/src/override/guestForm.js'
};
