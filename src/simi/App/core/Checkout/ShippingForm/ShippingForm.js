import React, { useCallback } from 'react';
import { Form } from 'informed';
import { array, func, shape, string } from 'prop-types';
import { formatLabelPrice } from 'src/simi/Helper/Pricing';
import { mergeClasses } from 'src/classify';
import defaultClasses from './ShippingForm.css';
import Identify from 'src/simi/Helper/Identify';
import FieldShippingMethod from '../components/fieldShippingMethod';
import Loading from 'src/simi/BaseComponents/Loading/ReactLoading'

const ShippingForm = props => {
    const {
        availableShippingMethods,
        cancel,
        shippingMethod,
        submit
    } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    let initialValue;
    let selectableShippingMethods;

    const defaultMethod = { value: '', label: Identify.__('Please choose') }

    if (availableShippingMethods.length) {
        selectableShippingMethods = availableShippingMethods.map(
            ({ carrier_code, carrier_title, price_excl_tax }) =>{
                const formatF = formatLabelPrice(price_excl_tax);
                return {value: carrier_code, label: `${carrier_title} (${formatF})`}
            }
        );

        initialValue = shippingMethod
    } else {
        selectableShippingMethods = [];
        initialValue = '';
        return <Loading />
    }

    selectableShippingMethods.unshift(defaultMethod);

    const handleSubmit = useCallback(
        ({ shippingMethod }) => {
            const selectedShippingMethod = availableShippingMethods.find(
                ({ carrier_code }) => carrier_code === shippingMethod
            );

            if (!selectedShippingMethod) {
                console.warn(
                    `Could not find the selected shipping method ${selectedShippingMethod} in the list of available shipping methods.`
                );
                cancel();
                return;
            }

            submit({ shippingMethod: selectedShippingMethod });
        },
        [availableShippingMethods, cancel, submit]
    );

    const childFieldProps = {
        classes,
        initialValue,
        selectableShippingMethods,
        availableShippingMethods,
        submit,
        cancel
    }

    return (
        <Form className={classes.root} onSubmit={handleSubmit} >
            <div className={classes.body}>
                <FieldShippingMethod {...childFieldProps} />
            </div>
        </Form>
    );
};

ShippingForm.propTypes = {
    availableShippingMethods: array.isRequired,
    cancel: func.isRequired,
    classes: shape({
        body: string,
        button: string,
        footer: string,
        heading: string,
        shippingMethod: string
    }),
    shippingMethod: string,
    submit: func.isRequired
};

ShippingForm.defaultProps = {
    availableShippingMethods: [{}]
};

export default ShippingForm;
