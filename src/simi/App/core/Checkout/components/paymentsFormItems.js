import React, { useCallback, Fragment } from 'react';
import { useFormState, asField, BasicRadioGroup } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';
import { isRequired } from 'src/util/formValidators';

import defaultClasses from './paymentsFormItems.css';
import Button from 'src/components/Button';
import Radio from 'src/components/RadioGroup/radio';
import TextInput from 'src/components/TextInput';
import Field from 'src/components/Field';
import isObjectEmpty from 'src/util/isObjectEmpty';
import Identify from 'src/simi/Helper/Identify';
import BraintreeDropin from './paymentMethods/braintreeDropin';
import CCType from './paymentMethods/ccType';

/**
 * This component is meant to be nested within an `informed` form. It utilizes
 * form state to do conditional rendering and submission.
 */
const CustomRadioPayment = asField(({ fieldState, ...props }) => (
    <BasicRadioGroup {...props} fieldState={fieldState} />
));

const PaymentsFormItems = props => {
    const {
        classes,
        setIsSubmitting,
        submit,
        isSubmitting,
        paymentMethods,
        initialValues,
        paymentCode,
        cart,
        cartCurrencyCode
    } = props;

    // Currently form state toggles dirty from false to true because of how
    // informed is implemented. This effectively causes this child components
    // to re-render multiple times. Keep tabs on the following issue:
    //   https://github.com/joepuzzo/informed/issues/138
    // If they resolve it or we move away from informed we can probably get some
    // extra performance.
    const formState = useFormState();

    const handleError = useCallback(() => {
        setIsSubmitting(false);
    }, [setIsSubmitting]);


    let selectablePaymentMethods;

    if (paymentMethods && paymentMethods.length) {
        selectablePaymentMethods = paymentMethods.map(
            ({ code, title }) => ({
                label: title,
                value: code
            })
        );
    } else {
        selectablePaymentMethods = []
    }

    let thisInitialValue = null;
    if (initialValues && !isObjectEmpty(initialValues)) {
        if (initialValues.value) {
            thisInitialValue = initialValues.value;
        }
    }

    // The success callback. Unfortunately since form state is created first and
    // then modified when using initialValues any component who uses this
    // callback will be rendered multiple times on first render. See above
    // comments for more info.
    const handleSuccess = useCallback(
        value => {
            setIsSubmitting(false);
            submit({
                code: formState.values['payment_method'],
                data: value
            });
        },
        [setIsSubmitting, submit]
    );

    const selectPaymentMethod = () => {

        const p_method = formState.values['payment_method'];
        let parseData = {};
        if (paymentMethods && paymentMethods.length) {
            if (!paymentMethods.hasOwnProperty('simi_payment_data') || (paymentMethods.hasOwnProperty('simi_payment_data') && !isObjectEmpty(paymentMethods.simi_payment_data) && parseInt(paymentMethods.simi_payment_data.show_type, 10) === 0)){
                 // payment type 0
                parseData = selectablePaymentMethods.find(
                    ({ value }) => value === p_method
                );

                handleSuccess(parseData)
            }
        }
    }

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);
    }, [setIsSubmitting]);

    const handleSavePO = () => {

        if (formState.values.purchaseorder) {
            const { values } = formState;
            handleSuccess(JSON.parse(JSON.stringify(values)));
        }
    }
    
    const renderMethod = () => {
        let mt = null;
        if (paymentMethods.length) {
            mt = paymentMethods.map(ite => {

                let frameCard = '';

                if (formState.values['payment_method'] === ite.code) {

                    if (ite.code === 'purchaseorder') {
                        frameCard = <Fragment>
                            <Field label={Identify.__("Purchase Order Number")} required>
                                <TextInput
                                    id={classes.purchaseorder}
                                    field="purchaseorder"
                                    validate={isRequired}
                                />

                            </Field>
                            <Button
                                className={classes.button}
                                style={{ marginTop: 10, marginBottom: 20 }}
                                type="submit"
                                onClick={() => handleSavePO()}
                            >{Identify.__('Save')}</Button>
                        </Fragment>
                    }

                    // brain tree default magento pwa-studio
                    if (ite.code === 'braintree') {
                        frameCard = <Fragment>
                            <BraintreeDropin shouldRequestPaymentNonce={isSubmitting} onError={handleError} onSuccess={handleSuccess} />
                            <Button
                                className={classes.button}
                                style={{ marginTop: 10, marginBottom: 20 }}
                                type="button"
                                onClick={() => handleSubmit()}
                            >{Identify.__('Use Card')}</Button>
                        </Fragment>
                    }

                    if (ite.hasOwnProperty('simi_payment_data') && !isObjectEmpty(ite.simi_payment_data)) {
                        if (parseInt(ite.simi_payment_data.show_type, 10) === 1){
                            // payment type 1
                            frameCard = <CCType onSuccess={handleSuccess} paymentContent={ite.simi_payment_data} cartCurrencyCode={cartCurrencyCode} cart={cart} payment_method={ite.code} />
                        }
                        if (parseInt(ite.simi_payment_data.show_type, 10) === 3){
                            // payment type 3
                            frameCard = 'Coming soon!'
                        }
                    }
                }

                return <Fragment key={ite.code}>
                    <Radio label={ite.title} value={ite.code} />
                    {frameCard}
                </Fragment>
            });
        }
        return mt;
    }

    return (
        <Fragment>
            <div className={classes.body}>
                <div className={defaultClasses['payment-method-item']}>
                    <CustomRadioPayment initialValue={paymentCode} field="payment_method" key={thisInitialValue} onChange={() => selectPaymentMethod()}>
                        {renderMethod()}
                    </CustomRadioPayment>
                </div>
            </div>

        </Fragment>
    );
};

PaymentsFormItems.propTypes = {
    cancel: func.isRequired,
    classes: shape({
        address_check: string,
        body: string,
        button: string,
        braintree: string,
        city: string,
        footer: string,
        heading: string,
        postcode: string,
        region_code: string,
        street0: string
    }),
    countries: array,
    isSubmitting: bool,
    setIsSubmitting: func.isRequired,
    submit: func.isRequired,
    submitting: bool
};

export default PaymentsFormItems;
