import React, { useState, Suspense, useEffect } from 'react';
import Identify from 'src/simi/Helper/Identify';
import Search from 'src/simi/BaseComponents/Icon/Search';
import defaultClasses from '../header.module.css';
import { mergeClasses } from 'src/classify';
import { useIntl } from 'react-intl';
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_ITEM_COUNT_QUERY } from '@simicart/siminia/src/simi/App/core/Header/cartTrigger.gql.js';
import { BiShoppingBag, BiX, BiArrowBack } from 'react-icons/bi';
import { ArrowLeft } from 'react-feather';
import { useWindowSize } from '@magento/peregrine';
import { Link, useHistory, useLocation } from 'react-router-dom';

require('./search.scss');

const SearchAutoComplete = React.lazy(() =>
    import('./searchAutoComplete/index')
);

const SearchForm = props => {
    // const storeConfig = Identify.getStoreConfig();
    const history = useHistory();
    const location = useLocation();
    const itemsQty = props.itemsQty;

    const displayBackBtn =
        location.pathname !== '/' &&
        location.pathname !== '/home' &&
        location.pathname !== '/cart' &&
        location.pathname !== '/brands.html' &&
        location.pathname !== '/account-information';

    useEffect(() => {
        setOpenSearchField(false);
        setSearchVal('');
    }, [history.location.search]);

    // const { itemCount: itemsQty } = useCartTrigger({
    //     mutations: {
    //         createCartMutation: CREATE_CART_MUTATION
    //     },
    //     queries: {
    //         getItemCountQuery: GET_ITEM_COUNT_QUERY
    //     },
    //     storeConfig
    // });
    const windowSize = useWindowSize();

    const isPhone = windowSize.innerWidth <= 450;
    let searchField = null;
    const [showAC, setShowAC] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const { formatMessage } = useIntl();
    const [openSearchField, setOpenSearchField] = useState(false);

    const startSearch = () => {
        if (searchVal.length > 1) {
            props.history.push(`/search.html?q=${searchVal}`);
            setSearchVal('');
            setOpenSearchField(false);
        } else {
            setOpenSearchField(true);
        }
    };
    const handleSearchField = () => {
        if (searchField.value) {
            setShowAC(true);
            if (searchField.value !== searchVal)
                setSearchVal(searchField.value.trim());
        } else {
            setShowAC(false);
        }
    };

    const handleBlur = () => {
        // setSearchVal('');
        if (searchVal.length <= 1) {
            setOpenSearchField(false);
        }
    };
    const handleCloseSearch = () => {
        setOpenSearchField(false);
        setSearchVal('');
    };

    const classes = mergeClasses(defaultClasses, props.classes);
    const renderInputField = isPhone => {
        if (isPhone) {
            if (openSearchField) {
                return (
                    <div className="siminia-search-field-wrapper">
                        <div>
                            <BiArrowBack
                                className="header-close-icon"
                                onClick={() => handleCloseSearch()}
                            />
                        </div>
                        <input
                            autoFocus
                            className="siminia-search-field"
                            type="text"
                            id="siminia-search-field"
                            ref={e => {
                                searchField = e;
                            }}
                            onBlur={() => handleBlur()}
                            placeholder={formatMessage({
                                id: 'search your product'
                            })}
                            onChange={() => handleSearchField()}
                            onKeyPress={e => {
                                if (e.key === 'Enter') startSearch();
                            }}
                        />
                        <div
                            onClick={() => startSearch()}
                            className="header-search-icon"
                        >
                            <Search
                                style={{
                                    width: 35,
                                    height: 35,
                                    display: 'block'
                                }}
                            />
                        </div>
                    </div>
                );
            } else return null;
        }
        return (
            <input
                className="siminia-search-field"
                type="text"
                id="siminia-search-field"
                ref={e => {
                    searchField = e;
                }}
                placeholder={formatMessage({
                    id: 'search your product'
                })}
                onChange={() => handleSearchField()}
                onKeyPress={e => {
                    if (e.key === 'Enter') startSearch();
                }}
            />
        );
    };
    const renderHeaderIcon = displayBackBtn => {
        if (!displayBackBtn) {
            return (
                <Link to="/">
                    <img
                        className="main-header-icon"
                        src="https://magento24.pwa-commerce.com/media/logo/stores/1/Lays-Logo.png"
                        alt="logo"
                    />
                    {/* <span className="header-title">SimiCart</span> */}
                </Link>
            );
        } else
            return (
                <div className="main-header-backIcon">
                    <ArrowLeft onClick={() => history.goBack()} />
                    <Link to="/" className="header-title">
                        SimiCart
                    </Link>
                </div>
            );
    };

    return (
        <>
            <div className={classes['header-search-form']}>
                {isPhone ? renderHeaderIcon(displayBackBtn) : null}
                <label htmlFor="siminia-search-field" className="hidden">
                    {formatMessage({ id: 'Search' })}
                </label>

                {renderInputField(isPhone)}
                <div
                    role="button"
                    tabIndex="0"
                    className={`${classes['search-icon']} ${
                        Identify.isRtl() ? 'search-icon-rtl' : ''
                    }`}
                    onClick={() => startSearch()}
                    onKeyUp={() => startSearch()}
                >
                    <Search
                        style={{ width: 27, height: 25, display: 'block', marginTop:4 }}
                    />
                </div>

                {searchVal && searchVal.length > 2 && (
                    <Suspense fallback={null}>
                        <SearchAutoComplete
                            visible={showAC}
                            setVisible={setShowAC}
                            value={searchVal}
                        />
                    </Suspense>
                )}
            </div>
            {isPhone ? (
                <Link to="/cart" className="shopping-cart-icon">
                    <BiShoppingBag />
                    <span className="header-cartQty">{itemsQty}</span>
                </Link>
            ) : null}
        </>
    );
};
export default SearchForm;
