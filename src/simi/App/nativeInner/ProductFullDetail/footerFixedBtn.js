import React, { Fragment, Suspense, useRef, useState } from 'react';
import { BiMessageAltDetail } from 'react-icons/bi';
require('./statusBar.scss');

const FooterFixedBtn = props => {
    const {
        addToCartPopup,
        setAddToCartPopup,
        typeBtn,
        setTypeBtn,
        bottomInsets,
        isDisabled
    } = props;

    return (
        <>
            <div style={{ height: 55 + bottomInsets }} className="virtual" />
            {!isDisabled || isDisabled.action !== 'hide_add_to_cart' ? (
                <div
                    style={{ height: 55 + bottomInsets }}
                    className="main-footerFixedBtn"
                >
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
            ) : null}
        </>
    );
};

export default FooterFixedBtn;
