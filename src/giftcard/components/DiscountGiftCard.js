import React, { useState, useContext } from "react"
import '../styles/styles.scss'
import { ChevronDown, ChevronUp } from "react-feather"
import { useOrderedGiftCards, GET_ORDERED_GIFT_CARDS } from '../talons/useOrderedGiftCards'
import { useOrderedGiftCardId, GET_ORDERED_GIFT_CARD_ID } from '../talons/useOrderedGiftCardId'
import { GiftCodeCheckoutContext } from '../../simi/App/nativeInner/Checkout/checkoutPage'
import { GiftCodeCartContext } from "../../simi/App/nativeInner/CartCore/cartPage"
import { useLazyQuery } from "@apollo/client"

const DiscountGiftCard = ({ location }) => {
    let giftCodeData = null
    let setGiftCodeData = null
    if (location === 'cart') {
        giftCodeData = useContext(GiftCodeCartContext).giftCodeData
        setGiftCodeData = useContext(GiftCodeCartContext).setGiftCodeData
    }
    if (location === 'checkout') {
        giftCodeData = useContext(GiftCodeCheckoutContext).giftCodeData
        setGiftCodeData = useContext(GiftCodeCheckoutContext).setGiftCodeData
    }

    const customerToken = JSON.parse(localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__signin_token'))?.value
    const base_url = window.location.origin
    const [expand, setExpand] = useState(false)
    const [giftCode, setGiftCode] = useState('')
    const [applyId, setApplyId] = useState()
    const [giftCodeError, setGiftCodeError] = useState(false)
    const [matchCode, setMatchCode] = useState()
    const myGiftCards = useOrderedGiftCards()
    const orderGiftCardId = useOrderedGiftCardId()
    const [applyButtonTitle, setApplyButtonTitle] = useState('APPLY')

    if (myGiftCards.loading) return <></>
    if (myGiftCards.error) return <p>{`Error! ${myGiftCards.error.message}`}</p>
    if (orderGiftCardId.loading) return <></>
    if (orderGiftCardId.error) return <p>{`Error! ${orderGiftCardId.error.message}`}</p>

    const handleCodeChange = (e) => {
        setGiftCode(e.target.value)
    }

    async function applyGiftCode(giftCardCode) {
        const response = await fetch(`${base_url}/rest/V1/bssGiftCard/mine/apply/${giftCardCode}`, {
            method: 'PUT',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken.slice(1, customerToken.length - 1)}`
            },
        });
        return response.json();
    }

    async function removeGiftCode(giftCodeId) {
        const response = await fetch(`${base_url}/rest/V1/bssGiftCard/mine/remove/${giftCodeId}`, {
            method: 'DELETE',
            cache: 'no-cache',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customerToken.slice(1, customerToken.length - 1)}`
            },
        });
        return response.json();
    }

    const handleAddGiftCode = () => {
        setApplyButtonTitle('APPLYING...')
        const orderedGiftCard = myGiftCards.data.bssCustomerGiftCards.filter((element) => {
            let result = false
            for (let i = 0; i < orderGiftCardId.data.customerOrders.items.length; i++) {
                if (element.order_id.toString() === orderGiftCardId.data.customerOrders.items[i].id) result = true
            }
            return result
        })

        const matchCode = orderedGiftCard.find((element) => element.code === giftCode)
        if (matchCode) {
            applyGiftCode(matchCode.code).then((data) => {
                if(data[0]?.id) {
                    setGiftCodeError('')
                    setMatchCode(matchCode)
                    setGiftCodeData(matchCode)
                    setApplyId(data[0].id)
                    setApplyButtonTitle('APPLY')
                }
                if(data?.message) {
                    setGiftCodeError('You have already apply this gift card code.')
                    setMatchCode()
                    setGiftCodeData()
                    setApplyButtonTitle('APPLY')
                }
            })
        }
        else {
            setMatchCode()
            setGiftCodeError(`The gift code isn't valid. Verify the code and try again.`)
            setApplyButtonTitle('APPLY')
        }
    }

    const handleRemoveGiftCode = () => {
        setGiftCode('')
        setMatchCode()
        setGiftCodeData()
        removeGiftCode(applyId)
    }

    return (
        <>
            <div className="discount-gift-card-wrapper">
                <div className="discount-gift-card-header" onClick={() => setExpand(prev => !prev)}>
                    <div>
                        <h1 className="discount-gift-card-title">Enter Gift Card Code</h1>
                    </div>
                    <div>
                        {expand ? (<ChevronUp></ChevronUp>) : (<ChevronDown></ChevronDown>)}
                    </div>
                </div>
                {expand && (<div>
                    <p style={{ fontSize: 14, marginTop: 40, marginBottom: 6 }}>Gift Card Code</p>
                    <div className="discount-gift-card-input-wrapper">
                        <div style={{ flexGrow: 1 }}>
                            <input style={{ width: '100%', height: 50, paddingLeft: 15 }} placeholder="Enter code" onChange={handleCodeChange} value={giftCode}></input>
                            {giftCodeError.length > 0 && (<p style={{ fontSize: 14, marginTop: 10, color: 'red' }}>{giftCodeError}</p>)}
                        </div>
                        <div>
                            <button className='discount-gift-card-apply-button' onClick={handleAddGiftCode}>{applyButtonTitle}</button>
                        </div>
                    </div>
                </div>)}
                {matchCode && (
                    <>
                        <div className="discount-gift-card-info">
                            <p>Code:</p>
                            <p>{matchCode.code}</p>
                        </div>
                        <div className="discount-gift-card-info">
                            <p>Value:</p>
                            <p>{`$${matchCode.value}.00`}</p>
                        </div>
                        <div className="discount-gift-card-info">
                            <p>Status:</p>
                            <p>{matchCode.status.label}</p>
                        </div>
                        <div className="discount-gift-card-info">
                            <p>Expire date:</p>
                            <p>{matchCode.expire_date}</p>
                        </div>
                        <div>
                            <button className='discount-gift-card-remove-button' onClick={handleRemoveGiftCode}>REMOVE</button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default DiscountGiftCard