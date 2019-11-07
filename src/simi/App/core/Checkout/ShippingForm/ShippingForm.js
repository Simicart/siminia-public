import React, { useCallback } from 'react';
import { Form } from 'informed';
import { array, func, shape, string } from 'prop-types';
import { formatLabelPrice } from 'src/simi/Helper/Pricing';
import Identify from 'src/simi/Helper/Identify';
import FieldShippingMethod from '../components/fieldShippingMethod';
import Loading from 'src/simi/BaseComponents/Loading/ReactLoading'
require('./ShippingForm.scss')


const ShippingForm = props => {
    const {
        availableShippingMethods,
        cancel,
        shippingMethod,
        submit
    } = props;

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
        initialValue,
        selectableShippingMethods,
        availableShippingMethods,
        submit,
        cancel
    }

    return (
        <Form className="root" onSubmit={handleSubmit} >
            <div className="body">
                <FieldShippingMethod {...childFieldProps} />
            </div>
        </Form>
    );
};

ShippingForm.propTypes = {
    availableShippingMethods: array.isRequired,
    cancel: func.isRequired,
    shippingMethod: string,
    submit: func.isRequired
};

ShippingForm.defaultProps = {
    availableShippingMethods: [{}]
};

export default ShippingForm;
