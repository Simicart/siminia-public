import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import WishList from 'src/simi/BaseComponents/Icon/WishList';
// import MenuIcon from 'src/simi/BaseComponents/Icon/Menu';
import ToastMessage from 'src/simi/BaseComponents/Message/ToastMessage';
// import NavTrigger from './Component/navTrigger';
import CartTrigger from './cartTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from 'src/drivers';
import MegaMenu from 'src/simi/BaseComponents/MegaMenu/components/TopMenu';
import MyAccount from './Component/MyAccount';
import { useHistory, useLocation } from 'react-router-dom';
import { logoUrl } from '../../../Helper/Url';
import SearchForm from './Component/SearchForm';
import StoreSwitcher from './storeSwitcher';
import CurrencySwitcher from '@magento/venia-ui/lib/components/Header/currencySwitcher';
import PageLoadingIndicator from '@magento/venia-ui/lib/components/PageLoadingIndicator';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useWindowSize } from '@magento/peregrine';
import { useIntl, FormattedMessage } from 'react-intl';
import { isBot, isHeadlessChrome } from '../../../Helper/BotDetect';
import { RESOLVE_URL } from '@magento/peregrine/lib/talons/MagentoRoute/magentoRoute.gql';
import defaultClasses from './header.module.css';
import { useQuery } from '@apollo/client';
import { ArrowLeft } from 'react-feather';
import { BiChevronRight } from 'react-icons/bi';
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_ITEM_COUNT_QUERY } from '@simicart/siminia/src/simi/App/core/Header/cartTrigger.gql.js';
import { configColor } from '../../../../simi/Config';
// import { useGetRewardPointData } from '../../../talons/RewardPoint/useGetRewardPointData';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import RewardPointHeader from 'src/simi/BaseComponents/RewardPoint/components/Header';
import FaqHeader from '../Faq/FaqHeader';
// check if bot or headless chrome / wont get cart to avoid perf accection
// can modify deeper on  peregrine/lib/context/cart.js:83 to avoid creating cart - db wasting - https://prnt.sc/2628k9h
const isBotOrHeadless = isBot() || isHeadlessChrome();

const TYPE_PRODUCT = 'PRODUCT';

const Header = props => {
    const history = useHistory();
    const location = useLocation();
    const pathname = location.pathname;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const comparisonList = JSON.parse(localStorage.getItem('comparison-list'))

    const storeConfig = Identify.getStoreConfig();
    // const { rewardPointConfig, customerRewardPoint } = useGetRewardPointData();
    // const pointBalance =
    //     customerRewardPoint && customerRewardPoint.point_balance
    //         ? customerRewardPoint.point_balance
    //         : '0';
    // const icon =
    //     rewardPointConfig &&
    //     rewardPointConfig.MpRewardConfig &&
    //     rewardPointConfig.MpRewardConfig.general
    //         ? rewardPointConfig.MpRewardConfig.general.icon
    //         : '';

    const { itemCount: itemsQty } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        },
        storeConfig
    });

    const { data } = useQuery(RESOLVE_URL, {
        variables: {
            url: pathname
        },
        skip: !pathname || pathname === '/',
        fetchPolicy: 'cache-first'
    });

    // const isHiddenHeader =
    //     (data && data.route && data.route.type === TYPE_PRODUCT) ||
    //     pathname === '/sign-in'
    //         ? true
    //         : false;

    const isHiddenHeader =
        data && data.route && data.route.type === TYPE_PRODUCT;

    const isSimpleHeader =
        location && location.pathname && location.pathname === '/checkout';

    const type = location && location.pathname ? location.pathname : null;
    const isOrderDetailPage =
        type.split('/order-history')[1] !== '' &&
            type.split('/order-history').length === 2
            ? true
            : false;

    const myProfile = [
        '/order-history',
        '/wishlist',
        '/address-book',
        '/saved-payments',
        '/product-review',
        '/communications',
        '/account-information',
        '/account-subcriptions',
        '/reward-points',
        '/reward-transactions',
        '/contact.html',
        '/account-setting',
        '/checkout',
        '/product-alert',
        '/my-gift-cards'
    ];

    // const storeConfig = Identify.getStoreConfig();
    const [userData] = useUserContext();

    let topInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            topInsets = parseInt(simicartRNinsets.top);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            topInsets = parseInt(simpifyRNinsets.top);
        }
    } catch (err) { }

    let headerHeight = isPhone ? 55 : 107;
    headerHeight += topInsets;
    const myAccountHead = 80 + topInsets;

    const headerStyle = {
        backgroundColor: configColor.key_color,
        height: headerHeight,
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: 16
    };

    const { isSignedIn } = userData;

    const renderRightBar = () => {
        return (
            <div
                className={`${classes['right-bar']} ${Identify.isRtl() ? 'right-bar-rtl' : ''
                    }`}
                style={{ height: headerHeight }}
            >
                <div className={classes['right-bar-item']}>
                    <StoreSwitcher />
                </div>

                {comparisonList && (
                    <div className={classes['comparison-list']}>
                        <a href='/compare-product.html'>{comparisonList.length === 1 ? `Compare Products (1 item)`
                                                        : `Compare Products (${comparisonList.length} items)`}</a>
                    </div>
                )}

                <FaqHeader classes={classes} />

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
                                    width: 30,
                                    height: 30,
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
                    className={`${classes['right-bar-item']} ${Identify.isRtl() ? classes['right-bar-item-rtl'] : ''
                        }`}
                >
                    {!isBotOrHeadless && <CartTrigger classes={classes} />}
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
                className={`${classes['search-icon']} ${classes['header-logo']
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
                className={`${classes['header-search']} ${Identify.isRtl() ? classes['header-search-rtl'] : ''
                    }`}
                style={{
                    backgroundColor: configColor.key_color,
                    height: headerHeight
                }}
            >
                {isPhone ? (
                    <div className={classes.mobileMenuToggle}>
                        <a onClick={() => toggleDrawer('nav')}>
                            <i />
                        </a>
                    </div>
                ) : (
                    ''
                )}
                <SearchForm
                    itemsQty={itemsQty}
                    history={history}
                    topInsets={topInsets}
                />
            </div>
        );
    };

    const renderHeader = type => {
        if (type === '/sign-in') {
            return (
                <div className={classes.specHeader} style={headerStyle}>
                    <ArrowLeft onClick={() => history.goBack()} />
                    <span>
                        <FormattedMessage
                            id="Sign In"
                            defaultMessage="Sign In"
                        />
                    </span>
                </div>
            );
        }
        if (type === '/create-account') {
            return (
                <div className={classes.specHeader} style={headerStyle}>
                    <ArrowLeft onClick={() => history.goBack()} />
                    <span>
                        <FormattedMessage
                            id="Register"
                            defaultMessage="Register"
                        />
                    </span>
                </div>
            );
        }
        if (type === '/forgot-password') {
            return (
                <div className={classes.specHeader} style={headerStyle}>
                    <ArrowLeft onClick={() => history.goBack()} />
                    <span>
                        <FormattedMessage
                            id="Forgot Password"
                            defaultMessage="Forgot Password"
                        />
                    </span>
                </div>
            );
        }
        if (type === '/cart') {
            return (
                <div className={classes.specHeader} style={headerStyle}>
                    <ArrowLeft onClick={() => history.goBack()} />
                    <span>
                        <FormattedMessage
                            id="SHOPPING CART"
                            defaultMessage="Shopping Cart"
                        />{' '}
                        ({itemsQty})
                    </span>
                </div>
            );
        }
        if (type === '/my-account') {
            return (
                <div
                    className={classes.myAccountHead}
                    style={{
                        backgroundColor: configColor.key_color,
                        height: myAccountHead,
                        display: 'flex',
                        alignItems: 'flex-end',
                        paddingBottom: 16
                    }}
                >
                    <MyAccount classes={classes} userData={userData} />
                    <BiChevronRight />
                </div>
            );
        }

        if (isOrderDetailPage) {
            return (
                <div className={classes.specHeader} style={headerStyle}>
                    <ArrowLeft onClick={() => history.goBack()} />
                    <span>
                        <FormattedMessage
                            id="Order Details"
                            defaultMessage="Order Details"
                        />
                    </span>
                </div>
            );
        }
        if (myProfile.includes(type)) {
            const name =
                type
                    .split('/')[1]
                    .replaceAll('-', ' ')
                    .charAt(0)
                    .toUpperCase() +
                type
                    .split('/')[1]
                    .replaceAll('-', ' ')
                    .slice(1); +
                        type
                            .split('/')[1]
                            .replaceAll('-', ' ')
                            .slice(1);
            return (
                <div
                    className={classes.specHeader}
                    style={headerStyle}
                    id="siminia-text-header"
                >
                    <ArrowLeft onClick={() => history.goBack()} />
                    <span>
                        {type !== '/contact.html'
                            ? formatMessage({ id: name, defaultMessage: name })
                            : formatMessage({
                                id: 'Contact Us',
                                defaultMessage: 'Contact Us'
                            })}
                    </span>
                </div>
            );
        } else return !isHiddenHeader && renderSearchForm();
    };
    const [, { toggleDrawer }] = useAppContext();

    if (isPhone) {
        return (
            <React.Fragment>
                {!isHiddenHeader ? (
                    <div
                        className={classes.virtualHeader}
                        style={{ height: headerHeight }}
                    />
                ) : null}

                {/* {!isSimpleHeader && !isHiddenHeader && renderSearchForm()}
                 */}
                {renderHeader(type)}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {!isSimpleHeader && !isPhone && (
                <div className={classes.switchersContainer}>
                    {storeConfig ? (
                        <div className={`${classes.switchers} container`}>
                            <RewardPointHeader />
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
                        className={`${classes['header-app-bar']
                            } ${Identify.isRtl() &&
                            classes['header-app-bar-rtl']} container`}
                    >
                        {renderLogo()}
                        {!isSimpleHeader && renderSearchForm()}
                        {!isSimpleHeader && renderRightBar()}
                    </div>
                </div>
                {!isPhone && !isSimpleHeader ? (
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
