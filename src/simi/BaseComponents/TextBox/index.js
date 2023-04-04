import React from 'react';
// import './style.module.css'
import classify from 'src/classify';
import defaultClasses from './style.module.css';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

const TextBox = props => {
    let { classes } = props;
    if (props.parentclasses) classes = { ...classes, ...props.parentclasses };
    let className = `form-control ${classes['base-textField']} `;
    const label = props.label;
    let id = '';
    if (props.className) className = className + props.className;
    if (props.required) className = className + ' required';
    if (props.id) id = props.id;
    const { formatMessage } = useIntl();

    return (
        <div className={`form-group ${classes[props.name]}`} key={props.name}>
            {props.label && (
                <label htmlFor={id}>
                    {label}{' '}
                    {props.required ? (
                        <span>
                            {formatMessage({
                                id: '*'
                            })}
                        </span>
                    ) : (
                        ''
                    )}
                </label>
            )}
            <div className={classes['input-group-field']}>
                <div className={classes['input-field-content']}>
                    <input
                        {...props}
                        type={props.type ? props.type : 'text'}
                        className={className}
                        required={props.required}
                    />
                    {props.icon && (
                        <div className={classes['input-icon']}>
                            {props.icon}
                        </div>
                    )}
                </div>
                {props.error && (
                    <div
                        className={`${classes['error-message']}  error-input-${
                            props.name
                        }`}
                        style={{ marginTop: 5 }}
                    >
                        {props.error}
                    </div>
                )}
            </div>

            <div className="other-component">{props.other}</div>
        </div>
    );
};

TextBox.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    error: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    type: PropTypes.string,
    icon: PropTypes.node,
    other: PropTypes.node
};

export default classify(defaultClasses)(TextBox);
