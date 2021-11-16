import React, { useMemo, useCallback } from 'react';
import Radio from 'src/simi/BaseComponents/Icon/Radio'
import RadioChecked from 'src/simi/BaseComponents/Icon/RadioChecked'
import { HOPrice as Price } from 'src/simi/Helper/Pricing'
import { useShippingForm } from 'src/simi/talons/CartPage/Estimate/useShippingForm'
import shippingMethodOperations from 'src/simi/App/core/Checkout/ShippingMethod/shippingMethod.gql';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading';

require('./ShippingForm.scss')

const ShippingForm = () => {
    const talonsProps = useShippingForm({
        setPageIsUpdating: useCallback((updating) => {
            if (updating)
                showFogLoading()
            else
                hideFogLoading()
        }, []),
        ...shippingMethodOperations
    })
    const { shippingMethod, availableShippingMethods, submitShippingMethod } = talonsProps
    const handleSubmitShippingMethod = useCallback((data) => {
        submitShippingMethod(data)
    }, [submitShippingMethod])

    return useMemo(() => {
        if (availableShippingMethods && availableShippingMethods.length) {
            const carriers = {}
            const carriersName = {}
            availableShippingMethods.map((availableShippingMethod, index) => {
                const { carrier_code, method_title, carrier_title, method_code, amount, code } = availableShippingMethod
                if (!carriers[carrier_code])
                    carriers[carrier_code] = []
                carriersName[carrier_code] = carrier_title
                const isSelected = (shippingMethod.carrier_code === carrier_code) && (shippingMethod.method_code === method_code);
                carriers[carrier_code].push(
                    <div
                        role="presentation"
                        className="shipping-method" key={index}
                        onClick={
                            () => {
                                handleSubmitShippingMethod([carrier_code, method_code])
                            }
                        }
                    >
                        <span className="radio-btn">
                            {isSelected ? <RadioChecked /> : <Radio />}
                        </span>
                        <span className="radio-title">
                            {carrier_title} - {method_title} {(amount && amount.value) && <Price value={amount.value} />}
                        </span>
                    </div>
                )
            })
            return (
                <div className="shipping-form">
                    {
                        Object.keys(carriers).map((key) => {
                            return (
                                <div className="shipping-form-carrier" key={key}>
                                    <div className="carrier-title">{carriersName[key]}</div>
                                    {carriers[key]}
                                </div>
                            )
                        })
                    }
                </div>

            )
        }
        return ''
    }, [shippingMethod, availableShippingMethods, handleSubmitShippingMethod])
}

export default ShippingForm
