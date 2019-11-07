import React, { useCallback, useMemo } from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import isObjectEmpty from 'src/util/isObjectEmpty';
import FormFields from '../components/formFields';
import Identify from 'src/simi/Helper/Identify';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

require('./AddressForm.scss')

const fields = [
    'city',
    'email',
    'firstname',
    'lastname',
    'postcode',
    'region_code',
    'street',
    'telephone',
    'company',
    'fax',
    'prefix',
    'suffix',
    'vat_id',
    'country_id',
    'save_in_address_book'
];

const defaultConfigFields = [
    'company_show',
    'street_show',
    'country_id_show',
    'region_id_show',
    'city_show',
    'zipcode_show',
    'telephone_show',
    'fax_show',
    'prefix_show',
    'suffix_show',
    'taxvat_show',
];

const DEFAULT_FORM_VALUES = {
    addresses_same: true
};

const AddressForm = props => {
    const {
        countries,
        isAddressInvalid,
        invalidAddressMessage,
        initialValues,
        submit,
        submitting,
        billingForm,
        billingAddressSaved,
        submitBilling,
        is_virtual,
    } = props;

    const formId = props.id?props.id:Identify.randomString()
    const validationMessage = isAddressInvalid ? invalidAddressMessage : null;

    let initialFormValues = initialValues;

    if (billingForm) {
        fields.push('addresses_same');
        if (isObjectEmpty(initialValues)) {
            initialFormValues = DEFAULT_FORM_VALUES;
        } else {
            if (initialValues.sameAsShippingAddress && !is_virtual) {
                initialFormValues = {
                    addresses_same: true
                };
            } else {
                initialFormValues = {
                    addresses_same: false,
                    ...initialValues
                };
                delete initialFormValues.sameAsShippingAddress;
            }
        }
    }

    const simiGetStoreConfig = Identify.getStoreConfig();
    const simiStoreViewCustomer = simiGetStoreConfig.simiStoreConfig.config.customer;

    let configFields = null;
    if (simiStoreViewCustomer && simiStoreViewCustomer.hasOwnProperty('address_fields_config')) {
        const { address_fields_config } = simiStoreViewCustomer;
        configFields = useMemo(
            () =>
                defaultConfigFields.reduce((acc, key) => {
                    acc[key] = address_fields_config[key];
                    return acc;
                }, {}),
            [address_fields_config]
        )
    }

    const values = useMemo(
        () =>
            fields.reduce((acc, key) => {
                if (key === 'save_in_address_book') {
                    acc[key] = initialFormValues[key] ? true : false;
                } else {
                    acc[key] = initialFormValues[key];
                }

                return acc;
            }, {}),
        [initialFormValues]
    );

    let initialCountry;
    let selectableCountries;
    const callGetCountries = { value: '', label: Identify.__('Please choose') }

    if (countries && countries.length) {
        selectableCountries = countries.map(
            ({ id, full_name_english }) => ({
                label: full_name_english,
                value: id
            })
        );
        initialCountry = values.country_id || '' //countries[0].id;
    } else {
        selectableCountries = [];
        initialCountry = '';
    }
    selectableCountries.unshift(callGetCountries);

    const handleSubmitBillingSameFollowShipping = useCallback(
        () => {
            const billingAddress = {
                sameAsShippingAddress: true
            }
            submitBilling(billingAddress);
        },
        [submitBilling]
    );

    const handleSubmit = (e) => {
        e.preventDefault()
        const submitValues = JSON.parse(JSON.stringify(values))
        let formValid = true
        $(`#${formId} input, #${formId} select`).each(function () {
            const inputField = $(this)
            if (inputField) {
                const value = inputField.val()
                if ((inputField.hasClass('isrequired') || inputField.attr('isrequired') === 'isrequired') && !value) {
                    inputField.addClass('warning')
                    formValid = false
                    smoothScrollToView(inputField, 350, 50)
                    return false
                }
                inputField.removeClass('warning')
                const name = inputField.attr('name')
                if (name) {
                    if (name === 'street[0]') {
                        submitValues.street = [value]
                    } else if (name === 'street[1]') { 
                        submitValues.street.push(value)
                    } else if (name === 'emailaddress') { 
                        submitValues['email'] = value
                    } else {
                        submitValues[name] = value
                    }
                }
            }
        });
        if (!formValid)
            return
        if (submitValues.hasOwnProperty('addresses_same')) delete submitValues.addresses_same
        if (submitValues.hasOwnProperty('selected_address_field')) delete submitValues.selected_address_field
        if (submitValues.hasOwnProperty('password')) delete submitValues.password
        if (submitValues.save_in_address_book) {
            submitValues.save_in_address_book = 1;
        } else {
            submitValues.save_in_address_book = 0;
        }
        submit(JSON.parse(JSON.stringify(submitValues)));
        if (!billingForm && !billingAddressSaved) {
            handleSubmitBillingSameFollowShipping();
        }
    }

    const handleFormReset = () => {
        Object.keys(values).forEach(k => values[k] = null)
    }

    const formChildrenProps = {
        ...props,
        submitting,
        submit,
        validationMessage,
        initialCountry,
        selectableCountries,
        configFields,
        handleFormReset,
        formId
    };

    return (
        <form 
            id={formId}
            onSubmit={handleSubmit}
            className='root'
            style={{ display: 'inline-block', width: '100%' }}
        >
            <FormFields {...formChildrenProps}/>
        </form>
    );
};

AddressForm.propTypes = {
    id: string,
    countries: array,
    invalidAddressMessage: string,
    initialValues: object,
    isAddressInvalid: bool,
    submit: func.isRequired,
    submitting: bool
};

AddressForm.defaultProps = {
    initialValues: {}
};

export default AddressForm;
