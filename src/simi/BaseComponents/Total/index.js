import React from 'react'
import Identify from 'src/simi/Helper/Identify'
import { Price } from '@magento/peregrine'
import PropTypes from 'prop-types'
import {configColor} from 'src/simi/Config'

const Total = props => {
    const { currencyCode, data } = props
    if (!data.total_segments)
        return
    const total_segments = data.total_segments
    const totalRows = []

    total_segments.forEach((item, index) => {
        let className = 'custom'
        if (item.code == 'subtotal')
            className = "subtotal"
        else if (item.code == 'shipping')
            className = "shipping"
        else if (item.code == 'grand_total')
            className = "grand_total"

        totalRows.push(
            <div key={index} className={className}>
                <div>
                    <span className="label">{Identify.__(item.title)}</span>
                    <span className="price" style={{color : configColor.price_color}}><Price currencyCode={currencyCode} value={item.value}/></span>
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
Total.contextTypes = {
    currencyCode: PropTypes.string,
    data: PropTypes.object,
};

export default Total
