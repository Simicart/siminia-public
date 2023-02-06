import { taxConfig } from './Pricing';
import Identify from './Identify';

//prepare product price and options
export const prepareProduct = product => {
    const modedProduct = JSON.parse(JSON.stringify(product));
    const price = modedProduct.price;

    //add tax to price
    const merchantTaxConfig = taxConfig();
    const adjustments =
        product.type_id === 'grouped'
            ? price.minimalPrice.adjustments
            : price.regularPrice.adjustments;
    price.show_ex_in_price =
        adjustments && adjustments.length
            ? parseInt(merchantTaxConfig.tax_display_type, 10) === 3
                ? 1
                : 0
            : 0;
    price.minimalPrice.excl_tax_amount = addExcludedTaxAmount(
        price.minimalPrice.amount,
        price.minimalPrice.adjustments
    );
    price.regularPrice.excl_tax_amount = addExcludedTaxAmount(
        price.regularPrice.amount,
        price.regularPrice.adjustments
    );
    price.maximalPrice.excl_tax_amount = addExcludedTaxAmount(
        price.maximalPrice.amount,
        price.maximalPrice.adjustments
    );

    //check discount (for simple, downloadable, virtual products)
    price.has_special_price = false;
    if (
        product.type_id !== 'grouped' &&
        product.type_id !== 'configurable' &&
        product.type_id !== 'bundle'
    ) {
        price.has_special_price =
            price.regularPrice.amount.value > price.minimalPrice.amount.value
                ? true
                : false;
        if (price.has_special_price) {
            const sale_off =
                100 -
                (price.minimalPrice.amount.value /
                    price.regularPrice.amount.value) *
                    100;
            price.discount_percent = sale_off.toFixed(0);
        }
    }

    modedProduct.price = price;
    return modedProduct;
};

const addExcludedTaxAmount = (amount, adjustments) => {
    let excludedTaxPrice = amount.value;
    if (adjustments && adjustments.length) {
        adjustments.forEach(adjustment => {
            if (
                adjustment.description === 'INCLUDED' &&
                adjustment.code === 'TAX'
            ) {
                excludedTaxPrice = excludedTaxPrice - adjustment.amount.value;
            }
        });
    }
    return {
        value: excludedTaxPrice,
        currency: amount.currency
    };
};

export const convertMagentoFilterToSimiFilter = filters => {
    return filters.map(filter => {
        return {
            name: filter.label,
            filter_items_count: filter.count,
            request_var: filter.attribute_code,
            filter_items: filter.options.map(fItem => {
                return {
                    label: fItem.label,
                    value_string: fItem.value
                };
            })
        };
    });
};

export const convertSimiFilterInputToMagentoFilterInput = (
    filterInputs = {},
    categoryId = null
) => {

    const keys = Object.keys(filterInputs);
    keys.forEach(key => {
        if (Array.isArray(filterInputs[key])) {
            filterInputs[key] = { in: filterInputs[key] };
        } else if (key === 'price') {
            const priceValues = filterInputs[key].split('_');
            if (priceValues && priceValues.length > 1)
                filterInputs[key] = {
                    from: priceValues[0],
                    to: priceValues[1]
                };
            else delete filterInputs[key];
        }
    });
    if (categoryId) {
        if (filterInputs['category_id'] && filterInputs['category_id']['in']) {
            //do nothing
        } else {
            filterInputs['category_id'] = { eq: String(categoryId) };
        }
        if(filterInputs.hasOwnProperty('category_uid')) {
            delete filterInputs['category_uid']
        }
    }
    return filterInputs;
};

export const reviewEnabled = () => {
    const storeConfig = Identify.getStoreConfig();
    if (
        storeConfig &&
        storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config &&
        storeConfig.simiStoreConfig.config.catalog &&
        storeConfig.simiStoreConfig.config.catalog.review
            .catalog_review_active === '0'
    ) {
        return false;
    }
    return true;
};
