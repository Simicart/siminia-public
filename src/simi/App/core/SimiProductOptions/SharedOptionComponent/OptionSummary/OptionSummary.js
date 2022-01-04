import React from 'react';
import {FormattedMessage} from 'react-intl';
import {any, bool, number, shape, string,} from "prop-types";
import Price from "@magento/venia-ui/lib/components/Price";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClass from './OptionSummary.module.css'

export const OptionSummary = (props) => {

    const {children, classes: newClass = {}, isVisible = true, price} = props || {}

    const classes = mergeClasses(defaultClass, newClass)

    if (!isVisible) {
        return null
    }

    return (
        <div className={classes.optionSummary}>
            <div className={classes.optionSummaryTitle}>
                <FormattedMessage
                    id="groupedOptions.product"
                    defaultMessage="Your Customization"
                />
                <div className={classes.optionSummaryPriceWrapper}>
                    <Price currencyCode={price.currency}
                           value={price.value}
                    />
                </div>
            </div>
            <div className={classes.optionSummarySpan}>
                <FormattedMessage
                    id="groupedOptions.product"
                    defaultMessage="Summary"
                />
            </div>
            {children}
        </div>
    )
}

OptionSummary.propTypes = {
    classes: shape({}),
    isVisible: bool,
    children: any,
    price: shape({
        value: number,
        currency: string
    })
}

