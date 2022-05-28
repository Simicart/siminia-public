import React, { useState, useEffect } from 'react';
import classes from './footerNative.module.css';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useWindowSize } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user.js';
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_ITEM_COUNT_QUERY } from '@simicart/siminia/src/simi/App/core/Header/cartTrigger.gql.js';
import Identify from 'src/simi/Helper/Identify';
import { RESOLVE_URL } from '@magento/peregrine/lib/talons/MagentoRoute/magentoRoute.gql';
import { useQuery } from '@apollo/client';

const shopByBrandEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND) === 1;

import {
    BiHomeAlt,
    BiCategoryAlt,
    BiCart,
    BiWallet,
    BiUser
} from 'react-icons/bi';
import { config } from 'process';
import { configColor } from '../../../Config';

const TYPE_PRODUCT = 'PRODUCT';

const FooterNative = props => {
    const [{ isSignedIn }] = useUserContext();
    const listMenuContent = ['Home', 'Category', 'Cart', 'Malls', 'Account'];
    const listMenuUrl = ['', 'categories', 'cart', 'brands.html', 'my-account'];
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

    const { data } = useQuery(RESOLVE_URL, {
        variables: {
            url: location.pathname
        },
        skip: !location.pathname || location.pathname === '/',
        fetchPolicy: 'cache-first'
    });

    const isPhone = windowSize.innerWidth <= 780;

    let bottomInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            bottomInsets = parseInt(simicartRNinsets.bottom);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            bottomInsets = parseInt(simpifyRNinsets.bottom);
        }
    } catch (err) {}

    let bottomMenuHeight = isPhone ? 55 : 107;
    bottomMenuHeight += bottomInsets;

    const pathNameLength =
        location && location.pathname
            ? location.pathname.split('/').length
            : null;

    const { itemCount: itemsQty } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        },
        storeConfig
    });

    const isOrderDetailPage =
        location.pathname.split('/order-history')[1] !== '' &&
        location.pathname.split('/order-history').length === 2
            ? true
            : false;
    const isHiddenBottomMenu =
        (data && data.route && data.route.type === TYPE_PRODUCT) ||
        location.pathname === '/sign-in' ||
        location.pathname === '/forgot-password' ||
        location.pathname === '/create-account' ||
        location.pathname === '/checkout' ||
        location.pathname === '/cart' ||
        isOrderDetailPage
            ? true
            : false;
    const pathName =
        location && location.pathname ? location.pathname.split('/')[1] : null;

    const bottomMenuStyle = {
        backgroundColor: configColor.key_color,
        height: bottomMenuHeight,
        display: 'flex',
        alignItems: 'start',
        paddingTop: 10
    };

    useEffect(() => {
        if (pathName === '') {
            setIconActive(0);
        }
        if (pathName === 'categories' || pathNameLength > 2) {
            setIconActive(1);
        }
        if (pathName === 'cart') {
            setIconActive(2);
        }
        if (pathName === 'brands.html') {
            setIconActive(3);
        }
        if (pathName === 'my-account') {
            // if (isSignedIn) {
            setIconActive(4);
            // } else window.location.pathname = '/sign-in';
        }
    }, [pathName, isSignedIn, pathNameLength]);

    const handleUrl = index => {
        // if (index === 4) {
        //     return isSignedIn ? listMenuUrl[4] : 'sign-in';
        // } else return
        return listMenuUrl[index];
    };
    if (isHiddenBottomMenu || !isPhone) {
        return null;
    }
    const MenuItems = listMenuContent.map((item, index) => {
        if (!shopByBrandEnabled && index === 3) return '';
        return (
            <Link
                to={`/${handleUrl(index)}`}
                className={`${classes.iconWrapper} ${
                    iconActive === index ? classes.active : null
                }`}
                key={index}
            >
                {index === 2 && itemsQty ? (
                    <span className={classes.cartQty}>{itemsQty}</span>
                ) : null}
                <span>{listIcon[index]}</span>
                <span>{item}</span>
            </Link>
        );
    });

    return (
        <div>
            <div
                className={classes.virtualFooter}
                style={{ height: bottomMenuHeight }}
            />
            <div className={classes.mainFooter} style={bottomMenuStyle}>
                {MenuItems}
            </div>
        </div>
    );
};

export default FooterNative;
