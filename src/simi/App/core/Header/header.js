import React, { useEffect } from 'react';
import Identify from 'src/simi/Helper/Identify';
import WishList from 'src/simi/BaseComponents/Icon/WishList';
import MenuIcon from 'src/simi/BaseComponents/Icon/Menu';
import ToastMessage from 'src/simi/BaseComponents/Message/ToastMessage';
import NavTrigger from './Component/navTrigger';
import CartTrigger from './cartTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from 'src/drivers';
import MegaMenu from '@magento/venia-ui/lib/components/MegaMenu/megaMenu';
import MyAccount from './Component/MyAccount';
import { useHistory, useLocation } from 'react-router-dom';
import { logoUrl } from 'src/simi/Helper/Url';
import SearchForm from './Component/SearchForm';
import StoreSwitcher from '@magento/venia-ui/lib/components/Header/storeSwitcher';
import CurrencySwitcher from '@magento/venia-ui/lib/components/Header/currencySwitcher';
import PageLoadingIndicator from '@magento/venia-ui/lib/components/PageLoadingIndicator';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useWindowSize } from '@magento/peregrine';
import { useIntl } from 'react-intl';

import defaultClasses from './header.module.css';

const Header = props => {
    const history = useHistory();
    const location = useLocation();
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const isSimpleHeader =
        location &&
        location.pathname &&
        (location.pathname === '/checkout' || location.pathname === '/cart');

    const storeConfig = Identify.getStoreConfig();
    const [userData] = useUserContext();

    const { isSignedIn } = userData;
    const renderRightBar = () => {
        return (
            <div
                className={`${classes['right-bar']} ${
                    Identify.isRtl() ? 'right-bar-rtl' : ''
                }`}
            >
                <div className={classes['right-bar-item']} id="my-account">
                    <MyAccount classes={classes} userData={userData} />
                </div>
                <div className={classes['right-bar-item']} id="wish-list">
                    <Link to={isSignedIn ? '/wishlist' : '/sign-in'}>
                        <div
                            className={classes['item-icon']}
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <WishList
                                style={{
                                    width: 35,
                                    height: 35,
                                    display: 'block'
                                }}
                            />
                        </div>
                        <div className={classes['item-text']}>
                            {formatMessage({ id: 'Wishlist' })}
                        </div>
                    </Link>
                </div>
                <div
                    className={`${classes['right-bar-item']} ${
                        Identify.isRtl() ? classes['right-bar-item-rtl'] : ''
                    }`}
                >
                    <CartTrigger classes={classes} />
                </div>
            </div>
        );
    };

    const renderLogo = () => {
        const storeConfig = Identify.getStoreConfig();
        const storeName =
            storeConfig && storeConfig.storeConfig
                ? storeConfig.storeConfig.store_name
                : '';
        return (
            <div
                className={`${classes['search-icon']} ${
                    classes['header-logo']
                }`}
            >
                <Link to="/">
                    <img
                        src={logoUrl()}
                        alt={storeName}
                        style={{
                            objectPosition: isPhone
                                ? 'center'
                                : Identify.isRtl()
                                ? 'right'
                                : 'left',
                            objectFit: 'contain',
                            width: isPhone ? 180 : 240,
                            height: isPhone ? 30 : 40
                        }}
                    />
                </Link>
            </div>
        );
    };

    const renderSearchForm = () => {
        return (
            <div
                className={`${classes['header-search']} ${
                    Identify.isRtl() ? classes['header-search-rtl'] : ''
                }`}
            >
                <SearchForm history={history} />
            </div>
        );
    };
    if (isPhone) {
        return (
            <React.Fragment>
                <header id="siminia-main-header">
                    <div
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div className="container">
                            <div
                                className={`${
                                    classes['header-app-bar']
                                } ${Identify.isRtl() &&
                                    classes['header-app-bar-rtl']}`}
                            >
                                <NavTrigger>
                                    {!isSimpleHeader && (
                                        <MenuIcon
                                            color="#333132"
                                            style={{ width: 35, height: 35 }}
                                        />
                                    )}
                                </NavTrigger>
                                {renderLogo()}
                                <div className={classes['right-bar']}>
                                    {!isSimpleHeader && (
                                        <div
                                            className={
                                                classes['right-bar-item']
                                            }
                                        >
                                            <CartTrigger />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="id-message">
                        <ToastMessage />
                    </div>
                </header>
                {!isSimpleHeader && renderSearchForm()}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {!isSimpleHeader && (
                <div className={classes.switchersContainer}>
                    {storeConfig ? (
                        <div className={`${classes.switchers} container`}>
                            <StoreSwitcher />
                            <CurrencySwitcher />
                        </div>
                    ) : (
                        <div style={{ height: 37 }} />
                    )}
                </div>
            )}
            <header id="siminia-main-header">
                <div
                    style={{
                        backgroundColor: isSimpleHeader
                            ? 'rgba(255,255,255,0.8)'
                            : 'white',
                        backdropFilter: isSimpleHeader ? 'blur(10px)' : 'unset'
                    }}
                >
                    <div
                        className={`${
                            classes['header-app-bar']
                        } ${Identify.isRtl() &&
                            classes['header-app-bar-rtl']} container`}
                    >
                        {renderLogo()}
                        {!isSimpleHeader && renderSearchForm()}
                        {!isSimpleHeader && renderRightBar()}
                    </div>
                </div>
                {window.innerWidth >= 1024 && !isSimpleHeader ? (
                    <div className={classes['header-megamenu-ctn']}>
                        {storeConfig ? (
                            <MegaMenu classes={classes} />
                        ) : (
                            <div style={{ height: 44 }} />
                        )}
                    </div>
                ) : (
                    ''
                )}
                <PageLoadingIndicator
                    absolute
                    classes={{
                        root_absolute: classes.pageLoadingIndRoot,
                        indicator_off: classes.indicator_off,
                        indicator_loading: classes.indicator_loading,
                        indicator_done: classes.indicator_done
                    }}
                />
            </header>

            <div id="id-message">
                <ToastMessage />
            </div>
        </React.Fragment>
    );
};

export default Header;
