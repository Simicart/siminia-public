import React from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import ShippingRadio from './shippingRadio';
import defaultClasses from './shippingRadios.css';
import Identify from 'src/simi/Helper/Identify';
import Radio from 'src/simi/BaseComponents/RadioInformed';
import { RadioGroup } from 'informed';

const ERROR_MESSAGE =
    Identify.__('No shipping method available.');

const ShippingRadios = props => {
    const { disabled, shippingMethods } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    if (!shippingMethods.length) {
        return <span className={classes.error}>{ERROR_MESSAGE}</span>;
    }

    const shippingRadios = shippingMethods.map(method => {
        const label = (
            <ShippingRadio
                currency={method.amount.currency}
                name={method.method_title}
                price={method.amount.value}
            />
        );
        const value = method.serializedValue;
        return (
            <Radio
                key={value}
                label={label}
                value={value}
                classes={{
                    label: classes.radio_label
                }}
            />
        )
    });

    return (
        <RadioGroup
            field="shipping_method"
        >
            {shippingRadios}
        </RadioGroup>
    );
};

export default ShippingRadios;

ShippingRadios.propTypes = {
    classes: shape({
        error: string,
        radioMessage: string,
        radioLabel: string,
        radioRoot: string
    }),
    disabled: bool,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    ).isRequired
};
