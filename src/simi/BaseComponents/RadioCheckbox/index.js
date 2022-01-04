import React from 'react';
import { string, oneOf } from 'prop-types';

require('./style.scss');

const RadioCheckbox = (props) => {
    const { defaultValue, defaultChecked, id, type, title, className } = props;

    return <label className={`checkbox-customize ${className ? className : ''}`}>
        {title && <span>{title}</span>}
        <input type={type} id={id} defaultChecked={defaultChecked} defaultValue={defaultValue} {...props} />
        <span className="checkmark-custom" />
    </label>
}

RadioCheckbox.propTypes = {
    defaultValue: string,
    id: string,
    type: oneOf(['checkbox', 'radio']),
    title: string,
    className: string
}

RadioCheckbox.defaultProps = {
    defaultValue: '',
    id: 'radio-checkbox-dom',
    type: 'checkbox',
    title: '',
    className: ''
}

export default RadioCheckbox;
