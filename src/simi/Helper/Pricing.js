import React from 'react';
import Identify from './Identify'
import { Price } from '@magento/peregrine'

export const formatPrice = (value, currency = null) => {
    if (!currency)
        currency = currencyCode()
    return (
        <Price
            currencyCode={currency}
            value={value}
        />
    )
}

export const currencyCode = () => {
    const storeConfig = Identify.getStoreConfig()
    if (!storeConfig)
        return 'USD'
    if (storeConfig && storeConfig.simiStoreConfig
        && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.base
        && storeConfig.simiStoreConfig.config.base.currency_code)
        return storeConfig.simiStoreConfig.config.base.currency_code
    if (storeConfig.storeConfig && storeConfig.storeConfig.default_display_currency_code)
        return storeConfig.storeConfig.default_display_currency_code
}

export const taxConfig = () => {
    const storeConfig = Identify.getStoreConfig()
    if (storeConfig && storeConfig.simiStoreConfig
        && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.tax)
        return storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.tax
    return (
        {
            "tax_display_type": "3",
            "tax_display_shipping": "3",
            "tax_cart_display_price": "3",
            "tax_cart_display_subtotal": "3",
            "tax_cart_display_shipping": "3",
            "tax_cart_display_grandtotal": "0",
            "tax_cart_display_full_summary": "0",
            "tax_cart_display_zero_tax": "0",
            "tax_sales_display_price": "1",
            "tax_sales_display_subtotal": "1",
            "tax_sales_display_shipping": "1",
            "tax_sales_display_grandtotal": "0",
            "tax_sales_display_full_summary": "0",
            "tax_sales_display_zero_tax": "0"
        }
    )
}

export const formatLabelPrice = (price, type = 0) => {
    if (typeof(price) !== "number") {
        price = parseFloat(price);
    }

    const storeConfig = Identify.getStoreConfig()
    if (storeConfig !== null) {
        const currency_symbol = storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.base.currency_symbol || storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.base.currency_code;
        const currency_position = storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.base.currency_position;
        const decimal_separator = storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.base.decimal_separator;
        const thousand_separator = storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.base.thousand_separator;
        const max_number_of_decimals = storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.base.max_number_of_decimals;
        if (type === 1) {
            return putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
        }
        if (currency_position === "before") {
            return currency_symbol + putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
        } else {
            return putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals) + currency_symbol;
        }
    }

}

const putThousandsSeparators = (value, sep, decimal, max_number_of_decimals) => {
    if (!max_number_of_decimals) {
        const storeConfig = Identify.getStoreConfig()
        max_number_of_decimals = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.base.max_number_of_decimals || 2;
    }

    if (sep == null) {
        sep = ',';
    }
    if (decimal == null) {
        decimal = '.';
    }

    value = value.toFixed(max_number_of_decimals);
    // check if it needs formatting
    if (value.toString() === value.toLocaleString()) {
        // split decimals
        var parts = value.toString().split(decimal)
        // format whole numbers
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        // put them back together
        value = parts[1] ? parts.join(decimal) : parts[0];
    } else {
        value = value.toLocaleString();
    }
    return value;
}
