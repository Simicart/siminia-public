import React, {useState} from 'react';
import { connect } from 'src/drivers';
import { Checkbox } from 'informed';
import Identify from 'src/simi/Helper/Identify';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Loading from "src/simi/BaseComponents/Loading";
import { SimiMutation } from 'src/simi/Network/Query';
import CUSTOMER_ADDRESS_UPDATE from 'src/simi/queries/customerAddressUpdate.graphql';
import CUSTOMER_ADDRESS_CREATE from 'src/simi/queries/customerAddressCreate.graphql';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

const renderRegionField = (selectedCountry, initialCountry, countries, addressConfig, addressData) => {
    const country_id = (selectedCountry !== -1) ? selectedCountry : initialCountry
    if (!country_id || !countries) return
    const country = countries.find(({ id }) => id === country_id);
    if (!country) return
    const { available_regions: regions } = country;
    if (!addressConfig || (addressConfig && addressConfig.hasOwnProperty('region_id_show') && addressConfig.region_id_show)) {
        return (
            <div className={"form-row" + ' '+ "state-province"} id="state-province">
                <div className={`address-field-label ${addressConfig && addressConfig.region_id_show === 'req' ? 'req' : ''}`}>{Identify.__("State")}</div> 
                {
                    (regions && Array.isArray(regions) && regions.length) ?
                    <select 
                        defaultValue={addressData.region_code?addressData.region_code:addressData.region.region}
                        name="region_code" id='region_code'
                        className={addressConfig && addressConfig.region_id_show === 'req' ? 'isrequired' : ''}
                    >
                        <option key='pls-select' value="">{Identify.__('Please choose')}</option>
                        {regions.map((region, index) => {
                            return <option key={index} value={region.code}>{region.name}</option>
                        })}
                    </select> :
                    <input type="text" id='region_code' name='region_code' 
                        className={addressConfig && addressConfig.region_id_show === 'req' ? 'isrequired' : ''} defaultValue={addressData.region.region}></input>

                }
            </div>
        )
    }
}

const Edit = props => {

    const { addressData, countries, address_fields_config } = props;
    const addressConfig = address_fields_config;

    var CUSTOMER_MUTATION = CUSTOMER_ADDRESS_CREATE;
    if (addressData.id) {
        CUSTOMER_MUTATION = CUSTOMER_ADDRESS_UPDATE;
    }
    const initialCountry = addressConfig && addressConfig.country_id_default || addressData.country_id
    const [selectedCountry, setSelectedCountry] = useState(-1);

    const onHandleSelectCountry = () => {
        const country_id = $(`#address-form select[name=country_id]`).val()
        setSelectedCountry(country_id)
    }

    const getRegionObject = (country_id, region_id) => {
        if (!country_id || country_id === -1)
            country_id = initialCountry
        var country;
        for(var i in countries) {
            if (countries[i].id === country_id){
                country = countries[i];
                break;
            }
        }
        if (country && country.available_regions && country.available_regions.length) {
            for (var i in country.available_regions) {
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

    var loading = false;

    const handleSubmit = (e, mutationCallback) => {
        e.preventDefault()
        const submitValues = {}
        let formValid = true
        $(`#address-form input, #address-form select`).each(function () {
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
                    } else if (name === 'street[1]' || (name === 'street[2]')) { 
                        submitValues.street.push(value)
                    } else if (name === 'default_shipping' || (name === 'default_billing')) { 
                        submitValues[name] = $(this).is(":checked")
                    } else if (name === 'region' || (name === 'region_code')) { 
                        submitValues.region = {}
                        const region = getRegionObject(selectedCountry, value);
                        if (region) {
                            submitValues.region.region = region.name;
                            submitValues.region.region_id = region.id;
                            submitValues.region.region_code = region.code;
                        } else {
                            submitValues.region.region = value
                            submitValues.region.region_id = null;
                            submitValues.region.region_code = null;
                        }
                    } else {
                        submitValues[name] = value
                    }
                }
            }
        });
        if (!formValid)
            return

        // required values
        var config = addressConfig;
        if (config) {
            if (!submitValues.telephone) submitValues.telephone     = config.telephone_default || 'NA';
            if (!submitValues.street) submitValues.street           = [config.street_default || 'NA'];
            if (!submitValues.country_id) submitValues.country_id   = config.country_id_default || 'US';
            if (!submitValues.city) submitValues.city               = config.city_default || 'NA';
            if (!submitValues.postcode) submitValues.postcode       = config.zipcode_default || 'NA';
        }
        submitValues.id = addressData.id; //address id
        loading = true;
        mutationCallback({ variables: JSON.parse(JSON.stringify(submitValues))});
    }

    return (
        <div className='edit-address'>
            {TitleHelper.renderMetaHeader({title: Identify.__('Edit Address')})}
            <form id="address-form" >
                <div className="col-left">
                    <div className="form-row">
                        <div className="col-label">{Identify.__('Contact Information')}</div>
                    </div>
                    <div className="form-row">
                        <div className='address-field-label req'>{Identify.__("First Name")}</div>
                        <input type="text" id='input-firstname' name='firstname' className='isrequired' defaultValue={addressData.firstname}></input>
                    </div>
                    <div className="form-row">
                        <div className='address-field-label req'>{Identify.__("Last Name")}</div>
                        <input type="text" id='input-lastname' name='lastname' className='isrequired' defaultValue={addressData.lastname}></input>
                    </div>
                    { (!addressConfig || (addressConfig && addressConfig.company_show)) && 
                        <div className="form-row">
                            <div className={`address-field-label ${addressConfig && addressConfig.company_show === 'req' ? 'req' : ''}`}>{Identify.__("Company")}</div> 
                            <input type="text" id='input-company' name='company' className={addressConfig && addressConfig.company_show === 'req' ? 'isrequired' : ''} defaultValue={addressData.company}></input>
                        </div>
                    }
                    {
                        (!addressConfig || (addressConfig && addressConfig.telephone_show)) && 
                        <div className="form-row">
                            <div className={`address-field-label ${addressConfig && addressConfig.telephone_show === 'req' ? 'req' : ''}`}>{Identify.__("Phone Number")}</div> 
                            <input type="text" id='input-telephone' name='telephone' className={addressConfig && addressConfig.telephone_show === 'req' ? 'isrequired' : ''} defaultValue={addressData.telephone}></input>
                        </div>
                    }
                </div>
                <div className="col-right">
                    {
                        (!addressConfig || (addressConfig && (
                            addressConfig.street_show || 
                            addressConfig.city_show || 
                            addressConfig.region_id_show || 
                            addressConfig.zipcode_show || 
                            addressConfig.country_id_show
                        ))) ? 
                        <div className="form-row">
                            <div className="col-label">{Identify.__('Address')}</div>
                        </div>
                    :  
                        <></>
                    }

                    { (!addressConfig || (addressConfig && addressConfig.street_show)) && 
                        <div className="form-row">
                            <div className={`address-field-label ${addressConfig && addressConfig.street_show === 'req' ? 'req' : ''}`}>{Identify.__("Street Address")}</div> 
                            <input type="text" id='input-street1' name='street[0]' className={addressConfig && addressConfig.street_show === 'req' ? 'isrequired' : ''} defaultValue={addressData.street[0]}></input>
                            <input type="text" id='input-street2' name='street[1]' defaultValue={addressData.street[1]}></input>
                            <input type="text" id='input-street3' name='street[2]' defaultValue={addressData.street[2]}></input>
                        </div>
                    }

                    { (!addressConfig || (addressConfig && addressConfig.city_show)) && 
                        <div className="form-row">
                            <div className={`address-field-label ${addressConfig && addressConfig.city_show === 'req' ? 'req' : ''}`}>{Identify.__("City")}</div> 
                            <input type="text" id='input-city' name='postcode' className={addressConfig && addressConfig.city_show === 'req' ? 'isrequired' : ''} defaultValue={addressData.city}></input>
                        </div>
                    }

                    { (!addressConfig || (addressConfig && addressConfig.zipcode_show)) && 
                        <div className="form-row">
                            <div className={`address-field-label ${addressConfig && addressConfig.zipcode_show === 'req' ? 'req' : ''}`}>{Identify.__("Zip/Postal Code")}</div> 
                            <input type="text" id='input-postcode' name='postcode' className={addressConfig && addressConfig.zipcode_show === 'req' ? 'isrequired' : ''} defaultValue={addressData.postcode}></input>
                        </div>
                    }

                    { (!addressConfig || (addressConfig && addressConfig.country_id_show)) && 
                        <div className="form-row">
                            <div className={`address-field-label ${addressConfig && addressConfig.country_id_show === 'req' ? 'req' : ''}`}>{Identify.__("Country")}</div> 
                            <select
                                name="country_id"
                                key={addressConfig && addressConfig.country_id_default || addressData.country_id /*change key to change initial value*/}
                                defaultValue={initialCountry}
                                onChange={() => onHandleSelectCountry()} onBlur={() => onHandleSelectCountry()}
                                className={addressConfig && addressConfig.country_id_show === 'req' ? 'isrequired' : ''}
                            >   
                                <option key='pls-select' value="">{Identify.__('Please choose')}</option>
                                {
                                    countries.map((country, index) => {
                                        return country.full_name_locale?<option key={index} value={country.id}>{country.full_name_locale}</option>:''
                                    })
                                }
                            </select>
                        </div>
                    }

                    { (!addressConfig || (addressConfig && addressConfig.region_id_show)) && 
                        renderRegionField(selectedCountry, initialCountry, countries, addressConfig, addressData)
                    }

                    <div className="form-row">
                        <div className="checkbox">
                            <Checkbox id="checkbox-billing" field="default_billing" initialValue={addressData.default_billing} />
                            <label htmlFor="checkbox-billing">{Identify.__('Use as my default billing address')}</label>
                        </div>
                        <div className="checkbox">
                            <Checkbox id="checkbox-shipping" field="default_shipping" initialValue={addressData.default_shipping} />
                            <label htmlFor="checkbox-shipping">{Identify.__('Use as my default shipping address')}</label>
                        </div>
                    </div>
                </div>
                <div className="form-button">
                    <SimiMutation mutation={CUSTOMER_MUTATION}>
                        {(mutationCallback, { data }) => {
                            if (data) {
                                if (addressData.id) {
                                    var addressResult = data.updateCustomerAddress;
                                } else {
                                    var addressResult = data.createCustomerAddress;
                                }
                                props.dispatchEdit({changeType: addressData.addressType, changeData: addressResult});
                            }
                            return (
                                <>
                                    <div className={'btn '+"btn"+' '+"save-address"}>
                                        <button onClick={(e) => handleSubmit(e, mutationCallback)}>
                                            <span>{Identify.__('Save Address')}</span>
                                        </button>
                                    </div>
                                    {(data === undefined && loading) && <Loading />}
                                </>
                            );
                        }}
                    </SimiMutation>
                </div>
            </form>
        </div>
    );
}

const mapStateToProps = ({ user }) => {
    const { currentUser } = user
    return {
        user: currentUser
    };
}

export default connect(
    mapStateToProps
)(Edit);
