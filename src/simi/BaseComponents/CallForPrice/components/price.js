import React from "react"
import { useCallForPriceContext } from '../context'
 
const Price = (props) => {
    const { price } = props

    const talonProps = useCallForPriceContext();
    
    const { isEnabledCallForPrice } = talonProps

    console.log(isEnabledCallForPrice)

    if(isEnabledCallForPrice) {
        return null
    }

    return price
}

export default Price