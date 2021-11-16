import { useCallback, useMemo, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';

/**
 * Sets a query parameter in history. Attempt to use React Router if provided
 * otherwise fallback to builtins.
 *
 * @private
 */
const setQueryParam = ({
    history,
    location,
    parameter1,
    parameter2,
    value1,
    value2
}) => {
    const { search } = location;
    const queryParams = new URLSearchParams(search);
    queryParams.set(parameter1, value1);
    queryParams.set(parameter2, value2);

    if (history.push) {
        history.push({ search: queryParams.toString() });
    } else {
        // Use the native pushState. See https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
        history.pushState('', '', `?${queryParams.toString()}`);
    }
};

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that provides
 * pagination logic.
 *
 * Use this hook to implement components that need to navigate through paged
 * data.
 *
 * @kind function
 *
 * @param {Object} config An object containing configuration values
 *
 * @param {String} config.namespace='' The namespace to append to config.parameter in the query. For example: ?namespace_parameter=value
 * @param {String} config.parameter='page' The name of the query parameter to use for page
 * @param {Number} config.initialPage The initial current page value
 * @param {Number} config.intialTotalPages=1 The total pages expected to be usable by this hook
 *
 * @return {Object[]} An array with two entries containing the following content: [ {@link PaginationState}, {@link API} ]
 */
export const useSimiPagination = (props = {}) => {
    const {
        namespace = '',
        parameter1,
        parameter2,
        initialTotalPages,
        defaultInitialPageSize,
        defaultInitialPage
    } = props;

    const searchParam1 = namespace ? `${namespace}_${parameter1}` : parameter1;
    const searchParam2 = namespace ? `${namespace}_${parameter2}` : parameter2;

    const history = useHistory();
    const location = useLocation();

    // Fetch the initial pagesize value from location to avoid initializing twice.
    const initialPageSize =
        props.initialPageSize ||
        parseInt(
            getSearchParam(searchParam2, location) || defaultInitialPageSize
        );

    // Fetch the initial page value from location to avoid initializing twice.
    const initialPage =
        props.initialPage ||
        parseInt(getSearchParam(searchParam1, location) || defaultInitialPage);

    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(startPage + 4);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(initialTotalPages);

    const setPageAndLimit = useCallback(
        (page, pageSize) => {
            // Update the query parameter.
            setQueryParam({
                location,
                history,
                parameter1: searchParam1,
                value1: page,
                parameter2: searchParam2,
                value2: pageSize
            });

            // Update the state object.
            setCurrentPage(page);
            setPageSize(pageSize);
        },
        [history, location, searchParam1, searchParam2]
    );

    useEffect(() => {
        if (initialPage !== currentPage) {
            setCurrentPage(initialPage);
            setPageSize(initialPageSize);
        }
    }, [currentPage, initialPage, initialPageSize]);

    /**
     * The current pagination state
     *
     * @typedef PaginationState
     *
     * @kind Object
     *
     * @property {Number} startPage The number position of start page
     * @property {Number} endPage The number position of end page
     * @property {Number} pageSize The number items of current page
     * @property {Number} currentPage The current page number
     * @property {Number} totalPages The total number of pages
     */
    const paginationState = {startPage, endPage, pageSize, currentPage, totalPages };

    /**
     * The API object used for modifying the PaginationState.
     *
     * @typedef API
     *
     * @kind Object
     */
    /**
     * Set the current page
     *
     * @function API.setCurrentPage
     *
     * @param {Number} page The number to assign to the current page
     */
    /**
     * Set the total number of pages
     *
     * @function API.setTotalPages
     *
     * @param {Number} total The number to set the amount of pages available
     */
    const api = useMemo(
        () => ({
            setStartPage: setStartPage,
            setEndPage: setEndPage,
            setCurrentPageAndLimit: setPageAndLimit,
            setTotalPages,
        }),
        [setPageAndLimit, setTotalPages]
    );

    return [paginationState, api];
};
