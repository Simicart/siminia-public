import React, { useState, useContext } from "react"
import '../styles/styles.scss'
import { ChevronDown, ChevronUp } from "react-feather"
import useOrderedGiftCards from '../talons/useOrderedGiftCards'
import useOrderedGiftCardId from '../talons/useOrderedGiftCardId'
import { GiftCodeCheckoutContext } from '../../simi/App/nativeInner/Checkout/checkoutPage'
import { GiftCodeCartContext } from "../../simi/App/nativeInner/CartCore/cartPage"

const DiscountGiftCard = ({ location }) => {
    let giftCodeData = null
    let setGiftCodeData = null
    if(location === 'cart') {
        giftCodeData = useContext(GiftCodeCartContext).giftCodeData
        setGiftCodeData = useContext(GiftCodeCartContext).setGiftCodeData
    }
    if(location === 'checkout') {
        giftCodeData = useContext(GiftCodeCheckoutContext).giftCodeData
        setGiftCodeData = useContext(GiftCodeCheckoutContext).setGiftCodeData
    }
    
    const [expand, setExpand] = useState(false)
    const [giftCode, setGiftCode] = useState('')
    const [giftCodeError, setGiftCodeError] = useState(false)
    const myGiftCards = useOrderedGiftCards()
    const orderGiftCardId = useOrderedGiftCardId()

    if (myGiftCards.loading) return <p>Loading</p>
    if (myGiftCards.error) return <p>{`Error! ${myGiftCards.error.message}`}</p>
    if (orderGiftCardId.loading) return <p>Loading</p>
    if (orderGiftCardId.error) return <p>{`Error! ${orderGiftCardId.error.message}`}</p>

    const handleCodeChange = (e) => {
        setGiftCode(e.target.value)
    }

    const handleAddGiftCode = () => {
        const orderedGiftCard = myGiftCards.data.bssCustomerGiftCards.filter((element) => {
            let result = false
            for(let i=0; i<orderGiftCardId.data.customerOrders.items.length; i++) {
                if(element.order_id.toString() === orderGiftCardId.data.customerOrders.items[i].id) result = true
            }
            return result
        })
        
        const matchCode = orderedGiftCard.find((element) => element.code === giftCode)
        if(matchCode) {
            setGiftCodeError(false)
            setGiftCodeData(matchCode)
        }
        else setGiftCodeError(true)
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
                        <div style={{flexGrow: 1}}>
                            <input style={{width: '100%', height: 50, paddingLeft: 15}} placeholder="Enter code" onChange={handleCodeChange} value={giftCode}></input>
                            {giftCodeError && (<p style={{fontSize: 14, marginTop: 10, color: 'red'}}>The gift code isn't valid. Verify the code and try again.</p>)}
                        </div>
                        <div>
                            <button className='discount-gift-card-apply-button' onClick = {handleAddGiftCode}>APPLY</button>
                        </div>
                    </div>
                </div>)}
            </div>
        </>
                )
    }

export default DiscountGiftCard