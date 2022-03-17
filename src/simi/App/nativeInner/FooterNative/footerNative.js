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

import {
    BiHomeAlt,
    BiCategoryAlt,
    BiCart,
    BiWallet,
    BiUser
} from 'react-icons/bi';

const TYPE_PRODUCT = 'PRODUCT';

const FooterNative = props => {
    const [{ isSignedIn }] = useUserContext();
    const listMenuContent = ['Home', 'Category', 'Cart', 'Malls', 'Account'];
    const listMenuUrl = [
        '',
        'categories',
        'cart',
        'brands.html',
        'my-account'
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

    const { data } = useQuery(RESOLVE_URL, {
        variables: {
            url: location.pathname
        },
        skip: !location.pathname || location.pathname === '/',
        fetchPolicy: 'cache-first'
    });

    const isPhone = windowSize.innerWidth <= 450;
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
        location.pathname === '/sign-in' || location.pathname === '/forgot-password'|| location.pathname === '/create-account' || isOrderDetailPage
            ? true
            : false;
    const pathName =
        location && location.pathname ? location.pathname.split('/')[1] : null;

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
