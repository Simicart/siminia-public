import React from 'react';
import defaultClasses from './index.module.css';
import { mergeClasses } from 'src/classify';

export const Checkbox = props => {
    const { classes: _classes, children, ...rest } = props || {};
    const propsClasses = _classes || {};
    const classes = mergeClasses(defaultClasses, propsClasses);

    return (
        <div
            {...rest}
            className={`${
                classes['checkbox-item']
            } checkbox-item ${props.className || ''} ${
                props.selected ? `${classes['selected']} selected` : ''
            }`}
        >
            <div
                className={`${
                    classes['checkbox-item-icon']
                } checkbox-item-icon`}
            >
                <div
                    className={`${
                        classes['checkbox-item-icon-inside']
                    } checkbox-item-icon-inside`}
                />
            </div>
            <span
                className={`${
                    classes['checkbox-item-text']
                } checkbox-item-text`}
            >
                {props.label}
                {children}
            </span>
        </div>
    );
};
export default Checkbox;
