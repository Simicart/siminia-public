import { useUserContext } from '@magento/peregrine/lib/context/user';
import React, { Fragment, Suspense, useRef, useState } from 'react';
import { BiMessageAltDetail } from 'react-icons/bi';
import CallForPrice from './callForPrice';
import { isCallForPriceEnable } from 'src/simi/App/nativeInner/Helper/Module';
import { useIntl } from 'react-intl';
require('./statusBar.scss');

const FooterFixedBtn = props => {
    const {
        addToCartPopup,
        setAddToCartPopup,
        typeBtn,
        setTypeBtn,
        bottomInsets,
        data
    } = props;
    const { formatMessage } = useIntl();

    const callForPriceEnabled = isCallForPriceEnable();

    const [{ isSignedIn }] = useUserContext();
    const action = data && data.action ? data.action : '';

    if (callForPriceEnabled) {
        return (
            <>
                <div
                    style={{ height: 55 + bottomInsets }}
                    className="virtual"
                />
                {action === 'login_see_price' && isSignedIn ? (
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
                        </ul>
                    </div>
                ) : (
                    <div
                        style={{ height: 55 + bottomInsets }}
                        className="main-footerFixedBtn"
                    >
                        <ul>
                            <li className="msg-icon">
                                {action === 'hide_add_to_cart' ? (
                                    ''
                                ) : (
                                    <BiMessageAltDetail />
                                )}
                            </li>
                            <li className="callForPrice">
                                <CallForPrice
                                    data={props.data}
                                    wrapperPrice={props.wrapperPrice}
                                    item_id={props.item_id}
                                />
                            </li>
                        </ul>
                    </div>
                )}
            </>
        );
    } else {
        return (
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
                </ul>
            </div>
        );
    }
};

export default FooterFixedBtn;
