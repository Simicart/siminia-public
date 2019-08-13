import React, { useCallback, Fragment } from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import AddressForm from './AddressForm/AddressForm';
import PaymentsForm from './PaymentsForm/PaymentsForm';
import ShippingForm from './ShippingForm/ShippingForm';
import AddressItem from 'src/simi/BaseComponents/Address';
import isObjectEmpty from 'src/util/isObjectEmpty';
import defaultClass from './editableForm.css';
import Identify from 'src/simi/Helper/Identify';

/**
 * The EditableForm component renders the actual edit forms for the sections
 * within the form.
 */

const EditableForm = props => {
    const {
        editing,
        editOrder,
        submitShippingAddress,
        submitShippingMethod,
        submitting,
        isAddressInvalid,
        invalidAddressMessage,
        directory: { countries },
        paymentMethods,
        submitBillingAddress,
        submitPaymentMethod,
        user,
        simiSignedIn,
        paymentCode,
        toggleMessages,
        cartCurrencyCode,
        cart
    } = props;

    const handleCancel = useCallback(() => {
        editOrder(null);
    }, [editOrder]);

    const handleSubmitAddressForm = useCallback(
        formValues => {
            submitShippingAddress({
                formValues
            });
        },
        [submitShippingAddress]
    );

    /* const handleSubmitPaymentsForm = useCallback(
        formValues => {
            submitPaymentMethodAndBillingAddress({
                formValues
            });
        },
        [submitPaymentMethodAndBillingAddress]
    ); */

    const handleSubmitShippingForm = useCallback(
        formValues => {
            submitShippingMethod({
                formValues
            });
        },
        [submitShippingMethod]
    );

    const handleSubmitBillingForm = useCallback(
        formValues => {
            submitBillingAddress(formValues);
        },
        [submitBillingAddress]
    );

    const handleSubmitPaymentsForm = useCallback(
        formValues => {
            submitPaymentMethod(formValues);
        },
        [submitPaymentMethod]
    );

    switch (editing) {
        case 'address': {
            const {billingAddress} = props;
            let { shippingAddress } = props;
            if (!shippingAddress) {
                shippingAddress = undefined;
            }

            return (
                <Fragment>
                    <AddressForm
                        cancel={handleCancel}
                        countries={countries}
                        isAddressInvalid={isAddressInvalid}
                        invalidAddressMessage={invalidAddressMessage}
                        initialValues={shippingAddress}
                        submit={handleSubmitAddressForm}
                        submitting={submitting}
                        billingAddressSaved={billingAddress}
                        submitBilling={handleSubmitBillingForm}
                        user={user}
                        simiSignedIn={simiSignedIn}
                        toggleMessages={toggleMessages}
                    />
                    {shippingAddress && !isObjectEmpty(shippingAddress) ?
                        <AddressItem classes={defaultClass} data={shippingAddress} /> : null}
                </Fragment>
            );
        }

        case 'billingAddress': {
            let { billingAddress } = props;
            if (!billingAddress) {
                billingAddress = undefined;
            }

            return (
                <Fragment>
                    <AddressForm
                        cancel={handleCancel}
                        countries={countries}
                        isAddressInvalid={isAddressInvalid}
                        invalidAddressMessage={invalidAddressMessage}
                        initialValues={billingAddress}
                        submit={handleSubmitBillingForm}
                        submitting={submitting}
                        billingForm={true}
                        user={user}
                    />
                    {billingAddress && !isObjectEmpty(billingAddress) && !billingAddress.hasOwnProperty('sameAsShippingAddress') ?
                        <AddressItem classes={defaultClass} data={billingAddress} /> : null}
                </Fragment>

            );
        }

        case 'paymentMethod': {
            let { paymentData } = props;
            if (!paymentData) {
                paymentData = undefined;
            }

            return (
                <PaymentsForm
                    cancel={handleCancel}
                    countries={countries}
                    initialValues={paymentData}
                    paymentCode={paymentCode}
                    submit={handleSubmitPaymentsForm}
                    submitting={submitting}
                    paymentMethods={paymentMethods}
                    cart={cart}
                    cartCurrencyCode={cartCurrencyCode}
                    key={Identify.randomString()}
                />
            );
        }

        case 'shippingMethod': {
            const { availableShippingMethods, shippingMethod } = props;

            return (
                <ShippingForm
                    availableShippingMethods={availableShippingMethods}
                    cancel={handleCancel}
                    shippingMethod={shippingMethod}
                    submit={handleSubmitShippingForm}
                    submitting={submitting}
                    key={Identify.randomString()}
                />
            );
        }

        default: {
            return null;
        }
    }
};

EditableForm.propTypes = {
    availableShippingMethods: array,
    editing: oneOf(['address', 'billingAddress', 'paymentMethod', 'shippingMethod']),
    editOrder: func.isRequired,
    shippingAddress: object,
    shippingMethod: string,
    submitShippingAddress: func.isRequired,
    submitShippingMethod: func.isRequired,
    submitBillingAddress: func.isRequired,
    submitPaymentMethod: func.isRequired,
    submitting: bool,
    isAddressInvalid: bool,
    invalidAddressMessage: string,
    directory: shape({
        countries: array
    }),
    paymentMethods: array,
    user: object
};

export default EditableForm;
