import React from 'react';
import {configColor} from 'src/simi/Config';
import Identify from 'src/simi/Helper/Identify';
import PropTypes from 'prop-types';
export const Qty = (props)=>{
    const {classes, value, onChange, dataId} = props
    const thisInputId = 'qty-field-' + Identify.randomString(10)
    let style = {
        border: '1px solid ' + configColor.button_background,
        padding: 0,
        borderRadius : '5px',
        height : 36,
        fontSize : 15,
        fontWeight : 600,
        direction : 'ltr'
    };
    style = {...style,...props.inputStyle};
    let className = classes['option-number']?classes['option-number']:''
    className +=  " " + props.className

    const changedValue = (e) => {
        if (!e.target)
            return
        const input = e.target
        let qty = input.value
        if (!Number.isInteger(parseInt(qty)) || qty <= 0) {
            qty = 1
        }
        input.value = qty
        if (onChange)
            onChange(qty)
    }

    return (
        <input
            id={thisInputId}
            min={1}
            type="number"
            defaultValue={value}
            pattern="[1-9]*"
            className={className}
            style={style}
            data-id={dataId}
            onChange={e => changedValue(e)}
            disabled={props.disabled}
        />
    )
};

Qty.propTypes = {
    className: PropTypes.string,
    dataId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    value: PropTypes.number,
    classes: PropTypes.object,
    onChange: PropTypes.func,
}

Qty.defaultProps = {
    className: '',
    classes: {}
}

export const InputField = (props)=>{
    const {classes} = props
    const type = props.type ? props.type : 'text';
    const name = props.name ? props.name : '';
    const labelStyle = {
        display: 'block',
        paddingBottom: 5,
        fontWeight: 600,
        fontSize : 16
    }
    const label = props.label ?
        <label htmlFor={name} style={labelStyle}>{Identify.__(props.label)}
            <span style={{marginLeft : 5,color : 'red'}} className={classes['required-label']}>
                {props.required ? props.required : ''}
            </span>
        </label>
        : null;
    const value = props.value ? props.value : '';
    const className = props.className ? props.className : '';
    const inputStyle = {
        width: '100%',
        borderRadius: 5,
        border: 'none',
        background: '#f2f2f2',
        height: 40,
        paddingLeft: 16,
    }
    return (
        <div
            className={classes['input-field']}
            key={Identify.makeid()}
            style={{marginBottom : 15}}>
            {label}
            <input
                type={type}
                name={name}
                id={name}
                className={className}
                defaultValue={value}
                style={{...inputStyle,...props.style}}
                onChange={props.onChange?props.onChange:null}
                {...props.input}
            />
            <div className={classes["error-message"]}>
                {Identify.__('This field is required')}
            </div>
        </div>
    )
}