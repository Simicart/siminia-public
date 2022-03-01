import React, {Fragment} from 'react';
import {useIntl} from 'react-intl';
import {Form} from 'informed';
import {func, number, string} from 'prop-types';
import {Minus as MinusIcon, Plus as PlusIcon} from 'react-feather';
import {useQuantity} from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';

import {useStyle} from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import {Message} from '@magento/venia-ui/lib/components/Field';
// import defaultClasses from '../../../core/Cart/ProductListing/quantity.module.css';
import defaultClasses_1 from './quantity.module.css';
import {configColor} from "../../../../Config";
import IconWithColor from "../IconWithColor/IconWithColor";

export const QuantityFields = props => {
    const {initialValue, itemId, label, min, onChange, message} = props;
    const {formatMessage} = useIntl();
    const classes = useStyle(defaultClasses_1, props.classes);
    const iconClasses = {root: classes.icon};

    const talonProps = useQuantity({
        initialValue,
        min,
        onChange
    });

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    } = talonProps;

    const errorMessage = message ? <Message>{message}</Message> : null;

    return (
        <Fragment>
            <div className={classes.root}>
                <label className={classes.label} htmlFor={itemId}>
                    {label}
                </label>
                <button
                    aria-label={formatMessage({
                        id: 'quantity.buttonIncrement',
                        defaultMessage: 'Increase Quantity'
                    })}
                    className={classes.button_increment}
                    disabled={isIncrementDisabled}
                    onClick={handleIncrement}
                    type="button"
                >
                    <IconWithColor src={PlusIcon} size={20}/>
                </button>
                <TextInput
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    classes={{input: classes.inputQty}}
                    field="quantity"
                    id={itemId}
                    inputMode="numeric"
                    mask={maskInput}
                    min={min}
                    onBlur={handleBlur}
                    pattern="[0-9]*"
                />
                <button
                    aria-label={formatMessage({
                        id: 'quantity.buttonDecrement',
                        defaultMessage: 'Decrease Quantity'
                    })}
                    className={classes.button_decrement}
                    disabled={isDecrementDisabled}
                    onClick={handleDecrement}
                    type="button"
                >
                    <IconWithColor classes={iconClasses} src={MinusIcon} size={22}/>
                </button>
            </div>
            {errorMessage}
        </Fragment>
    );
};

export const Quantity = props => {
    return (
        <Form
            initialValues={{
                quantity: props.initialValue
            }}
        >
            <QuantityFields {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    itemId: string,
    label: string,
    min: number,
    onChange: func,
    message: string
};

Quantity.defaultProps = {
    label: 'Quantity',
    min: 0,
    initialValue: 1,
    onChange: () => {
    }
};

QuantityFields.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {
    }
};
