import React, { Fragment, Suspense, useRef, useState } from 'react';
import {BiMessageAltDetail} from "react-icons/bi"
require('./statusBar.scss')


const FooterFixedBtn = props => {
const {addToCartPopup, setAddToCartPopup, typeBtn,setTypeBtn} = props
    return <div className="main-footerFixedBtn">
        <ul>
            <li className="msg-icon"><BiMessageAltDetail /></li>
            <li onClick={()=> {
                setAddToCartPopup(true)
                setTypeBtn("add to cart")
                }}>ADD TO CART</li>
            <li onClick={()=> {
                setAddToCartPopup(true)
                setTypeBtn("buy now")
            }}>BUY NOW</li>
        </ul>
    </div>
}

export default FooterFixedBtn