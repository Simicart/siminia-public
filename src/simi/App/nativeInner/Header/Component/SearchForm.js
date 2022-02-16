import React, { useState, Suspense } from 'react';
import Identify from 'src/simi/Helper/Identify';
import Search from 'src/simi/BaseComponents/Icon/Search';
import defaultClasses from '../header.module.css';
import { mergeClasses } from 'src/classify';
import { useIntl } from 'react-intl';
require('./search.scss');

const SearchAutoComplete = React.lazy(() =>
    import('./searchAutoComplete/index')
);

const SearchForm = props => {
    let searchField = null;
    const [showAC, setShowAC] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const { formatMessage } = useIntl();

    const startSearch = () => {
        if (searchVal) {
            props.history.push(`/search.html?q=${searchVal}`);
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

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes['header-search-form']}>
            <label htmlFor="siminia-search-field" className="hidden">
                {formatMessage({ id: 'Search' })}
            </label>
            <input
                type="text"
                id="siminia-search-field"
                ref={e => {
                    searchField = e;
                }}
                placeholder={formatMessage({ id: 'search your product' })}
                onChange={() => handleSearchField()}
                onKeyPress={e => {
                    if (e.key === 'Enter') startSearch();
                }}
            />
            <div
                role="button"
                tabIndex="0"
                className={`${classes['search-icon']} ${
                    Identify.isRtl() ? 'search-icon-rtl' : ''
                }`}
                onClick={() => startSearch()}
                onKeyUp={() => startSearch()}
            >
                <Search style={{ width: 35, height: 35, display: 'block' }} />
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
    );
};
export default SearchForm;
