import React, { Fragment } from 'react';
import { number, string, shape } from 'prop-types';

import { mergeClasses } from 'src/classify';
import defaultClasses from './shippingRadio.css';
import { HOPrice as Price } from 'src/simi/Helper/Pricing';
import Identify from 'src/simi/Helper/Identify';

const ShippingRadio = props => {
    const priceElement = props.price ? (
        <Price value={props.price} currencyCode={props.currency} />
    ) : (
        <span>{Identify.__('FREE')}</span>
    );

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <span>{props.name}</span>
            <div className={classes.price}>{priceElement}</div>
        </Fragment>
    );
};

export default ShippingRadio;

ShippingRadio.propTypes = {
    classes: shape({
        price: string
    }),
    currency: string.isRequired,
    name: string.isRequired,
    price: number.isRequired
};
