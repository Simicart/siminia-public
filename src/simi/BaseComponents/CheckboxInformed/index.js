import React, { Component, Fragment } from 'react';
import { bool, node, shape, string } from 'prop-types';
import { BasicCheckbox, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './checkbox.css';
import { default as CheckedIcon } from 'src/simi/BaseComponents/Icon/Checked'

export const Checkbox = props => {
    const { classes, fieldState, id, label, message, ...rest } = props;
    const { value: checked } = fieldState;
    const icon = checked ? <CheckedIcon style={{width: 24, height: 24}} /> : '';

    return (
        <Fragment>
            <label className={classes.root} htmlFor={id}>
                <BasicCheckbox
                    {...rest}
                    className={classes.input}
                    fieldState={fieldState}
                    id={id}
                />
                <span className={checked ? classes.icon_checked : classes.icon}>{icon}</span>
                <span className={classes.label}>{label}</span>
            </label>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
}

Checkbox.propTypes = {
    classes: shape({
        icon: string,
        input: string,
        label: string,
        message: string,
        root: string,
        icon_checked: string
    }),
    field: string.isRequired,
    fieldState: shape({
        value: bool
    }).isRequired,
    id: string,
    label: node.isRequired,
    message: node
};

export default compose(
    classify(defaultClasses),
    asField
)(Checkbox);
