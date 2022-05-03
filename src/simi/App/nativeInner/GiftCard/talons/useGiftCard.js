import { useQuery, useState, useCallback } from 'react';
import { GET_GIFT_CARD_DASHBOARD_CONFIG } from './GiftCard.gql';

export const useGiftCard = props => {
    const {product} = props

    const {
        __typename,
        allow_amount_range,
        min_amount,
        max_amount,
        gift_card_type,
        gift_card_amounts,
        gift_code_pattern,
        gift_product_template,
        gift_message_available,
        mpgiftcard_conditions,
        can_redeem,
        price_rate,
        template
    } = product
    
    let amounts
    if(gift_card_amounts) amounts = JSON.parse(gift_card_amounts)
    let deli;
    switch(gift_card_type) {
        case 1: 
            deli = 1
            break;
        case 2:
            deli = 3
            break;
        case 3:
            deli = 4
            break;
    }

    const [gcAmount, setGcAmount] = useState(gift_card_amounts ? amounts[0].amount : 0)
    const [activeAmount, setActiveAmount] = useState(0)
    const [activeImage, setActiveImage] = useState(0)
    const [gcPrice, setGcPrice] = useState(gift_card_amounts ? amounts[0].price : 0)
    const [gcMessage, setGcMessage] = useState('')
    const [gcFrom, setGcFrom] = useState(null)
    const [gcTo, setGcTo] = useState(null)
    const [delivery, setDelivery] = useState(deli)
    const [activeTemplate, setActiveTemplate] = useState(0)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [uploadedImages, setUploadedImages] = useState([])
    const [uploadedImageUrls, setUploadedImageUrls] = useState([])


	return {
        giftCardActions: {
            setGcAmount,
            setActiveAmount,
            setActiveImage,
            setGcPrice,
            setGcMessage,
            setGcFrom,
            setGcTo,
            setDelivery,
            setActiveTemplate,
            setEmail,
            setPhone,
            setUploadedImages,
            setUploadedImageUrls
        },
        giftCardData: {
            gcAmount,
            activeAmount,
            activeImage,
            gcPrice,
            gcMessage,
            gcFrom,
            gcTo,
            delivery,
            activeTemplate,
            email,
            phone,
            uploadedImages,
            uploadedImageUrls
        },
        giftCardProductData: {
            __typename,
            allow_amount_range,
            min_amount,
            max_amount,
            gift_card_type,
            gift_code_pattern,
            gift_product_template,
            gift_message_available,
            mpgiftcard_conditions,
            can_redeem,
            price_rate,
            template,
            amounts,
        }
	}
}