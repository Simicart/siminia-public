import React, { useMemo } from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './productOptions.module.css';

const ProductOptions = props => {
    const { options = [] , giftcardOptions = []} = props;
    const classes = useStyle(defaultClasses, props.classes);
    const displayOptions = useMemo(
        () =>
            options.map(({ option_label, value_label, label, values }) => {
                const key = `${option_label}${value_label}${label}${values}`;
                const optionLabelString = option_label ? `${option_label} :` : `${label} :`;
                const val = values ? values.map(({label,value})=>{
                    return label ? label : value;
                }) : '';
                return (
                    <div key={key} className={classes.optionLabel}>
                        <dt className={classes.optionName}>
                            {optionLabelString}
                        </dt>
                        <dd className={classes.optionValue}>{value_label ? value_label : val }
                        </dd>
                    </div>
                );
            }),
        [classes, options]
    );

    const gcOptions = giftcardOptions.slice(2, giftcardOptions.length)

    const displayGcOptions = useMemo(
        () =>
            gcOptions.map(({ code, value }, index) => {
                return (
                    <div className={classes.optionLabel}>
                        <dt
                            className={classes.optionName}
                        >{`${code} :`}</dt>
                        <dd className={classes.optionValue}>{value}</dd>
                    </div>
                );
            }),
        [classes, giftcardOptions]
    );


    if (displayOptions.length === 0 && displayGcOptions.length === 0) {
        return null;
    }

    return <dl className={classes.options}>{displayOptions.length > 0 ? displayOptions : displayGcOptions}</dl>;
};

ProductOptions.propTypes = {
    options: arrayOf(
        shape({
            label: string,
            value: string
        })
    )
};

export default ProductOptions;
