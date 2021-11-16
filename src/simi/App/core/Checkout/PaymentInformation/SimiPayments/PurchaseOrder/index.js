import React, { useMemo, useCallback } from 'react';
import { usePurchaseOrder } from 'src/simi/talons/CheckoutPage/PaymentInformation/SimiPayments/usePurchaseOrder';
import { mergeClasses } from 'src/classify';
import defaultClasses from './purchaseOrder.css';
import creditCardPaymentOperations from './purchaseOrder.gql';

import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Checkbox from 'src/simi/BaseComponents/CheckboxInformed';
import SimiBillingAddress from '../SimiBillingAddress'
import Identify from 'src/simi/Helper/Identify';

const PurchaseOrder = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onDropinReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit,
        paymentCode
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = usePurchaseOrder({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        paymentCode,
        ...creditCardPaymentOperations
    });

    const {
        errors,
        initialValues,
        shippingAddressCountry,
        isBillingAddressSame,
        isVirtual,
        purchaseOrderNumber,
        setPurchaseOrderNumber,
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
                <div className={`${classes.po_number_input_container}`}>
                    <input
                        type="text"
                        className={`${classes.po_number_input} po_number_input`}
                        value={purchaseOrderNumber}
                        placeholder={Identify.__('Purchase Order Number *')}
                        onChange={(e) => { if (e && e.target) setPurchaseOrderNumber(e.target.value) }}
                    />
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

export default PurchaseOrder;