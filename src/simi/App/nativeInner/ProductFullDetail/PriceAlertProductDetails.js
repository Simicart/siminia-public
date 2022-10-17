import React from "react";
import {useProductAlertSubscription} from "../talons/useProductAlertSubscription";
import Loader from "../Loader";
import { useIntl } from "react-intl";


const PriceAlertProductDetails = (props) => {
    const productSku = props ? props.sku : null;
    const setMessage = props ? props.setMessage : null
    const setMessageType = props ? props.setMessageType : null
    const setPopUpData = props ? props.setPopUpData : null
    const setShowPopup = props ? props.setShowPopup : null
    const { formatMessage } = useIntl();


    const {
        addPriceDropNotificationSubscription,
        addStockNotificationSubscription,
        shouldShowPriceSubscription,
        shouldShowStockSubscription,
        print,
        isGlobalLoading
    } = useProductAlertSubscription({
        sku: productSku,
        setMessage: setMessage,
        setMessageType: setMessageType,
        setPopUpData: setPopUpData,
        setShowPopup: setShowPopup
    });


    return (
        <>
            {shouldShowPriceSubscription && (
                <div style={{
                    paddingTop: 8,
                    paddingLeft: 25
                }}>
                    <a style={{
                        fontFamily: "Open Sans, 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: 16,
                        color: '#006bb4',
                        fontWeight: 400
                    }}
                       title=  {formatMessage({
                        id: 'Notify me when the price drops',
                        defaultMessage:'Notify me when the price drops'
                    })}
                       onClick={addPriceDropNotificationSubscription}
                    >
                        {formatMessage({
                        id: 'Notify me when the price drops',
                        defaultMessage:'Notify me when the price drops'
                    })}
                        
                    </a>

                </div>
            )}

            {shouldShowStockSubscription && (
                <div style={{
                    paddingTop: 8
                }}>
                    <a style={{
                        fontFamily: "Open Sans, 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: 16,
                        color: '#006bb4',
                        fontWeight: 400
                    }}
                       title={'Notify me when the prices drops'}
                       onClick={addStockNotificationSubscription}
                    >
                         {formatMessage({
                        id: 'Notify me when the price drops',
                        defaultMessage:'Notify me when the price drops'
                    })}
                    </a>
                </div>
            )}
            {!!isGlobalLoading && (<div style={{
                position: 'fixed', /* Stay in place */
                zIndex: 10, /* Sit on top */
                left: 0,
                top: 0,
                width: '100%', /* Full width */
                height: '100%', /* Full height */
                overflow: 'auto', /* Enable scroll if needed */
                backgroundColor: '#33333365', /* Fallback color */
            }}>
                <Loader />
            </div>)}
            {/*{!!print && <p>{print ? print : 'oh no'}</p>}*/}
        </>
    )
}

export {PriceAlertProductDetails}