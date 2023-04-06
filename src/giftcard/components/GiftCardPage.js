import React from "react"
import { useLocation } from "react-router-dom"

import useGiftCardData from "../talons/useGiftCardData";
import useTimezoneData from "../talons/useTimezoneData";
import useStoreConfig from "../talons/useStoreConfig";
import GiftCardInfo from "./GiftCardInfo"
import GiftCardReview from "./GiftCardReview"
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { FormattedMessage } from "react-intl";

function GiftCardPage() {
    const location = useLocation();
    const pathName = location.pathname
    const urlKey = pathName.slice(10,pathName.length-5)
 
    const giftCardDetails = useGiftCardData(urlKey)
    const timezoneDetails = useTimezoneData()
    const storeConfig = useStoreConfig()
    
    if(giftCardDetails.loading) return fullPageLoadingIndicator
    if(giftCardDetails.error) return <p>
        <FormattedMessage id={`Error! ${giftCardDetails.error.message}`} 
        defaultMessage={`Error! ${giftCardDetails.error.message}`}></FormattedMessage>
        </p>
    if(timezoneDetails.loading) return fullPageLoadingIndicator
    if(timezoneDetails.error) return <p>
        <FormattedMessage id={`Error! ${timezoneDetails.error.message}`}
        defaultMessage={`Error! ${timezoneDetails.error.message}`}></FormattedMessage>
        </p>
    if(storeConfig.loading) return fullPageLoadingIndicator
    if(storeConfig.error) return <p>
        <FormattedMessage id={`Error! ${storeConfig.error.message}`} 
        defaultMessage={`Error! ${storeConfig.error.message}`}></FormattedMessage>
        </p>
    
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
