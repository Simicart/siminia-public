import React, { useCallback, Fragment, useState } from 'react';
import { Util } from '@magento/peregrine';
import Checkbox from 'src/components/Checkbox';
import Button from 'src/components/Button';
import Select from 'src/components/Select';
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
require('./formFields.scss')

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

const renderRegionField = (selectedCountry, initialCountry, countries, configFields, initialValues) => {
    const country_id = (selectedCountry !== -1) ? selectedCountry : initialCountry
    if (!country_id || !countries) return
    const country = countries.find(({ id }) => id === country_id);
    if (!country) return
    const { available_regions: regions } = country;
    if (!configFields || (configFields && configFields.hasOwnProperty('region_id_show') && configFields.region_id_show)) {
        return (
            <div className='region_code'>
                <div className={`address-field-label ${configFields.region_id_show === 'req' ? 'req' : ''}`}>{Identify.__("State")}</div>
                {
                    (country.available_regions && Array.isArray(regions) && regions.length) ?
                    <Select
                        initialValue={initialValues.region_code}
                        key={Identify.randomString(3)}
                        field="region_code" items={listState(regions)}
                        isrequired={(!configFields || (configFields && configFields.hasOwnProperty('region_id_show') && configFields.region_id_show === 'req')) ? 'isrequired' : ''}
                    /> :
                    <input type="text" id='region_code' name='region_code'
                    className={configFields.region_id_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.region_code}></input>
                }
            </div>
        )
    }
}

const FormFields = (props) => {
    const {
        formId,
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
        handleFormReset,
        is_virtual,
        initialValues
    } = props;

    const { isSignedIn, currentUser } = user;

    const { addresses, default_billing, default_shipping } = currentUser;

    const checkCustomer = false;

    const [shippingNewForm, setShippingNewForm] = useState(false);
    const [handlingEmail, setHandlingEmail] = useState(false)
    const [existCustomer, setExistCustomer] = useState(checkCustomer);
    const [selectedCountry, setSelectedCountry] = useState(-1);
    const [usingSameAddress, setUsingSameAddress] = useState(billingForm === true);

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

    const handleChooseAddedAddress = () => {
        const selected_address_field = $(`#${formId} select[name=selected_address_field]`).val()
        if (selected_address_field !== 'new_address') {
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
            if (values.hasOwnProperty('default_billing')) delete values.default_billing
            if (values.hasOwnProperty('default_shipping')) delete values.default_shipping
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
        const email = $(`#${formId} input[name=emailaddress]`).val()
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
        const email = $(`#${formId} input[name=emailaddress]`).val()
        const password = $(`#${formId} input[name=password]`).val()
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
        const country_id = $(`#${formId} select[name=country_id]`).val()
        setSelectedCountry(country_id)
    }

    const forgotPasswordLocation = {
        pathname: '/login.html',
        state: {
            forgot: true
        }
    }

    const listOptionsAddress = (addresses) => {
        let html = null;
        if (addresses && addresses.length){
            html = addresses.map((address, idx) => {
                const labelA = address.firstname + ' ' + address.lastname + ', ' + address.city + ', ' + address.region.region;
                return <option value={address.id} key={idx}>{labelA}</option>
            });
        }
        return <Fragment>
            <option value="">{Identify.__('Please choose')}</option>
            {html}
            <option value="new_address">{Identify.__('New Address')}</option>
        </Fragment>;
    }


    const viewFields = (!usingSameAddress) ? (
        <Fragment>
            {isSignedIn &&                     <div className='shipping_address'>
                        <div className={`address-field-label ${(!configFields || configFields.country_id_show === 'req') ? 'req' : ''}`}>{billingForm ? Identify.__("Select Billing") : Identify.__("Select Shipping")}</div>
                        <select name="selected_address_field"
                        defaultValue={billingForm ? initialBilling : initialShipping}
                        onChange={() => handleChooseAddedAddress()}>
                            {listOptionsAddress(addresses)}
                        </select>
                    </div>
}
            {!isSignedIn || shippingNewForm || ((billingForm && storageBilling === 'new_address') || (!billingForm && storageShipping === 'new_address')) ?
                <Fragment>
                    {!isSignedIn && <div className='email'>
                            <div className={`address-field-label req`}>{Identify.__("Email")}</div>
                            <input
                                type="email" name="emailaddress" className="isrequired" id='email'
                                onBlur={() => !billingForm && !user.isSignedIn && checkMailExist()}
                                defaultValue={initialValues.email}
                            />
                            {handlingEmail && <LoadingImg divStyle={{ marginTop: 5 }} />}
                        </div>}
                    {existCustomer && <Fragment>
                        <div className='password'>
                            <div className={`address-field-label req`}>{Identify.__("Password")}</div>
                            <input id="password" type="password" name="password" className="isrequired"/>
                            <span style={{ marginTop: 6, display: 'block' }}>{Identify.__('You already have an account with us. Sign in or continue as guest')}</span>
                        </div>
                        <div className='btn_login_exist'>
                            <Button
                                className='button'
                                style={{ marginTop: 10 }}
                                type="button"
                                onClick={() => handleSignIn()}
                            >{Identify.__('Login')}</Button>
                            <Link style={{ marginLeft: 5 }} to={forgotPasswordLocation}>{Identify.__('Forgot password?')}</Link>
                        </div>
                    </Fragment>
                    }
                    <div className='firstname'>
                        <div className={`address-field-label req`}>{Identify.__("First Name")}</div>
                        <input type="text" id='firstname' name='firstname' className="isrequired" defaultValue={initialValues.firstname}></input>
                    </div>
                    <div className='lastname'>
                        <div className={`address-field-label req`}>{Identify.__("Last Name")}</div>
                        <input type="text" id='lastname' name='lastname' className="isrequired" defaultValue={initialValues.lastname}></input>
                    </div>
                    {configFields && configFields.hasOwnProperty('company_show') && configFields.company_show ?
                        <div className='company'>
                            <div className={`address-field-label ${configFields.company_show === 'req' ? 'req' : ''}`}>{Identify.__("Company")}</div>
                            <input type="text" id='company' name='company' className={configFields.company_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.company}></input>
                        </div>
                        : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('street_show') && configFields.street_show) ?
                        <div className='street0'>
                            <div className={`address-field-label ${configFields.street_show === 'req' ? 'req' : ''}`}>{Identify.__("Street")}</div>
                            <input type="text" id='street[0]' name='street[0]' className={configFields.street_show === 'req' ? 'isrequired' : ''} defaultValue={(initialValues.street && initialValues.street[0])?initialValues.street[0]:''}></input>
                            <input type="text" id='street[1]' name='street[1]' defaultValue={(initialValues.street && initialValues.street[1])?initialValues.street[1]:''}></input>
                        </div>
                        : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('city_show') && configFields.city_show) ?
                        <div className='city'>
                            <div className={`address-field-label ${configFields.city_show === 'req' ? 'req' : ''}`}>{Identify.__("City")}</div>
                            <input type="text" id='city' name='city' className={configFields.city_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.city}></input>
                        </div> : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('zipcode_show') && configFields.zipcode_show) ?
                        <div className='postcode'>
                            <div className={`address-field-label ${configFields.zipcode_show === 'req' ? 'req' : ''}`}>{Identify.__("ZIP")}</div>
                            <input type="text" id='postcode' name='postcode' className={configFields.zipcode_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.postcode}></input>
                        </div> : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('country_id_show') && configFields.country_id_show) ?
                        <div className='country'>
                            <div className={`address-field-label ${(!configFields || configFields.country_id_show === 'req') ? 'req' : ''}`}>{Identify.__("Country")}</div>
                            <Select
                                field="country_id"
                                key={initialCountry /*change key to change initial value*/}
                                initialValue={initialCountry}
                                onChange={() => onHandleSelectCountry()} onBlur={() => onHandleSelectCountry()}
                                items={selectableCountries}
                                isrequired={(!configFields || (configFields && configFields.hasOwnProperty('country_id_show') && configFields.country_id_show === 'req')) ? 'isrequired' : ''}
                            />
                        </div> : null}
                    {renderRegionField(selectedCountry, initialCountry, countries, configFields, initialValues)}
                    {!configFields || (configFields && configFields.hasOwnProperty('telephone_show') && configFields.telephone_show) ?
                        <div className='telephone'>
                            <div className={`address-field-label ${configFields.telephone_show === 'req' ? 'req' : ''}`}>{Identify.__("Phone")}</div>
                            <input type="tel" id='telephone' name='telephone' className={configFields.telephone_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.telephone}></input>
                        </div> : null}
                    {configFields && configFields.hasOwnProperty('fax_show') && configFields.fax_show ?
                        <div className='fax'>
                            <div className={`address-field-label ${configFields.fax_show === 'req' ? 'req' : ''}`}>{Identify.__("Fax")}</div>
                            <input type="tel" id='fax' name='fax' className={configFields.fax_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.fax}></input>
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('prefix_show') && configFields.prefix_show ?
                        <div className='prefix'>
                            <div className={`address-field-label ${configFields.prefix_show === 'req' ? 'req' : ''}`}>{Identify.__("Prefix")}</div>
                            <input type="text" id='prefix' name='prefix' className={configFields.prefix_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.prefix}></input>
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('suffix_show') && configFields.suffix_show ?
                        <div className='suffix'>
                            <div className={`address-field-label ${configFields.suffix_show === 'req' ? 'req' : ''}`}>{Identify.__("Suffix")}</div>
                            <input type="text" id='suffix' name='suffix' className={configFields.suffix_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.suffix}></input>
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('taxvat_show') && configFields.taxvat_show ?
                        <div className='vat_id'>
                            <div className={`address-field-label ${configFields.taxvat_show === 'req' ? 'req' : ''}`}>{Identify.__("VAT")}</div>
                            <input type="text" id='vat_id' name='vat_id' className={configFields.taxvat_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.vat_id}></input>
                        </div>
                        : null}
                    <div className='save_in_address_book'>
                        <Checkbox field="save_in_address_book" label={Identify.__('Save in address book.')} />
                    </div>
                    <div className='validation'>{validationMessage}</div>
                </Fragment> : null}
        </Fragment>
    ) : null;
    const viewSubmit = !usingSameAddress && (!isSignedIn || shippingNewForm || ((billingForm && storageBilling === 'new_address') || (!billingForm && storageShipping === 'new_address'))) ? (
        <div className='footer'>
            <Button
                className='button'
                style={{ marginTop: 10, float: 'right' }}
                type="submit"
                priority="high"
                disabled={submitting}
            >{Identify.__('Save Address')}</Button>
        </div>
    ) : null;

    const toggleSameShippingAddress = () => {
        const sameAsShippingAddress = !usingSameAddress
        let billingAddress;
        if (sameAsShippingAddress) {
            billingAddress = {
                sameAsShippingAddress
            };
            submit(billingAddress);
        }
        setUsingSameAddress(sameAsShippingAddress)
    }

    return (
        <React.Fragment>
            <div className='body form-fields-body'>
                {(billingForm && !is_virtual) &&
                    <div className="billing-same">
                        {(billingForm && !is_virtual) && <Checkbox
                            fieldState={{value: usingSameAddress}}
                            field="addresses_same" label={Identify.__("Billing address same as shipping address")}
                            onChange={() => toggleSameShippingAddress()} />}
                    </div>}
                {viewFields}
            </div>
            {viewSubmit}
        </React.Fragment>
    )
}

export default FormFields;

async function setToken(token) {
    // TODO: Get correct token expire time from API
    return storage.setItem('signin_token', token, 3600);
}
