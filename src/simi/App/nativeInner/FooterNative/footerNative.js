import React, { useState, useEffect } from 'react';
import classes from './footerNative.module.css';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useWindowSize } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user.js';
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_ITEM_COUNT_QUERY } from '@simicart/siminia/src/simi/App/core/Header/cartTrigger.gql.js';
import Identify from 'src/simi/Helper/Identify';

import {
    BiHomeAlt,
    BiCategoryAlt,
    BiCart,
    BiWallet,
    BiUser
} from 'react-icons/bi';

const FooterNative = props => {
    const [{ isSignedIn }] = useUserContext();
    const listMenuContent = ['Home', 'Category', 'Cart', 'Malls', 'Account'];
    const listMenuUrl = [
        '',
        'home',
        'cart',
        'brands.html',
        'account-information'
    ];
    const [iconActive, setIconActive] = useState();
    const listIcon = [
        <BiHomeAlt />,
        <BiCategoryAlt />,
        <BiCart />,
        <BiWallet />,
        <BiUser />
    ];
    const storeConfig = Identify.getStoreConfig();

    const location = useLocation();
    const windowSize = useWindowSize();

    const isPhone = windowSize.innerWidth <= 450;
    const pathNameLength =
        location && location.pathname
            ? location.pathname.split('/').length
            : null;
    const isHtml =
        location && location.pathname ? location.pathname.split('.')[1] : null;
    const isDetailPage =
        location && location.pathname
            ? location.pathname.split('-').length
            : null;

    const isBrand =
        location && location.pathname ? location.pathname.split('.')[0] : null;

    const { itemCount: itemsQty } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        },
        storeConfig
    });

    const isHiddenBottomMenu =
        location &&
        location.pathname &&
        ((location.pathname === '/sign-in' && isPhone && isHtml === 'html') ||
            (isPhone &&
                pathNameLength === 2 &&
                isHtml === 'html' &&
                isBrand !== '/brands' &&
                isDetailPage > 1 && location.pathname !== "/what-is-new.html"));
    const pathName =
        location && location.pathname ? location.pathname.split('/')[1] : null;

    useEffect(() => {
        if (pathName === '') {
            setIconActive(0);
        }
        if (pathName === 'home' || pathNameLength > 2) {
            setIconActive(1);
        }
        if (pathName === 'cart') {
            setIconActive(2);
        }
        if (pathName === 'brands.html') {
            setIconActive(3);
        }
        if (pathName === 'account-information') {
            if (isSignedIn) {
                setIconActive(4);
            } else window.location.pathname = '/sign-in';
        }
    }, [pathName, isSignedIn, pathNameLength]);

    const handleUrl = index => {
        if (index === 4) {
            return isSignedIn ? listMenuUrl[4] : 'sign-in';
        } else return listMenuUrl[index];
    };
    if (isHiddenBottomMenu || !isPhone) {
        return null;
    }
    const MenuItems = listMenuContent.map((item, index) => {
        return (
            <Link
                to={`/${handleUrl(index)}`}
                className={`${classes.iconWrapper} ${
                    iconActive === index ? classes.active : null
                }`}
                key={index}
            >
                {index === 2 ? (
                    <span className={classes.cartQty}>{itemsQty}</span>
                ) : null}
                <span>{listIcon[index]}</span>
                <span>{item}</span>
            </Link>
        );
    });

    return (
        <>
            <div className={classes.virtualFooter} />
            <div className={classes.mainFooter}>{MenuItems}</div>
        </>
    );
};

export default FooterNative;
