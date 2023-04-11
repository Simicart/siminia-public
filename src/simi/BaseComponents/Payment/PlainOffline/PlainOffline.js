// import React from 'react';
// import { mergeClasses } from '@magento/venia-ui/lib/classify';
// import { shape, string } from 'prop-types';

// import defaultClasses from './index.module.css';

// const OfflinePayment = props => {
//     const classes = mergeClasses(defaultClasses, props.classes);
//     return <div className={classes.root}>offline</div>;
// };

// OfflinePayment.propTypes = {
//     classes: shape({ root: string })
// };
// OfflinePayment.defaultProps = {};
// export default OfflinePayment;

import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
// import { bool, func, shape, string } from 'prop-types';
import { usePlainOffline } from './usePlainOffline';

import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Country from '@magento/venia-ui/lib/components/Country';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './index.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';


/**
 * The initial view for the Braintree payment method.
 */
const PlainOffline = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onPaymentReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit,
        paymentCode
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePlainOffline({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        paymentCode
    });

    const {
        errors,
        isVirtual,
        isBillingAddressSame,
        /**
         * `stepNumber` depicts the state of the process flow in credit card
         * payment flow.
         *
         * `0` No call made yet
         * `1` Billing address mutation intiated
         * `2` Braintree nonce requsted
         * `3` Payment information mutation intiated
         * `4` All mutations done
         */
        // stepNumber,
        initialValues,
        shippingAddressCountry
    } = talonProps;

    const creditCardComponentClassName = classes.credit_card_root;

    const billingAddressFieldsClassName = isBillingAddressSame
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;

    /**
     * Instead of defining classes={root: classes.FIELD_NAME}
     * we are using useMemo to only do it once (hopefully).
     */
    const fieldClasses = useMemo(() => {
        return [
            'first_name',
            'last_name',
            'country',
            'street1',
            'street2',
            'city',
            'region',
            'postal_code',
            'phone_number'
        ].reduce((acc, fieldName) => {
            acc[fieldName] = { root: classes[fieldName] };

            return acc;
        }, {});
    }, [classes]);

    /**
     * These 2 functions are wrappers around the `isRequired` function
     * of `formValidators`. They perform validations only if the
     * billing address is different from shipping address.
     *
     * We write this function in `venia-ui` and not in the `peregrine` talon
     * because it references `isRequired` which is a `venia-ui` function.
     */
    const isFieldRequired = useCallback((value, { isBillingAddressSame }) => {
        if (isBillingAddressSame) {
            /**
             * Informed validator functions return `undefined` if
             * validation is `true`
             */
            return undefined;
        } else {
            return isRequired(value);
        }
    }, []);

    return (
        <div className={classes.root}>
            <div
                className={creditCardComponentClassName}
                style={{ paddingTop: 40 }}
            >
                <FormError
                    classes={{ root: classes.formErrorContainer }}
                    errors={Array.from(errors.values())}
                />
                {!isVirtual && <div className={classes.address_check}>
                    <Checkbox
                        field="isBillingAddressSame"
                        label={formatMessage({
                            id: 'checkoutPage.billingAddressSame',
                            defaultMessage:
                                'Billing address same as shipping address'
                        })}
                        initialValue={initialValues.isBillingAddressSame}
                    />
                </div>}
                <div className={billingAddressFieldsClassName}>
                    <Field
                        id="firstName"
                        classes={fieldClasses.first_name}
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            id="firstName"
                            field="firstName"
                            validate={isFieldRequired}
                            initialValue={initialValues.firstName}
                        />
                    </Field>
                    <Field
                        id="lastName"
                        classes={fieldClasses.last_name}
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            id="lastName"
                            field="lastName"
                            validate={isFieldRequired}
                            initialValue={initialValues.lastName}
                        />
                    </Field>
                    <Country
                        classes={fieldClasses.country}
                        validate={isFieldRequired}
                        initialValue={
                            /**
                             * If there is no initial value to start with
                             * use the country from shipping address.
                             */
                            initialValues.country || shippingAddressCountry
                        }
                    />
                    <Field
                        id="street1"
                        classes={fieldClasses.street1}
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Street Address'
                        })}
                    >
                        <TextInput
                            id="street1"
                            field="street1"
                            validate={isFieldRequired}
                            initialValue={initialValues.street1}
                        />
                    </Field>
                    <Field
                        id="street2"
                        classes={fieldClasses.street2}
                        label={formatMessage({
                            id: 'global.streetAddress2',
                            defaultMessage: 'Street Address 2'
                        })}
                        optional={true}
                    >
                        <TextInput
                            id="street2"
                            field="street2"
                            initialValue={initialValues.street2}
                        />
                    </Field>
                    <Field
                        id="city"
                        classes={fieldClasses.city}
                        label={formatMessage({
                            id: 'global.city',
                            defaultMessage: 'City'
                        })}
                    >
                        <TextInput
                            id="city"
                            field="city"
                            validate={isFieldRequired}
                            initialValue={initialValues.city}
                        />
                    </Field>
                    <Region
                        classes={fieldClasses.region}
                        initialValue={initialValues.region}
                        validate={isFieldRequired}
                        fieldInput={'region[label]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey={'id'}
                    />
                    <Postcode
                        classes={fieldClasses.postal_code}
                        validate={isFieldRequired}
                        initialValue={initialValues.postcode}
                    />
                    <Field
                        id="phoneNumber"
                        classes={fieldClasses.phone_number}
                        label={formatMessage({
                            id: 'global.phoneNumber',
                            defaultMessage: 'Phone Number'
                        })}
                    >
                        <TextInput
                            id="phoneNumber"
                            field="phoneNumber"
                            validate={isFieldRequired}
                            initialValue={initialValues.phoneNumber}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
};

export default PlainOffline;
