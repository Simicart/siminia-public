import React from 'react';
import Select from "@magento/venia-ui/lib/components/Select/select";
import { useBaseInput } from '../../../utils/useBaseInput';
import { getFirstInArr } from '../../../utils/getFirstInArr';
import Optionlabel from '../../../../CustomOption/components/OptionLabel/OptionLabel';

export const Dropdown = (props) => {
    const {item} = props
    const storeConfig = Identify.getStoreConfig();
    let textValue;
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
    const isNarrowSymbolSupported = (() => {
        try {
            new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'narrowSymbol'
            });

            return true;
        } catch (e) {
            if (e.constructor !== RangeError) {
                console.warn(e);
            }

            return false;
        }
    })();

    const { locale } = useIntl();
    const currencyDisplay = 'narrowSymbol';
    const localeFallback = isNarrowSymbolSupported ? locale : 'en';
    const currencyDisplayFallback = isNarrowSymbolSupported
        ? currencyDisplay
        : 'symbol';
    const optionComponents = (item.options || []).map(v => {
        if (storeConfig && storeConfig.storeConfig) {
            let base = {};
            if (
                storeConfig.simiStoreConfig &&
                storeConfig.simiStoreConfig.config &&
                storeConfig.simiStoreConfig.config.base
            ) {
                base = storeConfig.simiStoreConfig.config.base;
            }
            const currencyCode =
                storeConfig && storeConfig.storeConfig
                    ? storeConfig.storeConfig.base_currency_code
                    : '';
            const decimal_separator = base.decimal_separator || '.';
            const thousand_separator = base.thousand_separator || ',';
            const max_number_of_decimals = base.max_number_of_decimals || 2;
            const priceValue = putThousandsSeparators(
                v.price,
                thousand_separator,
                decimal_separator,
                max_number_of_decimals
            );
            const parts = patches.toParts.call(
                new Intl.NumberFormat(localeFallback, {
                    style: 'currency',
                    currencyDisplay: currencyDisplayFallback,
                    currency: currencyCode
                }),
                0
            );
            const symbol = parts.find(part => part.type === 'currency');
            textValue = v.title + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0'  + '+' + symbol.value + priceValue;

        }
        return {
            label: textValue,
            value: v.id
        }
    })

    const {handleSelected, fieldName} = useBaseInput({
        ...props,
        defaultValue: item.required ? getFirstInArr(optionComponents, {}).value : undefined
    })


    return (
        <Select
            field={fieldName}
            items={optionComponents}
            onValueChange={handleSelected}
        />
    );
};

