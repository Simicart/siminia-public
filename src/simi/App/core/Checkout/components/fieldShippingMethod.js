import React, { Fragment, useCallback } from 'react';
import { useFormState } from 'informed';

import Select from 'src/components/Select';
require('./fieldShippingMethod.scss')

const fieldShippingMethod = (props) => {
    const { initialValue, selectableShippingMethods, availableShippingMethods, cancel, submit } = props;

    const formState = useFormState();

    const handleSelectMethod = useCallback(
        (shippingMethod) => {
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
            // cancel();
        },
        [availableShippingMethods, cancel, submit]
    )

    const handleShippingMethod = () => {
        const shippingMethod = formState.values['shippingMethod'];
        if (shippingMethod) handleSelectMethod(shippingMethod);
    }

    return <Fragment>
        <div
            className="ship-method_field"
            id="shippingMethod"
        >
            <Select
                field="shippingMethod"
                initialValue={initialValue}
                items={selectableShippingMethods}
                onChange={() => handleShippingMethod()}
            />
        </div>
    </Fragment>

}
export default fieldShippingMethod;
