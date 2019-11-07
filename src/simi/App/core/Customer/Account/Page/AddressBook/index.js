import React, { useState, useEffect, useCallback, useReducer } from 'react';
// import { object } from 'prop-types';
import classify from 'src/classify';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Loading from "src/simi/BaseComponents/Loading";
import { simiUseQuery, SimiMutation } from 'src/simi/Network/Query';
import CUSTOMER_ADDRESS from 'src/simi/queries/customerAddress.graphql';
import CUSTOMER_ADDRESS_DELETE from 'src/simi/queries/customerAddressDelete.graphql';
// import GET_COUNTRIES from 'src/simi/queries/getCountries.graphql';
import List from './list';
import Edit from './edit';
import defaultClasses from './style.scss';
import { withRouter } from 'react-router-dom';

const AddressBook = props => {
    
    const {user, history} = props;
    
    const [queryResult, queryApi] = simiUseQuery(CUSTOMER_ADDRESS, false);
    const { data } = queryResult;
    const { runQuery } = queryApi;
    const { customer, countries } = data || {};
    const { simiStoreConfig } = Identify.getStoreConfig();
    const storeConfig = simiStoreConfig && simiStoreConfig.config ? simiStoreConfig.config : {};
    const { address_fields_config, address_option } = storeConfig.customer ? storeConfig.customer : {};
    const addressConfig = address_fields_config;
    
    const { addresses } = customer || {};
    // const [queryResultCountries, queryApiCountries] = simiUseQuery(GET_COUNTRIES, true);
    // const dataCountries = queryResultCountries.data;
    // const runQueryCountries = queryApiCountries.runQuery;

    const getAddresses = () => {
        runQuery({});
    }

    const [ addressesState, setAddressesState ] = useState(addresses);

    var [ addressEditing, setAddressEditing ] = useState(null);
    
    var defaultBilling = {};
    var defaultShipping = {};
    var addressList = []; //other address list

    var defaultBillingCountry = {}
    var defaultShippingCountry = {}
    for (var idx in countries) {
        if (countries[idx].id === defaultBilling.country_id) {
            defaultBillingCountry = countries[idx];
        }
        if (countries[idx].id === defaultShipping.country_id) {
            defaultShippingCountry = countries[idx];
        }
    }

    // create a reducer to use hook to rerender page after save changed
    const reducerEdit = (state, action) => {
        var newAddressesState = state.addresses;
        var addressEditingReducer = null;
        switch(action.changeType){
            case 'initial':
                newAddressesState = action.initialAddresses;
                //edit address when passing from dashboard or other page, it is addressEditing when redirecting from location
                if (history && history.location && history.location.state && history.location.state.addressEditing) {
                    addressEditingReducer = history.location.state.addressEditing;
                    addressEditingReducer.addressType = 'history'; // pass this value to edit form
                }
                break;

            case 'history':
                    history.push('/account.html');
                    break;
                    
            case 'billing':
                // defaultBilling = action.changeData;
                break;
            case 'shipping':
                // defaultShipping = action.changeData;
                break;
            
            case 'new':
                if (action.changeData.id) {
                    newAddressesState.push(action.changeData);
                }
                break;
            
            case 'edit':
                if (action.addressData) {
                    addressEditingReducer = action.addressData;
                }
                break;

            case 'other':
                break;
            case 'delete':
                if (action.id) {
                    for(var i=0; i < newAddressesState.length; i++){
                        if (newAddressesState[i].id === action.id) {
                            newAddressesState.splice(i, 1); //delete item
                        }
                    }
                }
                break;
            default:
                break;
        }
        //update addresses
        if (action.changeType === 'billing' || action.changeType === 'shipping' || action.changeType === 'other') {
            for(var i in newAddressesState){
                if (action.changeData) {
                    if (newAddressesState[i].id === action.changeData.id) {
                        newAddressesState[i] = action.changeData;
                    }
                    // set other address to no default billing
                    if (newAddressesState[i].id !== action.changeData.id && action.changeData.default_billing) {
                        newAddressesState[i].default_billing = false;
                    }
                    // set other address to no default shipping
                    if (newAddressesState[i].id !== action.changeData.id && action.changeData.default_shipping) {
                        newAddressesState[i].default_shipping = false;
                    }
                }
            }
        }
        // setAddressEditing(null);
        return {...state, addresses: newAddressesState, addressEditing: addressEditingReducer, };
    }
    const memoizedReducer = useCallback((...args) => {
        return reducerEdit(...args);
    }, [addressesState]);
    //use reducer when change data from edit form
    const [state, dispatch] = useReducer(memoizedReducer, {addresses: addressesState, addressEditing: addressEditing});

    //use effect hook to call data from server
    useEffect(() => {
        if(!data) {
            getAddresses()
        };
        if (addresses) {
            setAddressesState(addresses);
            dispatch({changeType: 'initial', initialAddresses: addresses}); //dispatch change addressesState
        }
    }, [data]);

    // now addressEditing controlled by reducer
    addressEditing = state.addressEditing;

    // re-render data after reducer call
    if (state.addresses) {
        for (var i in state.addresses) {
            if (state.addresses[i].default_billing) {
                defaultBilling = state.addresses[i];
            }
            if (state.addresses[i].default_shipping) {
                defaultShipping = state.addresses[i];
            }
            if (!state.addresses[i].default_billing && !state.addresses[i].default_shipping) {
                var item = state.addresses[i];
                // get country
                var country = {}
                for (var idx in countries) {
                    if (countries[idx].id === item.country_id) {
                        country = countries[idx];
                        break;
                    }
                }
                if (item.region) {
                    item.region_code = item.region.region_code || null
                }
                item.country = country.full_name_locale
                addressList.push(item)
            }
        }
    }

    //add new address
    const addNewAddress = () => {
        // setAddressEditing({
        //     addressType: 'new',
        //     street: ['', '', ''], 
        //     region: {region: null, region_id: null, region_code: null},
        //     default_billing: false, 
        //     default_shipping: false
        // });
        // dispatch edit address
        dispatch({changeType: 'edit', addressData: {
            addressType: 'new',
            street: ['', '', ''], 
            region: {region: null, region_id: null, region_code: null},
            default_billing: false, 
            default_shipping: false
        }}); 
    }

    //id - address id
    const editDefaultAddressHandle = (e, id, addressType) => {
        e.preventDefault();
        if (addressType === 'billing') {
            var address = defaultBilling;
        }
        if (addressType === 'shipping') {
            var address = defaultShipping;
        }
        address.addressType = addressType;
        // setAddressEditing(address);
        // dispatch edit address
        dispatch({changeType: 'edit', addressData: address});
        return e;
    }

    //id - is index of items array
    const editAddressOther = (id) => {
        let address = null;
        for(var i in addressList){
            if (addressList[i].id === id) {
                address = addressList[i];
                address.addressType = 'other';
                break;
            }
        }
        // setAddressEditing(address);
        // dispatch edit address
        dispatch({changeType: 'edit', addressData: address});
    }

    const deleteAddressOther = (id) => {
        dispatch({changeType: 'delete', id: id});
    }

    const renderDefaultAddress = () => {
        if ( !defaultBilling.id && !defaultShipping.id ) {
            return <div>{Identify.__("No default billing/shipping address selected.")}</div>
        }
        return (
            <div className="address-content">
                { defaultBilling.id &&
                    <div className="billing-address">
                        <span className="box-title">{Identify.__("Default Billing Address")}</span>
                        <div className="box-content">
                            <address>
                                {defaultBilling.firstname} {defaultBilling.lastname}<br/>
                                {(!addressConfig || addressConfig && addressConfig.street_show) && defaultBilling.street ? 
                                    <>{defaultBilling.street.map((address, index) => {
                                    return <React.Fragment key={index}>{address}<br/></React.Fragment>;
                                })}</> : ''}
                                {(!addressConfig || addressConfig && addressConfig.zipcode_show) && defaultBilling.postcode ? <>{defaultBilling.postcode}, </> : ''}
                                {(!addressConfig || addressConfig && addressConfig.city_show) && defaultBilling.city ? <>{defaultBilling.city}, </>: ''}
                                {(!addressConfig || addressConfig && addressConfig.region_id_show) && defaultBilling.region ? <>{defaultBilling.region.region_code}<br/></>: ''}
                                {(!addressConfig || addressConfig && addressConfig.country_id_show) && defaultBillingCountry.full_name_locale ? <>{defaultBillingCountry.full_name_locale}<br/></> : ''}
                                {(!addressConfig || addressConfig && addressConfig.telephone_show) && defaultBilling.telephone && 
                                    <>
                                        T: <a href={"tel:"+defaultBilling.telephone}>{defaultBilling.telephone}</a>
                                    </>
                                }
                            </address>
                        </div>
                        <div className="box-action">
                            <a href="" onClick={e => editDefaultAddressHandle(e, defaultBilling.id, 'billing')}><span>{Identify.__("Change Billing Address")}</span></a>
                        </div>
                    </div>
                }
                { defaultShipping.id &&
                    <div className="shipping-address">
                        <span className="box-title">{Identify.__("Default Shipping Address")}</span>
                        <div className="box-content">
                            <address>
                                {defaultShipping.firstname} {defaultShipping.lastname}<br/>
                                {(!addressConfig || addressConfig && addressConfig.street_show) && defaultShipping.street ? 
                                    <>{defaultShipping.street.map((address, index) => {
                                        return <React.Fragment key={index}>{address}<br/></React.Fragment>;
                                })}</> : ''}
                                {(!addressConfig || addressConfig && addressConfig.zipcode_show) && defaultShipping.postcode ? <>{defaultShipping.postcode}, </> : ''}
                                {(!addressConfig || addressConfig && addressConfig.city_show) && defaultShipping.city ? <>{defaultShipping.city}, </>: ''}
                                {(!addressConfig || addressConfig && addressConfig.region_id_show) && defaultShipping.region ? <>{defaultShipping.region.region_code}<br/></>: ''}
                                {(!addressConfig || addressConfig && addressConfig.country_id_show) && defaultShippingCountry.full_name_locale ? <>{defaultShippingCountry.full_name_locale}<br/></> : ''}
                                {(!addressConfig || addressConfig && addressConfig.telephone_show) && defaultShipping.telephone && 
                                    <>
                                        T: <a href={"tel:"+defaultShipping.telephone}>{defaultShipping.telephone}</a>
                                    </>
                                }
                            </address>
                        </div>
                        <div className="box-action">
                            <a href="" onClick={e => editDefaultAddressHandle(e, defaultShipping.id, 'shipping')}><span>{Identify.__("Change Shipping Address")}</span></a>
                        </div>
                    </div>
                }
            </div>
        )
    }

    return (
        <div className="address-book">
            {addressEditing ? 
                <Edit dispatchEdit={dispatch} addressData={addressEditing} countries={countries}
                    address_fields_config={addressConfig} address_option={address_option}
                    user={user}/>
            :
            <>
                {TitleHelper.renderMetaHeader({title:Identify.__('Address Book')})}
                <h1>{Identify.__("Address Book")}</h1>
                <div className='default-address'>
                    <div className="address-label">{Identify.__("Default Addresses")}</div>
                    {data ? renderDefaultAddress() : <Loading />}
                </div>
                <div className="additional-address">
                    <div className="address-label">{Identify.__("Additional Address Entries")}</div>
                    {data ? 
                        <SimiMutation mutation={CUSTOMER_ADDRESS_DELETE}>
                            {(mutaionCallback, { }) => {
                                return <List items={addressList} editAddress={editAddressOther} 
                                    address_fields_config={addressConfig} address_option={address_option}
                                    mutaionCallback={mutaionCallback} dispatchDelete={deleteAddressOther}/>
                            }}
                        </SimiMutation>
                    : 
                    <Loading />
                    }
                </div>
                
                <div className={"btn" + ' btn ' + "add-new-address"}>
                    <button onClick={addNewAddress}><span>{Identify.__("Add New Address")}</span></button>
                </div>
            </>
            }
        </div>
    );
}

const mapStateToProps = ({ user }) => {
    const { currentUser } = user
    return {
        user: currentUser
    };
}

export default compose(
    classify(defaultClasses),
    withRouter,
    connect(
        mapStateToProps
    )
)(AddressBook);
