import React, { Fragment, Suspense, useRef, useState } from 'react';
import { BiMessageAltDetail } from 'react-icons/bi';
require('./statusBar.scss');

const FooterFixedBtn = props => {
    const { addToCartPopup, setAddToCartPopup, typeBtn, setTypeBtn, bottomInsets } = props;
    return (
        <>
        <div style={{height: 55+ bottomInsets}} className="virtual"/>
        <div style={{ height: 55+ bottomInsets}}  className="main-footerFixedBtn">
            <ul>
                <li className="msg-icon">
                    <BiMessageAltDetail />
                </li>
                <li
                    onClick={() => {
                        setAddToCartPopup(true);
                        setTypeBtn('add to cart');
                    }}
                    >
                    ADD TO CART
                </li>
                <li
                    onClick={() => {
                        setAddToCartPopup(true);
                        setTypeBtn('buy now');
                    }}
                    >
                    BUY NOW
                </li>
            </ul>
        </div>
        </>
    );
};

export default FooterFixedBtn;
