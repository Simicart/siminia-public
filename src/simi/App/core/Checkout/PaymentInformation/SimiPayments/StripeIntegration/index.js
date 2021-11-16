import React, { useMemo, useCallback } from 'react';
import { useStripeIntegration } from 'src/simi/talons/CheckoutPage/PaymentInformation/SimiPayments/useStripeIntegration';
import { mergeClasses } from 'src/classify';
import defaultClasses from './stripeIntegration.css';
import creditCardPaymentOperations from './stripeIntegration.gql';

import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Checkbox from 'src/simi/BaseComponents/CheckboxInformed';
import SimiBillingAddress from '../SimiBillingAddress'
import Identify from 'src/simi/Helper/Identify';
import CheckoutForm from './CheckoutForm'

const StripeIntegration = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onDropinReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit,
        isVirtual,
        paymentCode
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useStripeIntegration({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        paymentCode,
        isVirtual,
        ...creditCardPaymentOperations
    });

    const {
        errors,
        initialValues,
        shippingAddressCountry,
        isBillingAddressSame
    } = talonProps;

    const billingAddressFieldsClassName = isBillingAddressSame
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;

    const fieldClasses = useMemo(() => {
        return [
            'saved_address_for_billing',
            'simi_guest_email',
            'first_name',
            'last_name',
            'country',
            'street1',
            'street2',
            'city',
            'state',
            'postal_code',
            'phone_number'
        ].reduce((acc, fieldName) => {
            acc[fieldName] = { root: classes[fieldName] };

            return acc;
        }, {});
    }, [classes]);

    const errorMessage = useMemo(() => {
        if (errors.length) {
            return (
                <div className={classes.errors_container}>
                    {errors.map(error => (
                        <span className={classes.error} key={error}>
                            {error}
                        </span>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    }, [errors, classes.error, classes.errors_container]);

    const isFieldRequired = useCallback(
        value => {
            if (isBillingAddressSame) {
                return undefined;
            } else {
                return Identify.__(isRequired(value));
            }
        },
        [isBillingAddressSame]
    );

    return (
        <div className={classes.root}>
            <div>
                <div className={`${classes.stripe_element}`}>
                    <CheckoutForm classes={classes} />
                </div>
                <div className={classes.address_check}>
                    {!isVirtual &&
                        <Checkbox
                            field="isBillingAddressSame"
                            label="Billing address same as shipping address"
                            initialValue={initialValues.isBillingAddressSame}
                        />
                    }
                </div>
                <SimiBillingAddress
                    billingAddressFieldsClassName={billingAddressFieldsClassName}
                    initialValues={initialValues}
                    fieldClasses={fieldClasses}
                    shippingAddressCountry={shippingAddressCountry}
                    isFieldRequired={isFieldRequired}
                    isBillingAddressSame={isBillingAddressSame}
                    isVirtual={isVirtual}
                />
                {errorMessage}
            </div>
        </div>
    );
};

export default StripeIntegration;