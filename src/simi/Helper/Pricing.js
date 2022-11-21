import React from 'react';
import Identify from './Identify';
import CurrencySymbol from '@magento/venia-ui/lib/components/CurrencySymbol';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

export const HOPrice = props => {
    const { value, currencyCode } = props;
    return formatPrice(value, currencyCode);
};

export const formatPrice = (price, currencyCode = null, negative = false, useNumber = false) => {
    if (typeof price !== 'number') {
        price = parseFloat(price);
    }
    const storeConfig = Identify.getStoreConfig();
    if (storeConfig && storeConfig.storeConfig) {
        const negativeVal = price < 0;
        price = Math.abs(price);
        let base = {};
        let currency_symbol = false;
        if (
            storeConfig.simiStoreConfig &&
            storeConfig.simiStoreConfig.config &&
            storeConfig.simiStoreConfig.config.base
        ) {
            base = storeConfig.simiStoreConfig.config.base;
            const { currencies } = base;
            if (!currencyCode || currencyCode === base.currency_code)
                currency_symbol = base.currency_symbol || base.currency_code;
            if (
                currencies instanceof Array &&
                currencies.length &&
                currencyCode !== base.currency_code &&
                currencies.find(({ value }) => currencyCode === value)
            ) {
                const foundSymbol = currencies.find(
                    ({ value }) => currencyCode === value
                );
                currency_symbol = foundSymbol.symbol;
            }
        }

        const currency_code =
            storage.getItem('store_view_currency') ||
            (storeConfig && storeConfig.storeConfig
                ? storeConfig.storeConfig.base_currency_code
                : '');
        const currency_position = base.currency_position || 'before';
        const decimal_separator = base.decimal_separator || '.';
        const thousand_separator = base.thousand_separator || ',';
        const max_number_of_decimals = base.max_number_of_decimals || 2;
        const currencyBefore = currency_position === 'before';
        currency_symbol = (
            <span className={`simi-currency-symbol ${currency_position}`}>
                {currency_symbol || (
                    <CurrencySymbol
                        currencyCode={currency_code}
                        currencyDisplay={'narrowSymbol'}
                    />
                )}
            </span>
        );
        return (
            <span className="price manually-formated-price">
                {negativeVal && '-'}
                {currencyBefore && currency_symbol}
                <span className="simi-priceval">
                    {putThousandsSeparators(
                        price,
                        thousand_separator,
                        decimal_separator,
                        max_number_of_decimals
                    )}
                </span>
                {!currencyBefore && currency_symbol}
            </span>
        );
    }

    // Render raw value if no storeconfig defined
    if (useNumber) {
        const currencyBefore = true;
        return (
            <span className="price manually-formated-price flex">
                { ((price < 0) || negative) && <span>&ndash;</span>}
                    {currencyBefore && <span>&nbsp;{currencyCode}</span>}
                    <span className="simi-priceval">
                        &nbsp;
                        {putThousandsSeparators(price, ',', '.', 2)}
                        &nbsp;
                    </span>
                    {!currencyBefore && currencyCode}
            </span>
        )
    }
    return '';
};

export const taxConfig = () => {
    const storeConfig = Identify.getStoreConfig();
    if (
        storeConfig &&
        storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config &&
        storeConfig.simiStoreConfig.config.tax
    )
        return (
            storeConfig.simiStoreConfig.config &&
            storeConfig.simiStoreConfig.config.tax
        );
    return {
        tax_display_type: '2', // 1 - exclude , 2 - include, 3 - both
        tax_display_shipping: '3',
        tax_cart_display_price: '3',
        tax_cart_display_subtotal: '3',
        tax_cart_display_shipping: '3',
        tax_cart_display_grandtotal: '0',
        tax_cart_display_full_summary: '0',
        tax_cart_display_zero_tax: '0',
        tax_sales_display_price: '1',
        tax_sales_display_subtotal: '1',
        tax_sales_display_shipping: '1',
        tax_sales_display_grandtotal: '0',
        tax_sales_display_full_summary: '0',
        tax_sales_display_zero_tax: '0'
    };
};

const putThousandsSeparators = (
    value,
    sep,
    decimal,
    max_number_of_decimals
) => {
    if (!max_number_of_decimals) {
        const storeConfig = Identify.getStoreConfig();
        max_number_of_decimals =
            (storeConfig &&
                storeConfig.simiStoreConfig &&
                storeConfig.simiStoreConfig.config &&
                storeConfig.simiStoreConfig.config.base
                    .max_number_of_decimals) ||
            2;
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
        var parts = value.toString().split(decimal);
        // format whole numbers
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        // put them back together
        value = parts[1] ? parts.join(decimal) : parts[0];
    } else {
        value = value.toLocaleString();
    }
    return value;
};

export const getCurrencySymbol = () => {
    const storeConfig = Identify.getStoreConfig();
    if (
        storeConfig &&
        storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config &&
        storeConfig.simiStoreConfig.config.base
    ) {
        const { base } = storeConfig.simiStoreConfig.config;
        return base.currency_symbol || base.currency_code;
    }
    return '';
};
