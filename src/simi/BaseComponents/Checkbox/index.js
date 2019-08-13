import React from 'react'
import defaultClasses from './index.css'
import { mergeClasses } from 'src/classify'

export const Checkbox = (props) => {
    const propsClasses = props.classes?props.classes:{}
    const classes = mergeClasses(defaultClasses, propsClasses);
    return (
        <div 
            {...props}
            className={`${classes['checkbox-item']} ${props.className} ${props.selected?classes['selected']:''}`}
        >
            <div className={classes["checkbox-item-icon"]}/>
            <span className={classes["checkbox-item-text"]}>
                {props.label}
            </span>
        </div>
    )
}
export default Checkbox