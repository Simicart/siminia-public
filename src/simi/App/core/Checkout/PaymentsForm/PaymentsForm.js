import React, { useCallback, useState } from 'react';
import { Form } from 'informed';
import { array, object } from 'prop-types';

import PaymentsFormItems from '../components/paymentsFormItems';

require('./PaymentsForm.scss')
/**
 * A wrapper around the payment form. This component's purpose is to maintain
 * the submission state as well as prepare/set initial values.
 */
const PaymentsForm = props => {
    const { initialValues } = props;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);
    }, [setIsSubmitting]);

    const formChildrenProps = {
        ...props,
        isSubmitting,
        setIsSubmitting
    };


    return (
        <Form
            className='root'
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <PaymentsFormItems {...formChildrenProps} />
        </Form>
    );
};

PaymentsForm.propTypes = {
    initialValues: object,
    paymentMethods: array
};

PaymentsForm.defaultProps = {
    initialValues: {}
};

export default PaymentsForm;
