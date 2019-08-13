import React from 'react';
import { connect } from 'src/drivers';
import { Form, Text, BasicText, BasicSelect, Checkbox, Option, useFieldState, asField } from 'informed';
import Identify from 'src/simi/Helper/Identify';
import {validateEmpty} from 'src/simi/Helper/Validation';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Loading from "src/simi/BaseComponents/Loading";
import { SimiMutation } from 'src/simi/Network/Query';
import CUSTOMER_ADDRESS_UPDATE from 'src/simi/queries/customerAddressUpdate.graphql';
import CUSTOMER_ADDRESS_CREATE from 'src/simi/queries/customerAddressCreate.graphql';

const SimiText = asField(({ fieldState, ...props }) => (
    <React.Fragment>
      <BasicText
        fieldState={fieldState}
        {...props}
        style={fieldState.error ? { border: 'solid 1px red', color: 'red' } : null}
      />
      {fieldState.error ? (<small style={{ color: 'red' }}>{fieldState.error}</small>) : null}
    </React.Fragment>
));

const SimiSelect = asField(({ fieldState, ...props }) => (
    <React.Fragment>
      <BasicSelect
        fieldState={fieldState}
        {...props}
        style={fieldState.error ? { border: 'solid 1px red' } : null}
      />
      {fieldState.error ? (<small style={{ color: 'red' }}>{fieldState.error}</small>) : null}
    </React.Fragment>
));

const Edit = props => {

    const { addressData, countries, classes, address_fields_config } = props;
    const addressConfig = address_fields_config;

    var CUSTOMER_MUTATION = CUSTOMER_ADDRESS_CREATE;
    if (addressData.id) {
        CUSTOMER_MUTATION = CUSTOMER_ADDRESS_UPDATE;
    }

    const getFormApi = (formApi) => {
        // formApi.setValue('firstname', addressData.firstname)
    }

    const validate = (value) => {
        return !validateEmpty(value) ? 'This is a required field.' : undefined;
    }

    const validateCondition = (value, opt) => {
        if (opt === 'req') {
            return !validateEmpty(value) ? 'This is a required field.' : undefined;
        }
        return undefined;
    }

    const validateStreet = (value, opt) => {
        if (opt === 'req') {
            if (typeof value === 'array') {
                for(var i in value){
                    if (!validateEmpty(value[i])) {
                        return 'This is a required field.';
                    }
                }
            } else {
                return !validateEmpty(value) ? 'This is a required field.' : undefined;
            }
        }
        return undefined;
    }

    const validateOption = (value, opt) => {
        if (opt === 'req') {
            return !value || !validateEmpty(value) ? 'Please select an option.' : undefined;
        }
        return undefined;
    }

    const formSubmit = (values) => {
        // console.log('form submited:', values)
        
    }
    
    const formChange = (formState) => {
        // console.log('form change:', formState)
    }

    const getRegionObject = (country_id, region_id) => {
        var country;
        for(var i in countries) {
            if (countries[i].id === country_id){
                country = countries[i];
                break;
            }
        }
        if (country && country.available_regions && country.available_regions.length) {
            for (var i in country.available_regions) {
                if (country.available_regions[i].id === parseInt(region_id)) {
                    return country.available_regions[i];
                }
            }
        }
        return null
    }

    var loading = false;

    const buttonSubmitHandle = (mutaionCallback, formApi) => {
        loading = true;
        var values = formApi.getValues();
        formApi.submitForm();
        if (formApi.getState().invalid) {
            loading = false;
            return null; // not submit until form has no error
        }
        if (values.region) {
            var oldRegionValue = values.region;
            var region;
            if (values.region) region = getRegionObject(values.country_id, values.region.region_id);
            if (region) {
                values.region.region = region.name;
                values.region.region_id = region.id;
                values.region.region_code = region.code;
            } else {
                values.region.region = oldRegionValue.region ? oldRegionValue.region : null;
                values.region.region_id = null;
                values.region.region_code = null;
            }
        }
        // required values
        var config = addressConfig;
        if (config) {
            if (!values.telephone) values.telephone     = config.telephone_default || 'NA';
            if (!values.street) values.street           = [config.street_default || 'NA'];
            if (!values.country_id) values.country_id   = config.country_id_default || 'US';
            if (!values.city) values.city               = config.city_default || 'NA';
            if (!values.postcode) values.postcode       = config.zipcode_default || 'NA';
        }

        values.id = addressData.id; //address id
        mutaionCallback({ variables: values });
    }

    const StateProvince = (props) => {
        const { showOption } = props;
        var countryFieldState = useFieldState('country_id');
        var country_id = countryFieldState.value;

        // get country
        var country;
        for(var i in countries) {
            if (countries[i].id === country_id){
                country = countries[i];
                break;
            }
        }
        if (country && country.available_regions && country.available_regions.length) {
            var regionValue = addressData.region.region_id;
            var required = 'opt';
            if (addressData.country_id !== country_id) {
                regionValue = null;
            }
            if (showOption !== 'opt') {
                required = 'req';
            }
            return (
                <div className={classes['state-option']}>
                    <label htmlFor="input-state">{Identify.__('State/Province')}{required === 'req' && <span>*</span>}</label>
                    <div>
                        <SimiSelect id="input-state" field="region[region_id]" initialValue={regionValue} key={regionValue} 
                            validate={(value) => validateOption(value, required)} validateOnChange >
                            <Option value="" key={-1}>{Identify.__('Please select a region, state or province.')}</Option>
                            {country.available_regions.map((region, index) => {
                                return <Option value={region.id} key={index}>{region.name}</Option>
                            })}
                        </SimiSelect>
                    </div>
                </div>
            );
        } else {
            var regionValue = addressData.region.region
            if (addressData.country_id !== country_id && country_id !== undefined) {
                regionValue = null; //reset value region field when change country
            }
            return (
                <div className={classes['state-text']}>
                    <label htmlFor="input-state">{Identify.__('State/Province')}{showOption === 'req' && <span>*</span>}</label>
                    <div>
                        <SimiText id="input-state" field="region[region]" initialValue={regionValue} 
                            validate={(value) => validateCondition(value, showOption)} validateOnChange/>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={classes['edit-address']}>
            {TitleHelper.renderMetaHeader({title: Identify.__('Edit Address')})}
            <Form id="address-form" getApi={getFormApi} onSubmit={formSubmit} onChange={formChange}>
                {({ formApi }) => (
                    <>
                    <div className={classes["col-left"]}>
                        <div className={classes["form-row"]}>
                            <div className={classes["col-label"]}>{Identify.__('Contact Information')}</div>
                        </div>
                        <div className={classes["form-row"]}>
                            <label htmlFor="input-firstname">{Identify.__('First Name')}<span>*</span></label>
                            <SimiText id="input-firstname" field="firstname" initialValue={addressData.firstname} validate={validate} validateOnBlur validateOnChange />
                        </div>
                        <div className={classes["form-row"]}>
                            <label htmlFor="input-lastname">{Identify.__('Last Name')}<span>*</span></label>
                            <SimiText id="input-lastname" field="lastname" initialValue={addressData.lastname} validate={validate} validateOnBlur validateOnChange />
                        </div>

                        { (!addressConfig || (addressConfig && addressConfig.company_show)) && 
                            <div className={classes["form-row"]}>
                                <label htmlFor="input-company">
                                    {Identify.__('Company')}
                                    {addressConfig && addressConfig.company_show === 'req' && <span>*</span>}
                                </label>
                                <SimiText id="input-company" field="company" initialValue={addressData.company} 
                                    validate={(value) => validateCondition(value, addressConfig && addressConfig.company_show || 'opt')} 
                                    validateOnBlur validateOnChange
                                />
                            </div>
                        }

                        {
                            (!addressConfig || (addressConfig && addressConfig.telephone_show)) && 
                            <div className={classes["form-row"]}>
                                <label htmlFor="input-telephone">
                                    {Identify.__('Phone Number')}
                                    {addressConfig && addressConfig.telephone_show !== 'req' ? null : <span>*</span>}
                                </label>
                                <SimiText id="input-telephone" field="telephone" initialValue={addressData.telephone} 
                                    validate={(value) => validateCondition(value, addressConfig && addressConfig.telephone_show || 'req')} 
                                    validateOnBlur validateOnChange />
                            </div>
                        }
                    </div>
                    <div className={classes["col-right"]}>
                        {
                            (!addressConfig || (addressConfig && (
                                addressConfig.street_show || 
                                addressConfig.city_show || 
                                addressConfig.region_id_show || 
                                addressConfig.zipcode_show || 
                                addressConfig.country_id_show
                            ))) ? 
                            <div className={classes["form-row"]}>
                                <div className={classes["col-label"]}>{Identify.__('Address')}</div>
                            </div>
                        :  
                            <></>
                        }

                        { (!addressConfig || (addressConfig && addressConfig.street_show)) && 
                            <div className={classes["form-row"]}>
                                <label htmlFor="input-street1">
                                    {Identify.__('Street Address')}
                                    {addressConfig && addressConfig.street_show !== 'req' ? null : <span>*</span>}
                                </label>
                                <SimiText id="input-street1" field="street[0]" initialValue={addressData.street[0]} 
                                    validate={(value) => validateStreet(value, addressConfig && addressConfig.street_show || 'req')} 
                                    validateOnBlur validateOnChange />
                                <SimiText id="input-street2" field="street[1]" initialValue={addressData.street[1]}/>
                                <SimiText id="input-street3" field="street[2]" initialValue={addressData.street[2]}/>
                            </div>
                        }

                        { (!addressConfig || (addressConfig && addressConfig.city_show)) && 
                            <div className={classes["form-row"]}>
                                <label htmlFor="input-city">
                                    {Identify.__('City')}
                                    {addressConfig && addressConfig.city_show !== 'req' ? null : <span>*</span>} 
                                </label>
                                <SimiText id="input-city" field="city" initialValue={addressData.city} 
                                    validate={(value) => validateCondition(value, addressConfig && addressConfig.city_show || 'req')} 
                                    validateOnBlur validateOnChange />
                            </div>
                        }

                        { (!addressConfig || (addressConfig && addressConfig.region_id_show)) && 
                            <div className={classes["form-row"]+' '+classes["state-province"]} id="state-province">
                                <StateProvince showOption={addressConfig && addressConfig.region_id_show || undefined } />
                            </div>
                        }

                        { (!addressConfig || (addressConfig && addressConfig.zipcode_show)) && 
                            <div className={classes["form-row"]}>
                                <label htmlFor="input-postcode">
                                    {Identify.__('Zip/Postal Code')}
                                    {addressConfig && addressConfig.zipcode_show !== 'req' ? null : <span>*</span>}
                                </label>
                                <SimiText id="input-postcode" field="postcode" initialValue={addressData.postcode} 
                                    validate={(value) => validateCondition(value, addressConfig && addressConfig.zipcode_show || 'req')} 
                                    validateOnBlur validateOnChange 
                                />
                            </div>
                        }

                        { (!addressConfig || (addressConfig && addressConfig.country_id_show)) && 
                            <div className={classes["form-row"]}>
                                <label htmlFor="input-country">
                                    {Identify.__('Country')}
                                    {addressConfig && addressConfig.country_id_show !== 'req' ? null : <span>*</span>}
                                </label>
                                <SimiSelect id="input-country" field="country_id" initialValue={addressConfig && addressConfig.country_id_default || addressData.country_id || 'US'} 
                                    validate={(value) => validateOption(value, addressConfig && addressConfig.country_id_show || 'req')} 
                                    validateOnChange
                                >
                                    { countries.map((country, index) => {
                                        return country.full_name_locale !== null ? 
                                            <Option value={country.id} key={index} >{country.full_name_locale}</Option> : null
                                    })}
                                </SimiSelect>
                            </div>
                        }


                        <div className={classes["form-row"]}>
                            <div className={classes["checkbox"]}>
                                <Checkbox id="checkbox-billing" field="default_billing" initialValue={addressData.default_billing} />
                                <label htmlFor="checkbox-billing">{Identify.__('Use as my default billing address')}</label>
                            </div>
                            <div className={classes["checkbox"]}>
                                <Checkbox id="checkbox-shipping" field="default_shipping" initialValue={addressData.default_shipping} />
                                <label htmlFor="checkbox-shipping">{Identify.__('Use as my default shipping address')}</label>
                            </div>
                        </div>
                    </div>
                    <div className={classes["form-button"]}>
                        <SimiMutation mutation={CUSTOMER_MUTATION}>
                            {(mutaionCallback, { data }) => {
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
                                        <div className={'btn '+classes["btn"]+' '+classes["save-address"]}>
                                            <button onClick={() => buttonSubmitHandle(mutaionCallback, formApi)}>
                                                <span>{Identify.__('Save Address')}</span>
                                            </button>
                                        </div>
                                        {(data === undefined && loading) && <Loading />}
                                    </>
                                );
                            }}
                        </SimiMutation>
                    </div>
                    </>
                )}
            </Form>
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
