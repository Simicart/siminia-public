import React, {useCallback, useEffect, useState} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useUserContext} from '@magento/peregrine/lib/context/user';


const addPriceSubCustomerMutation = gql`
mutation($sku: String!){
  MpProductAlertCustomerNotifyPriceDrops(input: {productSku: $sku}){
    customer_email
  }
}
`

const addPriceSubGuestMutation = gql`
mutation($email: String!, $sku: String!){
  MpProductAlertNotifyPriceDrops(input: {email:$email, productSku: $sku}){
    customer_email
  }
}`

const addStockSubCustomerMutation = gql`
mutation($sku: String!){
  MpProductAlertCustomerNotifyInStock(input: {productSku: $sku}){
    customer_email
  }
}
`

const addStockSubGuestMutation = gql`
mutation($email: String!, $sku: String!){
  MpProductAlertNotifyInStock(input: {
    email: $email,
    productSku: $sku
  }){
    customer_email
  }
}`


const productAlertConfigQuery = gql`
query($sku: String!){
  products(filter: {sku: {eq: $sku}}){
    items{
      mp_productalerts_price_alert
      mp_productalerts_stock_notify
      stock_status
    }
  }
}`

const generalAlertConfig = gql`
query{
  MpProductAlertsConfigs{
    general{
      custom_css
    }
    price_alert{
      subscribed_text
      popup_setting{
        button_text
        place_holder
        description
        footer_content
        heading_text
      }
    }
    stock_alert{
      button_text
      show_listing_page
      subscribed_text
      popup_setting{
        button_text
        description
        footer_content
        heading_text
        place_holder
      }
    }
  }
}`


export const useProductAlertSubscription = (props) => {
    const sku = props ? props.sku : null;
    const setMessage = props ? props.setMessage : () => {
    }
    const setMessageType = props ? props.setMessageType : () => {
    }
    const setPopUpData = props ? props.setPopUpData : () => {
    }
    const setShowPopup = props ? props.setShowPopup : () => {
    }

    const [{isSignedIn}] = useUserContext();

    // when log in while a message exist
    useEffect(() => {
        if (isSignedIn) {
            setMessage(null)
        }
    }, [isSignedIn])

    const [addPriceDropNotificationSignedIn,
        {
            data: priceSubCustomerData,
            loading: priceSubCustomerLoading,
            error: priceSubCustomerError
        }
    ] = useMutation(addPriceSubCustomerMutation,
        {
            variables: {
                sku: sku
            },
        }
    )

    const [addPriceDropNotificationGuest,
        {
            data: priceSubGuestData,
            loading: priceSubGuestLoading,
            error: priceSubGuestError
        }
    ] = useMutation(addPriceSubGuestMutation)

    const [addStockSubscriptionSignIn, {
        data: stockSubCustomerData,
        loading: stockSubCustomerLoading,
        error: stockSubCustomerError
    }] = useMutation(addStockSubCustomerMutation, {
        variables: {
            sku: sku
        }
    })

    const [addStockSubscriptionGuest, {
        data: stockSubGuestData,
        loading: stockSubGuestLoading,
        error: stockSubGuestError
    }] = useMutation(addStockSubGuestMutation)


    const {data: configData, loading: loadingConfig, error: errorConfig} = useQuery(productAlertConfigQuery, {
        variables: {
            sku: sku
        },
    })

    const {data: priceAlertData, loading: priceAlertLoading, error: priceAlertError} = useQuery(generalAlertConfig)

    const [isGlobalLoading, setGlobalLoading] = useState(false)


    const addPriceDropNotificationSubscription = () => {
        setMessage(null)
        setMessageType(null)
        if (isSignedIn) {
            setGlobalLoading(true)
            return addPriceDropNotificationSignedIn()
                .then(data => {
                    // console.warn(JSON.stringify(data, null, 2))
                    setMessage(priceAlertData.MpProductAlertsConfigs.price_alert.subscribed_text)
                    setMessageType('Success')
                    setGlobalLoading(false)
                })
                .catch(err => {
                    // console.warn(JSON.stringify(err, null, 2))
                    setMessage('You have already subscribed.')
                    setMessageType('Failure')
                    setGlobalLoading(false)
                })
        } else if (priceAlertData) {
            setPopUpData({
                ...priceAlertData.MpProductAlertsConfigs.price_alert.popup_setting,
                callback: async (email) => {
                    setGlobalLoading(true)
                    return addPriceDropNotificationGuest({variables: {email: email, sku: sku}})
                        .then(data => {
                            // console.warn(JSON.stringify(data, null, 2))
                            setMessage(priceAlertData.MpProductAlertsConfigs.price_alert.subscribed_text)
                            setMessageType('Success')
                            setGlobalLoading(false)
                        })
                        .catch(err => {
                            // console.warn(JSON.stringify(err, null, 2))
                            setMessage('You have already subscribed.')
                            setMessageType('Failure')
                            setGlobalLoading(false)
                        })
                }
            })
            setShowPopup(true)
        }
    }

    const addStockNotificationSubscription = () => {
        setMessage(null)
        setMessageType(null)
        if (isSignedIn) {
            setGlobalLoading(true)
            return addStockSubscriptionSignIn()
                .then(data => {
                    // console.warn(JSON.stringify(data, null, 2))
                    setMessage(priceAlertData.MpProductAlertsConfigs.stock_alert.subscribed_text)
                    setMessageType('Success')
                    setGlobalLoading(false)
                })
                .catch(err => {
                    // console.warn(JSON.stringify(err, null, 2))
                    setMessage('You have already subscribed.')
                    setMessageType('Failure')
                    setGlobalLoading(false)
                })
        } else if (priceAlertData) {
            setPopUpData({
                ...priceAlertData.MpProductAlertsConfigs.stock_alert.popup_setting,
                callback: async (email) => {
                    setGlobalLoading(true)
                    return addStockSubscriptionGuest({variables: {email: email, sku: sku}})
                        .then(data => {
                            // console.warn(JSON.stringify(data, null, 2))
                            setMessage(priceAlertData.MpProductAlertsConfigs.stock_alert.subscribed_text)
                            setMessageType('Success')
                            setGlobalLoading(false)
                        })
                        .catch(err => {
                            // console.warn(JSON.stringify(err, null, 2))
                            setMessage('You have already subscribed.')
                            setMessageType('Failure')
                            setGlobalLoading(false)
                        })
                }
            })
            setShowPopup(true)
        }
    }


    const shouldShowPriceSubscription = (
        (!!configData) && !errorConfig
        && configData && (configData.products.items[0]['mp_productalerts_price_alert'] !== '0')
    )

    const shouldShowStockSubscription = (
        (!!configData) && !errorConfig
        && configData && (configData.products.items[0]['mp_productalerts_stock_notify'] !== '0')
        && configData.products.items[0]['stock_status'] === 'OUT_OF_STOCK'
    )

    return {
        addPriceDropNotificationSubscription: addPriceDropNotificationSubscription,
        addStockNotificationSubscription: addStockNotificationSubscription,
        shouldShowPriceSubscription: shouldShowPriceSubscription,
        shouldShowStockSubscription: shouldShowStockSubscription,
        print: JSON.stringify(configData ? configData : 'no'),
        isGlobalLoading: isGlobalLoading
    }
}