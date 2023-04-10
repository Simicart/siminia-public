import React from 'react'
import { useHistory } from 'react-router-dom'
import { ShoppingCart } from 'react-feather'
import messageIcon from '../assets/images/message.png'

const FooterAbsNative = () => {
    const history = useHistory()
    return (
        <>
            <div className='abs-footer-native'>
                <div style={{marginTop: 10}}>
                    <img src={messageIcon}></img>
                </div>
                <div style={{flexGrow: 1}}>
                    <button className='abs-checkout-native' onClick={() => history.push('/checkout')}>
                        <ShoppingCart></ShoppingCart> Checkout</button>
                </div>
            </div>   
        </>
    )
}

export default FooterAbsNative