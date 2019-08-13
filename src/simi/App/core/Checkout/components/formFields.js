import React, { useCallback, Fragment, useState } from 'react';
import { useFormState } from 'informed';
import { Util } from '@magento/peregrine';
import {
    validateEmail,
    isRequired
} from 'src/util/formValidators';
import { validateTelephone } from 'src/simi/Helper/informedValidation';

import defaultClasses from './formFields.css';
import combine from 'src/util/combineValidators';
import TextInput from 'src/components/TextInput';
import Field from 'src/components/Field';
import Select from 'src/components/Select';
import Checkbox from 'src/components/Checkbox';
import Button from 'src/components/Button';
import Identify from 'src/simi/Helper/Identify';
import { checkExistingCustomer, simiSignIn } from 'src/simi/Model/Customer';
import isObjectEmpty from 'src/util/isObjectEmpty';
import { Link } from 'react-router-dom';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import * as Constants from 'src/simi/Config/Constants'
import LoadingImg from 'src/simi/BaseComponents/Loading/LoadingImg';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const listAddress = (addresses) => {
    let html = [];
    if (addresses && addresses.length) {
        html = addresses.map(address => {
            const labelA = address.firstname + ' ' + address.lastname + ', ' + address.city + ', ' + address.region.region;
            return { value: address.id, label: labelA };
        });

    }
    const ctoSelect = { value: '', label: Identify.__('Please choose') };
    html.unshift(ctoSelect);

    const new_Address = { value: 'new_address', label: Identify.__('New Address') };
    html.push(new_Address);
    return html;
}

const listState = (states) => {
    let html = null;
    if (states && states.length) {
        html = states.map(itemState => {
            return { value: itemState.code, label: itemState.name };
        });
        const ctoState = { value: '', label: Identify.__('Please choose') };
        html.unshift(ctoState);
    }
    return html;
}

let showState = null;

const FormFields = (props) => {
    const { classes,
        billingForm,
        validationMessage,
        initialCountry,
        selectableCountries,
        submitting,
        submit,
        user,
        billingAddressSaved,
        submitBilling,
        simiSignedIn,
        countries,
        configFields,
        handleFormReset } = props;

    const { isSignedIn, currentUser } = user;

    const { addresses, default_billing, default_shipping } = currentUser;

    const checkCustomer = false;

    const [shippingNewForm, setShippingNewForm] = useState(false);
    const [handlingEmail, setHandlingEmail] = useState(false)
    const [existCustomer, setExistCustomer] = useState(checkCustomer);

    // existCustomer = isSignedIn ? false : existCustomer;

    const formState = useFormState();

    const storageShipping = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'shipping_address');
    const storageBilling = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'billing_address');

    const initialShipping = !billingForm && isSignedIn && storageShipping ? storageShipping : default_shipping ? default_shipping : null;
    const initialBilling = billingForm && isSignedIn && storageBilling ? storageBilling : default_billing ? default_billing : null;

    const resetForm = useCallback(
        () => {
            handleFormReset()
        },
        [handleFormReset]
    )

    const handleSubmitBillingSameFollowShipping = useCallback(
        () => {
            const billingAddress = {
                sameAsShippingAddress: true
            }
            submitBilling(billingAddress);
        },
        [submitBilling]
    )

    const handleChooseShipping = () => {
        if (formState.values.selected_address_field !== 'new_address') {
            const { selected_address_field } = formState.values;
            setShippingNewForm(false);
            const shippingFilter = addresses.find(
                ({ id }) => id === parseInt(selected_address_field, 10)
            );

            if (shippingFilter) {
                if (!shippingFilter.email) shippingFilter.email = currentUser.email;

                if (shippingFilter.id) {
                    if (billingForm) {
                        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'billing_address', shippingFilter.id);
                    } else {
                        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'shipping_address', shippingFilter.id);
                    }
                }
                handleSubmit(shippingFilter);
                if (!billingForm && !billingAddressSaved) {
                    handleSubmitBillingSameFollowShipping();
                }
            }
        } else {
            if (billingForm) {
                Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'billing_address', 'new_address');
            } else {
                Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'shipping_address', 'new_address');
            }
            setShippingNewForm(true);
            resetForm();
        }
    }

    const handleSubmit = useCallback(
        values => {
            if (values.hasOwnProperty('selected_address_field')) delete values.selected_address_field
            if (values.hasOwnProperty('password')) delete values.password
            if (values.save_in_address_book) {
                values.save_in_address_book = 1;
            } else {
                values.save_in_address_book = 0;
            }
            submit(values);
        },
        [submit]
    );

    const processData = (data) => {
        setHandlingEmail(false);
        if (data.hasOwnProperty('customer') && !isObjectEmpty(data.customer) && data.customer.email) {
            setExistCustomer(true);
        } else {
            setExistCustomer(false);
        }
    }

    const checkMailExist = () => {
        const { email } = formState.values;
        if (!email || !Identify.validateEmail(email)) return;
        setHandlingEmail(true);
        checkExistingCustomer(processData, email)
    }

    const handleActionSignIn = useCallback(
        (value) => {
            simiSignedIn(value);
        },
        [simiSignedIn]
    )

    const setDataLogin = (data) => {

        hideFogLoading();
        if (data && !data.errors) {
            if (data.customer_access_token) {
                Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID, data.customer_identity)
                setToken(data.customer_access_token)
                handleActionSignIn(data.customer_access_token)
            } else {
                setToken(data)
                handleActionSignIn(data)
            }
        } else {
            smoothScrollToView($("#id-message"));
            if (props.toggleMessages){
                props.toggleMessages([{ type: 'error', message: Identify.__('The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.'), auto_dismiss: true }])
            }
        }
    }

    const handleSignIn = () => {
        const { email, password } = formState.values;
        if (!email || !password || !email.trim() || !password.trim()) {
            smoothScrollToView($("#id-message"));
            if (props.toggleMessages){
                props.toggleMessages([{ type: 'error', message: Identify.__('Email and password is required to login!'), auto_dismiss: true }])
            }
            return;
        }
        const username = email;
        simiSignIn(setDataLogin, { username, password })
        showFogLoading()
    }

    const onHandleSelectCountry = () => {
        const { country_id } = formState.values;
        if (!country_id) {
            showState = null;
            return;
        }
        const country = countries.find(({ id }) => id === country_id);
        const { available_regions: regions } = country;
        if (country.available_regions && Array.isArray(regions) && regions.length && (!configFields || (configFields && configFields.hasOwnProperty('region_id_show') && configFields.region_id_show))) {
            showState = <div className={classes.region_code}>
                <Field label={Identify.__("State")}>
                    <Select field="region_code" items={listState(regions)} validate={(!configFields || (configFields && configFields.hasOwnProperty('street_show') && configFields.street_show === 'req')) ? isRequired : ''} />
                </Field>
            </div>
        } else {
            showState = null;
        }
    }

    const forgotPasswordLocation = {
        pathname: '/login.html',
        state: {
            forgot: true
        }
    }

    const viewFields = !formState.values.addresses_same ? (
        <Fragment>
            {isSignedIn && <div className={classes.shipping_address}>
                <Field label={billingForm ? Identify.__("Select Billing") : Identify.__("Select Shipping")}>
                    <Select
                        field="selected_address_field"
                        initialValue={billingForm ? initialBilling : initialShipping}
                        items={listAddress(addresses)}
                        onChange={() => handleChooseShipping()}
                    />
                </Field>
            </div>}
            {!isSignedIn || shippingNewForm || ((billingForm && storageBilling === 'new_address') || (!billingForm && storageShipping === 'new_address')) ?
                <Fragment>
                    {!isSignedIn && <div className={classes.email}>
                        <Field label={Identify.__("Email")} required>
                            <TextInput
                                id={classes.email}
                                field="email"
                                validate={combine([isRequired, validateEmail])}
                                onBlur={() => !billingForm && !user.isSignedIn && checkMailExist()}
                            />
                            {handlingEmail && <LoadingImg divStyle={{ marginTop: 5 }} />}
                        </Field>
                    </div>}
                    {existCustomer && <Fragment>
                        <div className={classes.password}>
                            <Field label="Password" required>
                                <TextInput
                                    id={classes.password}
                                    field="password"
                                    type="password"
                                />
                            </Field>
                            <span style={{ marginTop: 6, display: 'block' }}>{Identify.__('You already have an account with us. Sign in or continue as guest')}</span>
                        </div>
                        <div className={defaultClasses['btn_login_exist']}>
                            <Button
                                className={classes.button}
                                style={{ marginTop: 10 }}
                                type="button"
                                onClick={() => handleSignIn()}
                            >{Identify.__('Login')}</Button>
                            <Link style={{ marginLeft: 5 }} to={forgotPasswordLocation}>{Identify.__('Forgot password?')}</Link>
                        </div>
                    </Fragment>
                    }
                    <div className={classes.firstname}>
                        <Field label={Identify.__("First Name")} required>
                            <TextInput
                                id={classes.firstname}
                                field="firstname"
                                validate={isRequired}
                            />
                        </Field>
                    </div>
                    <div className={classes.lastname}>
                        <Field label={Identify.__("Last Name")} required>
                            <TextInput
                                id={classes.lastname}
                                field="lastname"
                                validate={isRequired}
                            />
                        </Field>
                    </div>
                    {configFields && configFields.hasOwnProperty('company_show') && configFields.company_show ?
                        <div className={classes.company}>
                            <Field label={Identify.__("Company")} required={configFields.company_show === 'req' ? true : false}>
                                <TextInput
                                    id={classes.company}
                                    field="company"
                                    validate={configFields && configFields.company_show === 'req' ? isRequired : ''}
                                />
                            </Field>
                        </div>
                        : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('street_show') && configFields.street_show) ?
                        <div className={classes.street0}>
                            <Field label={Identify.__("Street")} required={(!configFields || configFields.street_show === 'req') ? true : false} >
                                <TextInput
                                    id={classes.street0}
                                    field="street[0]"
                                    validate={(!configFields || (configFields && configFields.hasOwnProperty('street_show') && configFields.street_show === 'req')) ? isRequired : ''}
                                />
                            </Field>
                            <Field>
                                <TextInput field="street[1]" />
                            </Field>
                        </div>
                        : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('city_show') && configFields.city_show) ?
                        <div className={classes.city}>
                            <Field label={Identify.__("City")} required={(!configFields || configFields.city_show === 'req') ? true : false} >
                                <TextInput
                                    id={classes.city}
                                    field="city"
                                    validate={(!configFields || (configFields && configFields.hasOwnProperty('city_show') && configFields.city_show === 'req')) ? isRequired : ''}
                                />
                            </Field>
                        </div> : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('zipcode_show') && configFields.zipcode_show) ?
                        <div className={classes.postcode}>
                            <Field label={Identify.__("ZIP")} required={(!configFields || configFields.zipcode_show === 'req') ? true : false}>
                                <TextInput
                                    id={classes.postcode}
                                    field="postcode"
                                    validate={(!configFields || (configFields && configFields.hasOwnProperty('zipcode_show') && configFields.zipcode_show === 'req')) ? isRequired : ''}
                                />
                            </Field>
                        </div> : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('country_id_show') && configFields.country_id_show) ?
                        <div className={classes.country}>
                            <Field label={Identify.__("Country")} required={(!configFields || configFields.country_id_show === 'req') ? true : false}>
                                <Select
                                    field="country_id"
                                    initialValue={initialCountry}
                                    items={selectableCountries}
                                    onChange={() => onHandleSelectCountry()}
                                    validate={(!configFields || (configFields && configFields.hasOwnProperty('country_id_show') && configFields.country_id_show === 'req')) ? isRequired : ''}
                                />
                            </Field>
                        </div> : null}
                    {showState}
                    {!configFields || (configFields && configFields.hasOwnProperty('telephone_show') && configFields.telephone_show) ?
                        <div className={classes.telephone}>
                            <Field label={Identify.__("Phone")} required={(!configFields || configFields.telephone_show === 'req') ? true : false}>
                                <TextInput
                                    id={classes.telephone}
                                    field="telephone"
                                    validate={(!configFields || (configFields && configFields.hasOwnProperty('telephone_show') && configFields.telephone_show === 'req')) ? combine([isRequired, validateTelephone]) : ''}
                                />
                            </Field>
                        </div> : null}
                    {configFields && configFields.hasOwnProperty('fax_show') && configFields.fax_show ?
                        <div className={classes.fax}>
                            <Field label={Identify.__("Fax")} required={configFields.fax_show === 'req' ? true : false}>
                                <TextInput
                                    id={classes.fax}
                                    field="fax"
                                    validate={configFields && configFields.fax_show === 'req' ? isRequired : ''}
                                />
                            </Field>
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('prefix_show') && configFields.prefix_show ?
                        <div className={classes.prefix}>
                            <Field label={Identify.__("Prefix")} required={configFields.prefix_show === 'req' ? true : false}>
                                <TextInput
                                    id={classes.prefix}
                                    field="prefix"
                                    validate={configFields && configFields.prefix_show === 'req' ? isRequired : ''}
                                />
                            </Field>
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('suffix_show') && configFields.suffix_show ?
                        <div className={classes.suffix}>
                            <Field label={Identify.__("Suffix")} required={configFields.suffix_show === 'req' ? true : false}>
                                <TextInput
                                    id={classes.suffix}
                                    field="suffix"
                                    validate={configFields && configFields.suffix_show === 'req' ? isRequired : ''}
                                />
                            </Field>
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('taxvat_show') && configFields.taxvat_show ?
                        <div className={classes.vat_id}>
                            <Field label={Identify.__("VAT")} required={configFields.taxvat_show === 'req' ? true : false}>
                                <TextInput
                                    id={classes.vat_id}
                                    field="vat_id"
                                    validate={configFields && configFields.taxvat_show === 'req' ? isRequired : ''}
                                />
                            </Field>
                        </div>
                        : null}
                    <div className={classes.save_in_address_book}>
                        <Checkbox field="save_in_address_book" label={Identify.__('Save in address book.')} />
                    </div>
                    <div className={classes.validation}>{validationMessage}</div>
                </Fragment> : null}
        </Fragment>
    ) : null;

    const viewSubmit = !formState.values.addresses_same && (!isSignedIn || shippingNewForm || ((billingForm && storageBilling === 'new_address') || (!billingForm && storageShipping === 'new_address'))) ? (
        <div className={classes.footer}>
            <Button
                className={classes.button}
                style={{ marginTop: 10, float: 'right' }}
                type="submit"
                priority="high"
                disabled={submitting}
            >{Identify.__('Save Address')}</Button>
        </div>
    ) : null;

    const handleCheckSame = useCallback(
        () => {

            const sameAsShippingAddress = formState.values['addresses_same'];
            let billingAddress;
            if (!sameAsShippingAddress) {
                return;
            } else {
                billingAddress = {
                    sameAsShippingAddress
                };
            }
            submit(billingAddress);
        },
        [submit]
    );

    const checkSameShippingAddress = () => {
        handleCheckSame();
    }

    return <Fragment>
        <div className={classes.body}>
            {billingForm && <Checkbox field="addresses_same" label={Identify.__("Billing address same as shipping address")} onChange={() => checkSameShippingAddress()} />}
            {viewFields}
        </div>
        {viewSubmit}
    </Fragment>
}

export default FormFields;

async function setToken(token) {
    // TODO: Get correct token expire time from API
    return storage.setItem('signin_token', token, 3600);
}

/*
const mockAddress = {
    country_id: 'US',
    firstname: 'Veronica',
    lastname: 'Costello',
    street: ['6146 Honey Bluff Parkway'],
    city: 'Calder',
    postcode: '49628-7978',
    region_id: 33,
    region_code: 'MI',
    region: 'Michigan',
    telephone: '(555) 229-3326',
    email: 'veronica@example.com'
};
*/
