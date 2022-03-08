import React, { useMemo, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { usePaypalButtons } from './usePaypalButtons';

import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Country from '@magento/venia-ui/lib/components/Country';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Loading from 'src/simi/BaseComponents/Loading';

import defaultClasses from './index.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';

import {
    PayPalScriptProvider,
    PayPalButtons as LibPPBtns,
    usePayPalScriptReducer
} from '@paypal/react-paypal-js';

/**
 * The initial view for the Braintree payment method.
 */
const PaypalButtons = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onPaymentReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit,
        paymentCode,
        history
    } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePaypalButtons({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        paymentCode
    });

    const {
        errors,
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
        stepNumber,
        initialValues,
        shippingAddressCountry,
        cartTotalData,
        setPayerData,
        token,
        paypalLoading
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

    let amount = 0;
    let currency = false;
    if (
        cartTotalData &&
        cartTotalData.cart &&
        cartTotalData.cart.prices &&
        cartTotalData.cart.prices.grand_total
    ) {
        const { grand_total } = cartTotalData.cart.prices;
        if (grand_total.value && grand_total.currency) {
            amount = grand_total.value;
            currency = grand_total.currency;
        }
    }

    const savePayment = data => {
        setPayerData(data);
    };
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
                <div className={classes.address_check}>
                    <Checkbox
                        field="isBillingAddressSame"
                        label={formatMessage({
                            id: 'checkoutPage.billingAddressSame',
                            defaultMessage:
                                'Billing address same as shipping address'
                        })}
                        initialValue={initialValues.isBillingAddressSame}
                    />
                </div>
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
            {amount && token ? (
                <div style={{ marginTop: 50 }}>
                    <PayPalScriptProvider
                        options={{
                            'client-id':
                                'ARqvJTaAU6GbG7b4Y8vgwsaJjFrJNKkwEjcBpQlY4jrsZOQxqcmgKIFPzmg9OlJW8V6TwIa-ttxL_fs7', // cody@simicart.com sandbox_client_id - TODO: create client id for each customer on publish
                            components: 'buttons',
                            currency,
                            intent: 'authorize'
                        }}
                    >
                        <ButtonWrapper
                            disabled={false}
                            forceReRender={[amount, currency]}
                            fundingSource={undefined}
                            amount={amount}
                            currency={currency}
                            savePayment={savePayment}
                            token={token}
                            history={history}
                        />
                    </PayPalScriptProvider>
                </div>
            ) : (
                ''
            )}
            {paypalLoading ? <Loading /> : ''}
        </div>
    );
};

const ButtonWrapper = ({
    currency,
    showSpinner,
    amount,
    savePayment,
    token,
    history
}) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const scriptReducerData = usePayPalScriptReducer();
    const [{ options, isPending }, dispatch] = scriptReducerData;
    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options,
                currency: currency
            }
        });
    }, [currency, showSpinner]);

    return (
        <>
            {isPending ? <Loading /> : ''}
            <LibPPBtns
                style={{ layout: 'vertical' }}
                disabled={false}
                forceReRender={[amount, currency]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return token;
                }}
                onApprove={function(data, actions) {
                    savePayment(data);
                }}
                onCancel={() => {
                    history.push('/cart');
                }}
                onError={() => {
                    history.push('/cart');
                }}
            />
        </>
    );
};

export default PaypalButtons;
