import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag';
import Identify from 'src/simi/Helper/Identify';
import Dropdownoption from 'src/simi/BaseComponents/Dropdownoption'
import { getAllowedCountries } from 'src/simi/Helper/Countries'
import ShippingForm from './ShippingForm'
import { ShippingInformationFragment } from 'src/simi/App/core/Checkout/ShippingInformation/shippingInformationFragments.gql';
import { AvailableShippingMethodsCheckoutFragment } from 'src/simi/App/core/Checkout/ShippingMethod/shippingMethodFragments.gql';
import { PriceSummaryFragment } from '../PriceSummary/priceSummaryFragments';

import { useEstimate } from 'src/simi/talons/CartPage/Estimate/useEstimate'

require('./estimate.scss')

const Estimate = () => {
    const talonProps = useEstimate({
        queries: {
            estimateShippingMutation: ESTIMATE_SHIPPING_BASE_ON_ADDRESS
        }
    })

    const { submitShippingAddress, shippingAddress } = talonProps

    const countries = getAllowedCountries()
    let initShippingCountry = false
    const countryOptions = countries.map((country, cindex) => {
        if (shippingAddress && shippingAddress.country_id === country.id)
            initShippingCountry = country
        return (
            <li role="presentation" key={cindex} onClick={() => setSelectCountry(country)}>
                {country.full_name_locale ? country.full_name_locale : country.full_name_english}
            </li>
        )
    })

    const [selectedCountry, setSelectCountry] = useState(initShippingCountry)

    let initShippingState = ''
    let stateOptions = false
    if (selectedCountry && selectedCountry.available_regions) {
        stateOptions = selectedCountry.available_regions.map((state, rindex) => {
            if (shippingAddress && shippingAddress.region_id === state.id)
                initShippingState = state
            return (
                <li role="presentation" key={rindex} onClick={() => setSelectedState(state)}>
                    {state.name}
                </li>
            )
        })
    }
    if ((!stateOptions || !stateOptions.length) && shippingAddress && shippingAddress.region)
        initShippingState = shippingAddress.region

    const [selectedState, setSelectedState] = useState(initShippingState)
    const [usedZipcode, setUsedZipcode] = useState('')

    useEffect(() => {
        if (selectedCountry && selectedState) {
            const payLoad = {}
            if (selectedCountry) {
                payLoad.country_code = selectedCountry.id
                Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'geo_ip_got', selectedCountry)
            }
            if (selectedState) {
                if (typeof selectedState === 'string')
                    payLoad.region = selectedState
                else
                    payLoad.region = selectedState.code
            }
            
            payLoad.postcode = usedZipcode ? usedZipcode : 'postcode'
            payLoad.firstname = 'firstname'
            payLoad.lastname = 'lastname'
            payLoad.street = ['street']
            payLoad.city = 'city'
            payLoad.telephone = 'phone'
            payLoad.save_in_address_book = false
            submitShippingAddress(payLoad)
        }
    }, [selectedCountry, selectedState, usedZipcode, submitShippingAddress])
    if (!countries.length)
        return ''

    return (
        <div className="cart-estimate-shipping-tax">
            <div className="cart-estimate-title">
                {Identify.__('Estimate Shipping and Tax')}
            </div>
            <div className="cart-estimate-inner">
                <div className="estimate-field-label">{Identify.__('Country')}</div>
                <div className="estimate-field-value country-field">
                    <Dropdownoption
                        className="estimate-countries-states"
                        title={selectedCountry ?
                            selectedCountry.full_name_locale ?
                                selectedCountry.full_name_locale : selectedCountry.full_name_english :
                            Identify.__('Country')}
                        expanded={false}
                    >
                        <ul className="country-state-selection-list">
                            {countryOptions}
                        </ul>
                    </Dropdownoption>
                </div>
                <div className="estimate-field-label">{Identify.__('State/Province')}</div>
                <div className="estimate-field-value state-field">
                    {
                        (stateOptions && stateOptions.length) ? (
                            <Dropdownoption
                                className="estimate-countries-states"
                                title={selectedState ? selectedState.name :
                                    Identify.__('Please select a region, state or province.')}
                                expanded={false}
                            >
                                <ul className="country-state-selection-list">
                                    {stateOptions}
                                </ul>
                            </Dropdownoption>
                        ) : (
                                <input
                                    type="text"
                                    className="estimate-state-input"
                                    defaultValue={typeof selectedState === 'string' ? selectedState : ''}
                                    onBlur={(e) => setSelectedState(e.target.value)}
                                />
                            )
                    }
                </div>
                <div className="estimate-field-label">{Identify.__('Zip/Postal Code')}</div>
                <div className="estimate-field-value">
                    <input
                        type="text"
                        className="estimate-zipcode-input"
                        defaultValue={usedZipcode}
                        onBlur={(e) => setUsedZipcode(e.target.value)}
                    />
                </div>
            </div>
            <ShippingForm />
        </div>
    )
}

export default Estimate



export const ESTIMATE_SHIPPING_BASE_ON_ADDRESS = gql`
    mutation EsimateShippingBaseOnAddress($cartId: String!, $addressInput: CartAddressInput!) {
        setShippingAddressesOnCart(
            input: {
                cart_id: $cartId
                shipping_addresses: [{ address: $addressInput }]
            }
        ) @connection(key: "setShippingAddressesOnCart") {
            cart {
                id
                ...ShippingInformationFragment
                ...AvailableShippingMethodsCheckoutFragment
                ...PriceSummaryFragment
            }
        }
    }
    ${ShippingInformationFragment}
    ${AvailableShippingMethodsCheckoutFragment}
    ${PriceSummaryFragment}
`;
