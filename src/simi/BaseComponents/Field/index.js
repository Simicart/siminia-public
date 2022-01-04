//override @venia-ui/lib/components/Field/field.js
import React from 'react';
import { bool, node, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import defaultClasses from './field.module.css';
import { useIntl } from 'react-intl';

const Field = props => {
    const { children, id, label, optional, required } = props;
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);
    const optionalSymbol = optional ? (
        <span className={classes.optional}>
            {formatMessage({ id: 'Optional' })}
        </span>
    ) : null;

    const requiredSymbol = required ? (
        <span className={classes.required}>{formatMessage({ id: '*' })}</span>
    ) : null;

    return (
        <div className={classes.root}>
            <label className={classes.label} htmlFor={id}>
                {label}
                {optionalSymbol}
                {requiredSymbol}
            </label>
            {children}
        </div>
    );
};

Field.propTypes = {
    children: node,
    classes: shape({
        label: string,
        root: string
    }),
    id: string,
    label: node,
    optional: bool
};

export default Field;
