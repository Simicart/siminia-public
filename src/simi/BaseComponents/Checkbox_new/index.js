import React from 'react';
import defaultClasses from './index.module.css';
import {mergeClasses} from 'src/classify';
import {CheckSquare, Square} from 'react-feather';

export const Checkbox = (props) => {
    const {classes: _classes, children, iconSize = 24, colors = {}, ...rest} = props || {}
    const propsClasses = _classes || {}

    const classes = mergeClasses(defaultClasses, propsClasses);

    return (
        <div
            {...rest}
            className={`${
                classes['checkbox-item-new']
            } checkbox-item-new ${props.className || ''} ${
                props.selected ? `${classes['selected']} selected` : ''
            }`}
        >
            <span
                className={`${
                    classes['checkbox-item-icon']
                } checkbox-item-icon`}
            >
                {props.selected ? (
                    <CheckSquare color={colors['checked'] || '#17D7A0'}/>
                ) : (
                    <Square color={colors['unchecked'] || '#000'}/>
                )}
            </span>
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
