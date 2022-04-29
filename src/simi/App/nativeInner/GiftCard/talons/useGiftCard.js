import { useQuery, useState, useCallback } from 'react';
import { GET_GIFT_CARD_DASHBOARD_CONFIG } from './GiftCard.gql';

export const useGiftCard = props => {
    const {product} = props

    const {
        allow_amount_range,
        gift_card_type,
        gift_card_amounts,
    } = product
    
    let amounts
    if(gift_card_amounts) amounts = JSON.parse(gift_card_amounts)

    let delivery;
    switch(gift_card_type) {
        case 1: 
            delivery = 1
            break;
        case 2:
            delivery = 3
            break;
        case 3:
            delivery = 4
            break;
    }

    let defaultGiftCardData = {
        amount: gift_card_amounts ? amounts[0].amount : 0,
        delivery,
        email: null,
        from: null,
        to: null,
        message: null,
        image: null,
        phone_number: null,
        range_amount: Boolean(allow_amount_range),
        template: 1 
    }

    const [giftCardData, setGiftCardData] = useState(defaultGiftCardData)
    const [gcPrice, setGcPrice] = useState(gift_card_amounts ? amounts[0].price : 0)

    const handleSaveGiftCardData = (attr, value) => {
        const newGiftCardData = {...giftCardData}
        newGiftCardData[attr] = value
        setGiftCardData(newGiftCardData)
    }

    const handleSetGcPrice = (value) => {
        setGcPrice(value)
    }

    const giftCardPreData = {
        amounts
    }
 
	return {
        gcPrice,
        giftCardPreData,
        giftCardData,
		handleSaveGiftCardData,
        handleSetGcPrice
	}
}