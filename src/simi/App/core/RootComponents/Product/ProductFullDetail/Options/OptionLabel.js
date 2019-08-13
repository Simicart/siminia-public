import React from 'react'
import {taxConfig, formatPrice} from "src/simi/Helper/Pricing";
import Identify from 'src/simi/Helper/Identify';
import PropTypes from 'prop-types';
import {configColor} from 'src/simi/Config'

const Optionlabel = props => {
    const {classes, title, item, type_id} = props
    let style = props.style?props.style:{}
    const merchantTaxConfig = taxConfig()?taxConfig():{}
    let returnedLabel = title?title:''
    style = {...{
        display : 'inline-block',
        fontWeight: '400'
    },...style}
    const priceStyle= {
        color: configColor.price_color, 
        fontSize: 13,
        fontWeight: 200
    }
    const symbol = <span style={{margin:'0 5px 0 10px'}}>+</span>

    const renderBothPrices = (included, excluded) => {
        return (
            <div style={style} className={classes['label-option-text']}>
                <span style={{
                    fontSize: '16px',
                }}>{title}</span>
                <span className={classes['label-option-price']} style={priceStyle}>
                    {symbol}
                    {formatPrice(included)}
                </span>
                <span style={{...{margin:'0 10px'}, ...priceStyle}} className={classes['label-option-price']}>
                    ({`${Identify.__('Excl. Tax')}`} {formatPrice(excluded)})
                </span>
            </div>
        )
    }

    const renderOnePrice = (price) => {
        return (
            <div style={style} className={classes['label-option-text']}>
                <span style={{
                    fontSize: '16px',
                }}>{title}</span>
                <span className={classes['label-option-price']} style={priceStyle}>
                    {symbol}
                    {formatPrice(price)}
                </span>
            </div>
        )
    }

    //custom opton label
    if (type_id === 'simple' || type_id === 'configurable') {
        if (item.price_excluding_tax && item.price_including_tax && item.price_including_tax.price) {
            if (parseInt(merchantTaxConfig.tax_display_type) === 3 && (item.price_excluding_tax.price !== item.price_including_tax.price)) {
                returnedLabel = renderBothPrices(item.price_including_tax.price, item.price_excluding_tax.price)
            } else {
                returnedLabel = renderOnePrice(item.price_including_tax.price)
            }
        } else if (item.price) {
            returnedLabel = renderOnePrice(item.price)
        }
    } else if (type_id === 'bundle' && item.prices) {
        if (parseInt(merchantTaxConfig.tax_display_type) === 3 && (item.prices.finalPrice.amount !== item.prices.basePrice.amount)) {
            returnedLabel = renderBothPrices(item.prices.finalPrice.amount, item.prices.basePrice.amount)
        } else {
            returnedLabel = renderOnePrice(item.prices.finalPrice.amount)
        }
    } else if (type_id === 'downloadable') { 
        if (item.price_including_tax.price && item.price_excluding_tax.price){
            returnedLabel = renderBothPrices(item.price_including_tax.price, item.price_excluding_tax.price)
        } else if (item.price) {
            returnedLabel = renderOnePrice(item.price)
        }
    }
    return (
        <div style={style} className={classes['label-option-text']}>
            <span style={{
                fontSize: '16px',
            }}>{returnedLabel}</span>
        </div>
    )
}

Optionlabel.propTypes = {
    item : PropTypes.object.isRequired,
    classes : PropTypes.object,
    type_id : PropTypes.string, //custom_options, configurable_options, grouped_options, bundle_options, download_options
    style : PropTypes.object,
    label: PropTypes.string,
}

Optionlabel.defaultProps = {
    style : {},
    classes : {},
    type_id : 'simple',
}

export default Optionlabel