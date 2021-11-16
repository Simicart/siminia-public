import React from 'react'
import Identify from 'src/simi/Helper/Identify';
import defaultClasses from './index.css'
import { mergeClasses } from 'src/classify'

export const Checkbox = (props) => {
    const propsClasses = props.classes?props.classes:{}
    const classes = mergeClasses(defaultClasses, propsClasses);
    return (
        <div 
            {...props}
            className={`${classes['checkbox-item']} checkbox-item ${props.className} ${props.selected?`${classes['selected']} selected`:''}`}
        >
            <div className={`${classes["checkbox-item-icon"]} checkbox-item-icon`}>
                <div className={`${classes["checkbox-item-icon-inside"]} checkbox-item-icon-inside`}></div>
            </div>
            <span className={`${classes["checkbox-item-text"]} checkbox-item-text`}>
                {Identify.__(props.label)}
            </span>
        </div>
    )
}
export default Checkbox