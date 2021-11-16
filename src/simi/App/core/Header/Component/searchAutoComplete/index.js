import React, { useEffect, useRef, useMemo } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';

import { mergeClasses } from 'src/classify';
import {
    getSearchNoFilter as searchQuery,
    getFilterFromSearch
} from 'src/simi/queries/catalog_gql/search.gql';
import { convertMagentoFilterToSimiFilter } from 'src/simi/Helper/Product';
import Suggestions from './suggestions';
import Close from 'src/simi/BaseComponents/Icon/TapitaIcons/Close';
import defaultClasses from './searchAutoComplete.css';
import Identify from 'src/simi/Helper/Identify';
import debounce from 'lodash.debounce';

function useOutsideAlerter(ref, setVisible) {
    function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target) && setVisible) {
            if (setVisible) setVisible(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });
}

const SearchAutoComplete = props => {
    const { setVisible, visible, value } = props;

    //handle click outsite
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setVisible);

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = visible ? classes.root_visible : classes.root_hidden;
    let message = '';

    // Prepare to run the queries.
    const [runSearch, productResult] = useLazyQuery(searchQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const [runSearchFilter, { data: filterResult }] = useLazyQuery(
        getFilterFromSearch
    );

    // Create a debounced function so we only search some delay after the last
    // keypress.
    const debouncedRunQuery = useMemo(
        () =>
            debounce(inputText => {
                runSearch({ variables: { inputText } });
                runSearchFilter({ variables: { inputText } });
            }, 500),
        [runSearch]
    );

    // run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (visible) {
            debouncedRunQuery(value);
        }
    }, [debouncedRunQuery, value, visible]);

    const { data: oriData, error, loading } = productResult;

    const data = useMemo(() => {
        let returnData;
        if (oriData) {
            returnData = JSON.parse(JSON.stringify(oriData));
            if (returnData.simiproducts)
                returnData.products = returnData.simiproducts;
            if (
                filterResult &&
                filterResult.simiproducts &&
                filterResult.simiproducts.simi_filters
            ) {
                returnData.products.filters = JSON.parse(
                    JSON.stringify(filterResult.simiproducts.simi_filters)
                );
            } else if (
                filterResult &&
                filterResult.products &&
                filterResult.products.aggregations
            ) {
                const newFilter = JSON.parse(
                    JSON.stringify(filterResult.products.aggregations)
                );
                returnData.products.filters = convertMagentoFilterToSimiFilter(
                    newFilter
                );
            }
        }
        return returnData;
    }, [oriData, filterResult]);

    if (error) {
        message = Identify.__('An error occurred while fetching results.');
    } else if (loading) {
        message = Identify.__('Fetching results...');
    } else if (!data) {
        message = Identify.__('Search for a product');
    } else if (!data.products.items.length) {
        message = Identify.__('No results were found.');
    } else {
        message = Identify.__('%s items').replace(
            '%s',
            data.products.items.length
        );
    }

    return (
        <div className={rootClassName} ref={wrapperRef}>
            <div
                role="button"
                tabIndex="0"
                className={classes['close-icon']}
                onClick={() => setVisible(false)}
                onKeyUp={() => setVisible(false)}
            >
                <Close style={{ width: 14, height: 14, display: 'block' }} />
            </div>
            <div className={classes.message}>{message}</div>
            <div className={classes.suggestions}>
                <Suggestions
                    products={data ? data.products : {}}
                    searchValue={value}
                    setVisible={setVisible}
                    visible={visible}
                />
            </div>
        </div>
    );
};

export default SearchAutoComplete;

SearchAutoComplete.propTypes = {
    classes: shape({
        message: string,
        root_hidden: string,
        root_visible: string,
        suggestions: string
    }),
    setVisible: func,
    visible: bool
};
