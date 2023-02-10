import React from "react"
import { useParams } from "react-router-dom"

import useGiftCardData from "../talons/useGiftCardData";
import useTimezoneData from "../talons/useTimezoneData";
import convertParams from "../talons/convertParams";
import ProductInfo from "./ProductInfo"
import ReviewWrapper from "./ReviewWrapper"

function GiftCardPage() {
    const { giftCardName = '' } = useParams()
    const filter = convertParams(giftCardName.split('-'))
 
    const giftCardDetails = useGiftCardData(filter)
    const timezoneDetails = useTimezoneData()
    
    if(giftCardDetails.loading) return <p>Loading</p>
    if(giftCardDetails.error) return <p>{`Error! ${giftCardDetails.error.message}`}</p>
    if(timezoneDetails.loading) return <p>Loading</p>
    if(timezoneDetails.error) return <p>{`Error! ${timezoneDetails.error.message}`}</p>
    
    const giftCardData = giftCardDetails.data
    const timezoneData = timezoneDetails.data

    return (
        <>
            <ProductInfo giftCardData={giftCardData} timezoneData={timezoneData}></ProductInfo>
            <ReviewWrapper giftCardData={giftCardData}></ReviewWrapper>
        </>
    )
}

export default GiftCardPage
