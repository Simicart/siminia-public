import React, { Fragment} from 'react';
import { usePriceSummary } from '../../talons/usePriceSummary'
import Price from '@magento/venia-ui/lib/components/Price';
import { FormattedMessage } from 'react-intl';

const PriceSummary = (props) => {
    const { data, currencyCode, classes } = props

    const talonProps = usePriceSummary({ ...data })

    const { 
        isActive,
        earnPoint,
        spendPointAsMoney,
        spendPointAmount
    } = talonProps

    if(!isActive) return null

    const earnPointRender = earnPoint > 0 ? (
        <Fragment>
            <span className={classes.lineItemLabel}>
                <FormattedMessage
                    id={'Earn reward point'}
                    defaultMessage={'Earn reward point'}
                />
            </span>
            <span className={classes.price}>{earnPoint}</span>
        </Fragment>
    ) : null

    const spendPointRender = spendPointAmount > 0 ? (
        <Fragment>
            <span className={classes.lineItemLabel}>
                <FormattedMessage
                    id={'Spend Point'}
                    defaultMessage={'Spend Point'}
                />
            </span>
            <span className={classes.price}>
                <Price
                    value={spendPointAsMoney}
                    currencyCode={currencyCode}
                />
                <span>
                    {spendPointAmount}
                    <FormattedMessage
                        id={'points'}
                        defaultMessage={'points'}
                    />
                </span>
            </span>
        </Fragment>
    ) : null

    return (
        <Fragment>
            {earnPointRender}
            {spendPointRender}
        </Fragment>
    )
}

export default PriceSummary

