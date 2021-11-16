import React, { useState } from 'react';
import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import Identify from 'src/simi/Helper/Identify';
import PageTitle from '../../Components/PageTitle';
import { getAllowedCountries } from 'src/simi/Helper/Countries';
import CUSTOMER_ADDRESS_UPDATE from 'src/simi/queries/customerAddressUpdate.graphql';
import CUSTOMER_ADDRESS_CREATE from 'src/simi/queries/customerAddressCreate.graphql';
import { Checkbox } from 'informed';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { SimiMutation } from 'src/simi/Network/Query';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

require('./style.scss');

const renderRegionField = (selectedCountry, initialCountry, countries, addressData) => {
    const country_id = (selectedCountry !== -1) ? selectedCountry : initialCountry
    if (!country_id || !countries) return
    const country = countries.find(({ id }) => id === country_id);
    if (!country) return
    const { available_regions: regions } = country;
    const defaultRegion = addressData && addressData.region ? (addressData.region.hasOwnProperty('region_code') ? (addressData.region.region_code ? addressData.region.region_code : addressData.region.region) : addressData.region.region) : '';
    return (
        <div className={"form-row state-province"} id="state-province">
            <div className={`address-field-label req`}>{Identify.__("State")}</div>
            {(regions && Array.isArray(regions) && regions.length) ?
                <select defaultValue={addressData && addressData.region_code ? addressData.region_code : defaultRegion}
                    name="region_code" id='region_code' className={'isrequired'}>
                    <option key='pls-select' value="">{Identify.__('Please choose')}</option>
                    {regions.map((region, index) => {
                        return <option key={index} value={region.code}>{region.name}</option>
                    })}
                </select> :
                <input type="text" id='region_code' name='region_code' className={'isrequired'} defaultValue={defaultRegion} />
            }
        </div>
    )
}

const NewAddress = props => {
    const { addressId, history, toggleMessages } = props;

    const backAddressList = () => {
        toggleMessages([{ type: 'error', message: Identify.__('This address book id is not exist!') }]);
        history.push('/addresses.html');
    }

    const { simiStoreConfig } = Identify.getStoreConfig();
    const storeConfig = simiStoreConfig && simiStoreConfig.config ? simiStoreConfig.config : {};
    const { address_fields_config } = storeConfig.customer ? storeConfig.customer : {};
    const countries = getAllowedCountries();

    const CUSTOMER_MUTATION = addressId ? CUSTOMER_ADDRESS_UPDATE : CUSTOMER_ADDRESS_CREATE;

    let addressData = null;
    if (addressId) {
        if (history.location.state && history.location.state.hasOwnProperty('address') && history.location.state.address) {
            addressData = history.location.state.address;
        } else {
            backAddressList();
        }
    }

    const initialCountry = addressData && addressData.country_id ? addressData.country_id : (address_fields_config && address_fields_config.country_id_default ? address_fields_config.country_id_default : '');

    const [selectedCountry, setSelectedCountry] = useState(-1);

    const onHandleSelectCountry = () => {
        const country_id = $(`#address-form select[name=country_id]`).val();
        setSelectedCountry(country_id)
    }

    const getRegionObject = (country_id, region_id) => {
        if (!country_id || country_id === -1)
            country_id = initialCountry
        let country;
        for (let i in countries) {
            if (countries[i].id === country_id) {
                country = countries[i];
                break;
            }
        }
        if (country && country.available_regions && country.available_regions.length) {
            for (let i in country.available_regions) {
                if (
                    country.available_regions[i].id === parseInt(region_id) ||
                    country.available_regions[i].code === region_id
                ) {
                    return country.available_regions[i];
                }
            }
        }
        return null
    }

    let loading = false;

    const handleSubmit = (e, mutationCallback) => {
        e.preventDefault();
        const submitValues = {};
        let formValid = true;
        $(`#address-form input, #address-form select`).each(function () {
            const inputField = $(this)
            if (inputField) {
                const value = inputField.val().trim();
                if ((inputField.hasClass('isrequired') || inputField.attr('isrequired') === 'isrequired') && !value) {
                    inputField.addClass('warning');
                    formValid = false;
                    smoothScrollToView(inputField, 350, 50);
                    return false;
                }
                inputField.removeClass('warning');
                const name = inputField.attr('name');
                if (name) {
                    if (name === 'street[0]') {
                        submitValues.street = [value];
                    } else if (name === 'street[1]' || (name === 'street[2]')) {
                        submitValues.street.push(value);
                    } else if (name === 'default_shipping' || (name === 'default_billing')) {
                        submitValues[name] = $(this).is(":checked");
                    } else if (name === 'region' || (name === 'region_code')) {
                        submitValues.region = {}
                        const region = getRegionObject(selectedCountry, value);
                        if (region) {
                            submitValues.region.region = region.name;
                            submitValues.region.region_id = region.id;
                            submitValues.region.region_code = region.code;
                        } else {
                            submitValues.region.region = value;
                            submitValues.region.region_id = null;
                            submitValues.region.region_code = null;
                        }
                    } else {
                        submitValues[name] = value;
                    }
                }
            }
        });
        if (!formValid)
            return

        // required values
        if (address_fields_config) {
            if (!submitValues.telephone) submitValues.telephone = address_fields_config.telephone_default || 'NA';
            if (!submitValues.street || (submitValues.street instanceof Array && submitValues.street.every(element => element === ''))) submitValues.street = [address_fields_config.street_default || 'NA'];
            if (!submitValues.country_id) submitValues.country_id = address_fields_config.country_id_default || 'US';
            if (!submitValues.city) submitValues.city = address_fields_config.city_default || 'NA';
            if (!submitValues.postcode) submitValues.postcode = address_fields_config.zipcode_default || 'NA';
        }
        submitValues.id = submitValues.id = addressData && addressData.id ? addressData.id : ''; //address id
        loading = true;
        if (loading) {
            showFogLoading();
        }
        mutationCallback({ variables: JSON.parse(JSON.stringify(submitValues)) });
    }

    return <div className={`address-book ${addressId ? 'page-edit-address' : 'page-new-address'} edit-address`}>
        <PageTitle title={addressId ? Identify.__("Edit Address") : Identify.__("Add New Address")} />
        <form id="address-form">
            <div className="col-left">
                <div className="form-row">
                    <div className="col-label">{Identify.__('Contact Information')}</div>
                </div>
                <div className="form-row">
                    <div className='address-field-label req'>{Identify.__("First Name")}</div>
                    <input type="text" id='input-firstname' name='firstname' className='isrequired' defaultValue={addressData && addressData.firstname ? addressData.firstname : ''} />
                </div>
                <div className="form-row">
                    <div className='address-field-label req'>{Identify.__("Last Name")}</div>
                    <input type="text" id='input-lastname' name='lastname' className='isrequired' defaultValue={addressData && addressData.lastname ? addressData.lastname : ''} />
                </div>
                {(!address_fields_config || (address_fields_config && address_fields_config.company_show !== '3')) &&
                    <div className="form-row">
                        <div className={`address-field-label ${address_fields_config && address_fields_config.company_show === '1' ? 'req' : ''}`}>{Identify.__("Company")}</div>
                        <input type="text" id='input-company' name='company' className={address_fields_config && address_fields_config.company_show === '1' ? 'isrequired' : ''} defaultValue={addressData && addressData.company ? addressData.company : ''} />
                    </div>
                }
                {(!address_fields_config || (address_fields_config && address_fields_config.telephone_show !== '3')) &&
                    <div className="form-row">
                        <div className={`address-field-label ${address_fields_config && address_fields_config.telephone_show === '1' ? 'req' : ''}`}>{Identify.__("Phone Number")}</div>
                        <input type="text" id='input-telephone' name='telephone' className={address_fields_config && address_fields_config.telephone_show === '1' ? 'isrequired' : ''} defaultValue={addressData && addressData.telephone ? addressData.telephone : ''} />
                    </div>
                }
            </div>
            <div className="col-right">
                <div className="form-row">
                    <div className="col-label">{Identify.__('Address')}</div>
                </div>
                {(!address_fields_config || (address_fields_config && address_fields_config.street_show !== '3')) &&
                    <div className="form-row">
                        <div className={`address-field-label ${address_fields_config && address_fields_config.street_show === '1' ? 'req' : ''}`}>{Identify.__("Street Address")}</div>
                        <input type="text" id='input-street1' name='street[0]' className={address_fields_config && address_fields_config.street_show === '1' ? 'isrequired' : ''} defaultValue={addressData && addressData.street && addressData.street instanceof Array && addressData.street.length > 0 ? addressData.street[0] : ''} />
                        <input type="text" id='input-street2' name='street[1]' defaultValue={addressData && addressData.street && addressData.street instanceof Array && addressData.street.length > 1 ? addressData.street[1] : ''} />
                    </div>
                }
                {(!address_fields_config || (address_fields_config && address_fields_config.city_show !== '3')) &&
                    <div className="form-row">
                        <div className={`address-field-label ${address_fields_config && address_fields_config.city_show === '1' ? 'req' : ''}`}>{Identify.__("City")}</div>
                        <input type="text" id='input-city' name='city' className={address_fields_config && address_fields_config.city_show === '1' ? 'isrequired' : ''} defaultValue={addressData && addressData.city ? addressData.city : ''} />
                    </div>
                }
                {(!address_fields_config || (address_fields_config && address_fields_config.zipcode_show !== '3')) &&
                    <div className="form-row">
                        <div className={`address-field-label ${address_fields_config && address_fields_config.zipcode_show === '1' ? 'req' : ''}`}>{Identify.__("Zip/Postal Code")}</div>
                        <input type="text" id='input-postcode' name='postcode' className={address_fields_config && address_fields_config.zipcode_show === '1' ? 'isrequired' : ''} defaultValue={addressData && addressData.postcode ? addressData.postcode : ''} />
                    </div>
                }
                <div className="form-row">
                    <div className={`address-field-label req`}>{Identify.__("Country")}</div>
                    <select
                        name="country_id"
                        key={address_fields_config && address_fields_config.country_id_default || (addressData && addressData.country_id) /*change key to change initial value*/}
                        defaultValue={initialCountry}
                        onChange={onHandleSelectCountry} onBlur={onHandleSelectCountry}
                        className={'isrequired'}
                    >
                        <option key='pls-select' value="">{Identify.__('Please choose')}</option>
                        {
                            countries.filter(({ full_name_locale }) => full_name_locale !== '').map((country, index) => {
                                return <option key={index} value={country.id}>{country.full_name_locale}</option>;
                            })
                        }
                    </select>
                </div>
                {renderRegionField(selectedCountry, initialCountry, countries, addressData)}
                <div className="form-row">
                    <div className="checkbox">
                        <Checkbox id="checkbox-billing" field="default_billing" initialValue={addressData && addressData.default_billing ? addressData.default_billing : ''} />
                        <label htmlFor="checkbox-billing">{Identify.__('Use as my default billing address')}</label>
                    </div>
                    <div className="checkbox">
                        <Checkbox id="checkbox-shipping" field="default_shipping" initialValue={addressData && addressData.default_shipping ? addressData.default_shipping : ''} />
                        <label htmlFor="checkbox-shipping">{Identify.__('Use as my default shipping address')}</label>
                    </div>
                </div>
            </div>
            <div className="form-button">
                <SimiMutation mutation={CUSTOMER_MUTATION}>
                    {(mutationCallback, { data, error }) => {
                        if (error) {
                            hideFogLoading();
                            const graphqlError = error.message.replace('GraphQL error: ', '')
                            toggleMessages([{ type: 'error', message: Identify.__(`${graphqlError}`) }])
                        }
                        if (data) {
                            if (addressData && addressData.id) {
                                toggleMessages([{ type: 'success', message: Identify.__("Update address successful!"), auto_dismiss: true }]);
                            } else {
                                toggleMessages([{ type: 'success', message: Identify.__('Create new address successful!'), auto_dismiss: true }]);
                            }
                            hideFogLoading();
                            history.push('/addresses.html');
                        }
                        return (<div className='btn btn-save-address'>
                            <button onClick={(e) => handleSubmit(e, mutationCallback)}>
                                <span>{Identify.__('Save Address')}</span>
                            </button>
                        </div>);
                    }}
                </SimiMutation>

            </div>
        </form>
    </div>
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(null, mapDispatchToProps)(NewAddress);
