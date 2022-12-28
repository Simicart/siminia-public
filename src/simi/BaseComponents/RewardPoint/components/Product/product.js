import React, { useMemo } from "react"
import defaultClasses from './productRP.module.css';
import { useProduct } from '../../talons/useProduct'
import { useStyle } from '@magento/venia-ui/lib/classify';

const Product = (props) => {
    const { item, type } = props

    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useProduct({
        item
    })

    const { active, icon, point, message } = talonProps

    if(!active || !message || !point) {
        return null
    }

    let rootClasses = classes.root
    if(type === 'list') {
        rootClasses = classes.list
    }

    const rewardIcon = icon ? (
        <span className={classes.image}>
            <img src={icon} />
        </span>
    ) : null

    return (
        <div className={rootClasses}>
            {rewardIcon}
            <span className={classes.message}>{message}</span>
        </div>
    )
}

export default Product