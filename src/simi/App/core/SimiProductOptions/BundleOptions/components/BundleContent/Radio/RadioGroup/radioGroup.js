import React, { Fragment } from 'react';
import { arrayOf, number, node, oneOfType, shape, string } from 'prop-types';
import { RadioGroup as InformedRadioGroup } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import Radio from './radio';
import defaultClasses from './radioGroup.module.css';

const RadioGroup = props => {
    const {
        children,
        classes: propClasses,
        disabled,
        field,
        id,
        items,
        message,
        ...rest
    } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);

    const options =
        children ||
        items.map(({ value, ...item }) => (
            <Radio
                key={value}
                disabled={disabled}
                {...item}
                classes={{
                    label: classes.radioLabel,
                    root: classes.radioContainer
                }}
                id={`${field}--${value}`}
                value={value}
            />
        ));

    return (
        <Fragment>
            <div className={classes.root}>
                <InformedRadioGroup {...rest} field={field} id={id}>
                    {options}
                </InformedRadioGroup>
            </div>
            <Message className={classes.message} fieldState={fieldState}>
                {message}
            </Message>
        </Fragment>
    );
};

export default RadioGroup;

RadioGroup.propTypes = {
    children: node,
    classes: shape({
        message: string,
        radioContainer: string,
        radioLabel: string,
        root: string
    }),
    field: string.isRequired,
    id: string,
    items: arrayOf(
        shape({
            key: oneOfType([number, string]),
            label: node,
            value: oneOfType([number, string])
        })
    ),
    message: node
};
