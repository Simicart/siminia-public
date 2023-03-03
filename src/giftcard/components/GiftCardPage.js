import React from "react"
import { useLocation } from "react-router-dom"

import useGiftCardData from "../talons/useGiftCardData";
import useTimezoneData from "../talons/useTimezoneData";
import useStoreConfig from "../talons/useStoreConfig";
import GiftCardInfo from "./GiftCardInfo"
import GiftCardReview from "./GiftCardReview"
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

function GiftCardPage() {
    const location = useLocation();
    const pathName = location.pathname
    const urlKey = pathName.slice(10,pathName.length-5)
    const filter = location?.state?.sku || ''
 
    const giftCardDetails = useGiftCardData(urlKey)
    const timezoneDetails = useTimezoneData()
    const storeConfig = useStoreConfig()
    
    if(giftCardDetails.loading) return fullPageLoadingIndicator
    if(giftCardDetails.error) return <p>{`Error! ${giftCardDetails.error.message}`}</p>
    if(timezoneDetails.loading) return fullPageLoadingIndicator
    if(timezoneDetails.error) return <p>{`Error! ${timezoneDetails.error.message}`}</p>
    if(storeConfig.loading) return fullPageLoadingIndicator
    if(storeConfig.error) return <p>{`Error! ${storeConfig.error.message}`}</p>
    
    const giftCardData = giftCardDetails.data
    const timezoneData = timezoneDetails.data
    const storeConfigData = storeConfig.data

    return (
        <>
            <GiftCardInfo giftCardData={giftCardData} timezoneData={timezoneData} storeConfigData={storeConfigData}></GiftCardInfo>
            <GiftCardReview giftCardData={giftCardData}></GiftCardReview>
        </>
    )
}

export default GiftCardPage
