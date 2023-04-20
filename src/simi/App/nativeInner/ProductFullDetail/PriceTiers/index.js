import React from 'react'
import ReactDOM from 'react-dom'
import { useStyle } from '@magento/venia-ui/lib/classify';
import { formatPrice } from 'src/simi/Helper/Pricing';
import { useIntl } from 'react-intl';
import defaultClasses from './priceTiers.module.css'

const TierPrice = props => {

    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const {priceTiers, price, tier_prices} = props

    const filterPriceTiers = priceTiers.filter((element, index) => {
        if(localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__signin_token') && tier_prices[index].customer_group_id === '0'
        || tier_prices[index].customer_group_id === '1' || tier_prices[index].customer_group_id === '2'
        || tier_prices[index].customer_group_id === '3') {
            return false
        }
        else return true
    })

    let productFinalPrice = 0
    if(price && price.minimalPrice && price.minimalPrice.amount && price.minimalPrice.amount.value) {
        productFinalPrice = price.minimalPrice.amount.value
    }  

    const tier_label = filterPriceTiers.map((tier, idx) => {
        const { discount, final_price, quantity } = tier;

        if(productFinalPrice <= final_price.value) return null
        
        const translateText = formatMessage({ id: 'By %s for %k each and %c%'})
        const textArr = translateText.split(' ')
        const replaceTextArr = textArr.map((text => {
            if(text === '%s') {
                return quantity + ' '
            } else if(text === '%k') {
                return (
                    <React.Fragment>
                        {formatPrice(final_price.value, final_price.currency)}
                        {' '}
                    </React.Fragment>
                ) 
                  
            } else if(text === '%c%') {
                return  <span className='manually-formated-price'>
                       {'save ' + discount.percent_off + '% '}
                    </span>
            }

            return text + ' '
        }))

        // const finalSave = <b>{formatMessage({ id: 'save %c%'.replace('%c', discount.percent_off) })}</b>
        return (
            <li key={idx}>
                {replaceTextArr}
            </li>
        )
    });
    
    return (
        <div className={classes.wrapper}>
            <ul className={classes.root}>
                {tier_label}
            </ul>
        </div>
    )   
}

export default TierPrice