import { useUserContext } from '@magento/peregrine/lib/context/user';
import React, { Fragment, Suspense, useRef, useState } from 'react';
import { BiMessageAltDetail } from 'react-icons/bi';
import CallForPrice from './callForPrice';
import { isCallForPriceEnable } from 'src/simi/App/nativeInner/Helper/Module';
import { useIntl } from 'react-intl';
import {  HideAddToCartBtn } from 'src/simi/BaseComponents/CallForPrice/components/Product'
require('./statusBar.scss');

const FooterFixedBtn = props => {
    const {
        addToCartPopup,
        setAddToCartPopup,
        typeBtn,
        setTypeBtn,
        bottomInsets,
        product
    } = props;
    const { formatMessage } = useIntl();

    const addToCartBtn = (
        <React.Fragment>
             <li
                onClick={() => {
                    setAddToCartPopup(true);
                    setTypeBtn('add to cart');
                }}
            >
                {formatMessage({
                    id: 'Add to Cart',
                    default: 'ADD TO CART'
                })}
            </li>
            <li
                onClick={() => {
                    setAddToCartPopup(true);
                    setTypeBtn('buy now');
                }}
            >
                {formatMessage({
                    id: 'Buy now',
                    default: 'BUY NOW'
                })}
            </li>
        </React.Fragment>
    )
  
    return (
        <div
            style={{ height: 55 + bottomInsets }}
            className="main-footerFixedBtn"
        >
            <ul>
                <li className="msg-icon">
                    <BiMessageAltDetail />
                </li>
                <HideAddToCartBtn 
                    product={product}
                    addToCartBtn={addToCartBtn}
                    type='detail-mobile'
                />
            </ul>
        </div>
    );
};

export default FooterFixedBtn;
