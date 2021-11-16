import React from 'react'
import Identify from 'src/simi/Helper/Identify';
import { formatPrice, taxConfig as getTaxConfig } from 'src/simi/Helper/Pricing';
import { configColor } from 'src/simi/Config';

const Total = props => {
    const { prices, cartShipping } = props
    if (!prices || !prices.grand_total)
        return ''
    const taxConfig = getTaxConfig();
    if (!taxConfig)
        return ''
    const {
        tax_cart_display_subtotal
    } = taxConfig

    const totalRows = [];
    Object.keys(prices).forEach(index => {
        const item = prices[index]
        if (!item)
            return

        let className = 'custom'
        let title = item.label
        let itemValue = item.value;
        if (index === 'subtotal_excluding_tax') {
            className = 'subtotal'
            if (parseInt(tax_cart_display_subtotal) === 1) {
                title = Identify.__('Subtotal')
            } else if (parseInt(tax_cart_display_subtotal) === 3) {
                title = Identify.__('Subtotal (Excl. Tax)')
            }
        } else if (index === 'subtotal_including_tax') {
            className = 'subtotal'
            if (parseInt(tax_cart_display_subtotal) === 2) {
                title = Identify.__('Subtotal')
            } else if (parseInt(tax_cart_display_subtotal) === 3) {
                title = Identify.__('Subtotal (Incl. Tax)')
            }
        } else if (index === 'grand_total') {
            //show shipping before grand total
            if (cartShipping && cartShipping.amount && cartShipping.amount.value) {
                totalRows.push(
                    <div key="shipping" className="shipping">
                        <div>
                            <span className="label">{Identify.__('Shipping')}</span>
                            <span className="price" style={{ color: configColor.price_color }}>
                                {formatPrice(cartShipping.amount.value, cartShipping.amount.currency)}
                            </span>
                        </div>
                    </div>
                )
            }
            title = Identify.__('Grand Total')
            className = "grand_total"
        } else if (index === 'discount') {
            if (item.amount && item.amount.value) {
                itemValue = item.amount.value
                if (title && title[0]) {
                    title = Identify.__('Discount (%s)').replace('%s', title[0])
                } else {
                    title = Identify.__('Discount')
                }
                className = "discount"
            } else {
                itemValue = 0
            }
        }


        if (title && (itemValue || (index === 'grand_total')))
            totalRows.push(
                <div key={index} className={className}>
                    <div>
                        <span className="label">{title}</span>
                        <span className="price" style={{ color: configColor.price_color }}>
                            {formatPrice(itemValue, item.currency)}
                        </span>
                    </div>
                </div>
            )
    })

    return (
        <div className="cart-total" >
            {totalRows}
        </div>
    )
}

export default Total
