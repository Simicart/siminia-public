import React, { useState, Suspense } from 'react';
import Identify from 'src/simi/Helper/Identify';
import Search from 'src/simi/BaseComponents/Icon/Search';
import defaultClasses from '../header.module.css';
import { mergeClasses } from 'src/classify';
import { useIntl } from 'react-intl';
import { useUserContext } from '@magento/peregrine/lib/context/user.js';
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_ITEM_COUNT_QUERY } from '@simicart/siminia/src/simi/App/core/Header/cartTrigger.gql.js';
import { BiShoppingBag } from 'react-icons/bi';
import { useWindowSize } from '@magento/peregrine';
import { Link } from 'react-router-dom';

require('./search.scss');

const SearchAutoComplete = React.lazy(() =>
    import('./searchAutoComplete/index')
);

const SearchForm = props => {
    const storeConfig = Identify.getStoreConfig();
    const { itemCount: itemsQty } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        },
        storeConfig
    });
    const windowSize = useWindowSize();

    const isPhone = windowSize.innerWidth <= 450;
    let searchField = null;
    const [showAC, setShowAC] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const { formatMessage } = useIntl();
    const [openSearchField, setOpenSearchField] = useState(false);

    console.log('test123456', openSearchField);

    const startSearch = () => {
        if (searchVal.length > 1) {
            props.history.push(`/search.html?q=${searchVal}`);
            setSearchVal('');
        } else {
            setOpenSearchField(!openSearchField);
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
    console.log('test', searchVal);

    const classes = mergeClasses(defaultClasses, props.classes);
    const renderInputField = isPhone => {
        if (isPhone) {
            if (openSearchField) {
                return (
                    <input
                        // autoFocus
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

    return (
        <>
            <div className={classes['header-search-form']}>
                {isPhone ? (
                    <Link to="/">
                        <img
                            className="main-header-icon"
                            src="https://magento24.pwa-commerce.com/media/logo/stores/1/Lays-Logo.png"
                            alt="logo"
                        />
                        <span className="header-title">SimiCart</span>
                    </Link>
                ) : null}
                <label htmlFor="siminia-search-field" className="hidden">
                    {formatMessage({ id: 'Search' })}
                </label>
                {/* {openSearchField && isPhone ? (
                    <input
                        className="siminia-search-field"
                        type="text"
                        id="siminia-search-field"
                        ref={e => {
                            searchField = e;
                        }}
                        onBlur={() => setOpenSearchField(false)}
                        placeholder={formatMessage({
                            id: 'search your product'
                        })}
                        onChange={() => handleSearchField()}
                        onKeyPress={e => {
                            if (e.key === 'Enter') startSearch();
                        }}
                    />
                 ) : null}  */}
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
                        style={{ width: 35, height: 35, display: 'block' }}
                    />
                </div> 

                {!isPhone && searchVal && searchVal.length > 2 && (
                    <Suspense fallback={null}>
                        <SearchAutoComplete
                            visible={showAC}
                            setVisible={setShowAC}
                            value={searchVal}
                        />
                    </Suspense>
                )}
            </div>
            {isPhone ? <Link to="/cart" className="shopping-cart-icon">
                <BiShoppingBag />
                <span className="header-cartQty">{itemsQty}</span>
            </Link> : null}
        </>
    );
};
export default SearchForm;
