import React, { useState, useContext } from "react"
import '../styles/styles.scss'
import { ChevronDown, ChevronUp } from "react-feather"
import { useOrderedGiftCards } from '../talons/useOrderedGiftCards'
import { useOrderedGiftCardId } from '../talons/useOrderedGiftCardId'
import { GiftCodeCheckoutContext } from '../../simi/App/nativeInner/Checkout/checkoutPage'
import { GiftCodeCartContext } from "../../simi/App/nativeInner/CartCore/cartPage"
import { FormattedMessage } from "react-intl"

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
    if (myGiftCards.error) return <p>
        <FormattedMessage id={`Error! ${myGiftCards.error.message}`} defaultMessage={`Error! ${myGiftCards.error.message}`}></FormattedMessage>
        </p>
    if (orderGiftCardId.loading) return <></>
    if (orderGiftCardId.error) return <p>
        <FormattedMessage id={`Error! ${orderGiftCardId.error.message}`} defaultMessage={`Error! ${orderGiftCardId.error.message}`}></FormattedMessage>
        </p>

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
        setGiftCodeError('')
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
                if (data[0]?.id) {
                    setGiftCodeError('')
                    setMatchCode(matchCode)
                    setGiftCodeData((giftCodeData) => {
                        if (giftCodeData.length >= 0) {
                            return [...giftCodeData, matchCode]
                        }
                        else {
                            return [matchCode]
                        }
                    })
                    setApplyId(data[data.length - 1].id)
                    setApplyButtonTitle('APPLY')
                }
                if (data?.message) {
                    if(data.message.includes('incorrect')) {
                        setGiftCodeError(`${data.message.slice(0, data.message.length-12)} ${data.parameters[0]} seconds`)
                    }
                    else {
                        setGiftCodeError(data.message)
                    }
                    setMatchCode()
                    setApplyButtonTitle('APPLY')
                }
            })
        }
        else {
            applyGiftCode(giftCode).then((data) => {
                setMatchCode()
                if(data.message.includes('incorrect')) {
                    setGiftCodeError(`${data.message.slice(0, data.message.length-12)} ${data.parameters[0]} seconds`)
                }
                else {
                    setGiftCodeError(data.message)
                }
                setApplyButtonTitle('APPLY')
            }
            )
        }
    }

    const handleRemoveGiftCode = () => {
        setGiftCode('')
        setMatchCode()
        setGiftCodeData((giftCodeData) => {
            if (giftCodeData.length > 1) {
                const tmp = giftCodeData.splice(0, giftCodeData.length - 1);
                return tmp
            }
            else {
                return []
            }
        })
        removeGiftCode(applyId)
    }

    return (
        <>
            <div className="discount-gift-card-wrapper">
                <button onClick={() => setExpand(prev => !prev)} style={{width: '100%'}}>
                <div className="discount-gift-card-header" >
                    <div>
                        <h1 className="discount-gift-card-title">
                            <FormattedMessage id='Enter Gift Card Code' defaultMessage='Enter Gift Card Code'></FormattedMessage>
                        </h1>
                    </div>
                    <div>
                        {expand ? (<ChevronUp></ChevronUp>) : (<ChevronDown></ChevronDown>)}
                    </div>
                </div>
                </button>
                
                {expand && (<div>
                    <p style={{ fontSize: 14, marginTop: 40, marginBottom: 6 }}>
                        <FormattedMessage id='Gift Card Code' defaultMessage='Gift Card Code'></FormattedMessage>
                    </p>
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
                            <p><FormattedMessage id='Code' defaultMessage='Code'></FormattedMessage></p>
                            <p>{matchCode.code}</p>
                        </div>
                        <div className="discount-gift-card-info">
                            <p><FormattedMessage id='Value:' defaultMessage='Value:'></FormattedMessage></p>
                            <p>
                                <FormattedMessage id={`$${matchCode.value}.00`} defaultMessage={`$${matchCode.value}.00`}></FormattedMessage>
                            </p>
                        </div>
                        <div className="discount-gift-card-info">
                            <p><FormattedMessage id='Status:' defaultMessage='Status:'></FormattedMessage></p>
                            <p>{matchCode.status.label}</p>
                        </div>
                        <div className="discount-gift-card-info">
                            <p><FormattedMessage id='Expire Date:' defaultMessage='Expire Date:'></FormattedMessage></p>
                            <p>{matchCode.expire_date}</p>
                        </div>
                        <div>
                            <button className='discount-gift-card-remove-button' onClick={handleRemoveGiftCode}>
                                <FormattedMessage id='REMOVE' defaultMessage='REMOVE'></FormattedMessage>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default DiscountGiftCard