import React, { Component } from 'react';
import { Circle } from 'react-feather';
import { node, shape, string } from 'prop-types';
import { Radio } from 'informed';
import classify from 'src/classify';
import defaultClasses from './radio.module.css';


export const RadioOption = props => {
    const { classes, id, label, value, ...rest } = props;

    return (
        <label className={classes.root} htmlFor={id}>
            <Radio
                {...rest}
                className={classes.input}
                id={id}
                value={value}
            />
            <div className={classes.radioCircle} />
            <span className={classes.label}>
                {label || (value != null ? value : '')}
            </span>
        </label>
    );
}

RadioOption.propTypes = {
    classes: shape({
        input: string,
        label: string,
        root: string,
        icon: string,
        radioCircle: string,
    }),
    label: node.isRequired,
    value: node.isRequired
};

export default classify(defaultClasses)(RadioOption);
