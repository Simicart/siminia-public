import {taxConfig} from './Pricing'

//prepare product price and options
export const prepareProduct = (product) => {
    const modedProduct = JSON.parse(JSON.stringify(product))
    const price = modedProduct.price

    //add tax to price
    const merchantTaxConfig = taxConfig()
    const adjustments = (product.type_id === 'grouped')?price.minimalPrice.adjustments:price.regularPrice.adjustments
    price.show_ex_in_price = (adjustments && adjustments.length)?parseInt(merchantTaxConfig.tax_display_type, 10) === 3 ? 1 : 0 : 0
    price.minimalPrice.excl_tax_amount = addExcludedTaxAmount(price.minimalPrice.amount, price.minimalPrice.adjustments)
    price.regularPrice.excl_tax_amount = addExcludedTaxAmount(price.regularPrice.amount, price.regularPrice.adjustments)
    price.maximalPrice.excl_tax_amount = addExcludedTaxAmount(price.maximalPrice.amount, price.maximalPrice.adjustments)

    //check discount (for simple, downloadable, virtual products)
    price.has_special_price = false
    if (product.type_id !== 'grouped' && product.type_id !== 'configurable' && product.type_id !== 'bundle') {
        price.has_special_price = (price.regularPrice.amount.value > price.minimalPrice.amount.value) ? true : false
        if (price.has_special_price) {
            const sale_off = 100 - (price.minimalPrice.amount.value / price.regularPrice.amount.value) * 100;
            price.discount_percent = sale_off.toFixed(0);
        }
    }

    modedProduct.price = price
    return modedProduct
}

const addExcludedTaxAmount = (amount, adjustments) => {
    let excludedTaxPrice = amount.value
    if (adjustments && adjustments.length) {
        adjustments.forEach(adjustment => {
            if (adjustment.description === 'INCLUDED' && adjustment.code === 'TAX') {
                excludedTaxPrice = excludedTaxPrice - adjustment.amount.value
            }
        })
    }
    return {
        value :excludedTaxPrice,
        currency: amount.currency
    }
}

//add simiProductListItemExtraField to items
export const applySimiProductListItemExtraField = (simiproducts) => {
    if (simiproducts.simiProductListItemExtraField) {
        simiproducts.items = simiproducts.items.map((product, index) => {
            const itemExtraField = simiproducts.simiProductListItemExtraField[index]
            if (itemExtraField && itemExtraField.extraData && itemExtraField.sku && itemExtraField.sku === product.sku) {
                product.simiExtraField = JSON.parse(itemExtraField.extraData)
            }
            return product
        })
    }
    return simiproducts
}