import { useEffect, useMemo, useCallback } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';
import Identify from 'src/simi/Helper/Identify';
import {
    convertMagentoFilterToSimiFilter,
    convertSimiFilterInputToMagentoFilterInput
} from 'src/simi/Helper/Product';
import getQueryParameterValue from 'src/util/getQueryParameterValue';
import { useSimiPagination } from 'src/simi/talons/Pagination/useSimiPagination';

import {
    getSearchNoFilter,
    getFilterFromSearch
} from 'src/simi/queries/catalog_gql/search.gql'; //'src/simi/queries/catalog_gql/simiSearch.gql';

let sortByData = null;
let filterData = null;
// const loadedData = null;

// use pagination follow site magento default ( change both page and pagesize)
export const useSearchContentSimiPagination = props => {
    const {
        location,
        parameter1,
        parameter2,
        initialTotalPages,
        defaultInitialPageSize,
        defaultInitialPage
    } = props;

    const [paginationValues, paginationApi] = useSimiPagination({
        parameter1: parameter1,
        parameter2: parameter2,
        initialTotalPages: initialTotalPages,
        defaultInitialPageSize: defaultInitialPageSize,
        defaultInitialPage: defaultInitialPage
    });

    const {
        startPage,
        endPage,
        pageSize,
        currentPage,
        totalPages
    } = paginationValues;
    const {
        setStartPage,
        setEndPage,
        setCurrentPageAndLimit,
        setTotalPages
    } = paginationApi;

    sortByData = null;
    const productListOrder = Identify.findGetParameter('product_list_order');
    const productListDir = Identify.findGetParameter('product_list_dir');
    const newSortByData = productListOrder
        ? productListDir
            ? { [productListOrder]: productListDir.toUpperCase() }
            : { [productListOrder]: 'ASC' }
        : null;
    if (
        newSortByData &&
        (!sortByData || !ObjectHelper.shallowEqual(sortByData, newSortByData))
    ) {
        sortByData = newSortByData;
    }

    filterData = null;
    const productListFilter = Identify.findGetParameter('filter');
    if (productListFilter) {
        if (JSON.parse(productListFilter)) {
            filterData = productListFilter;
        }
    }

    const inputText = getQueryParameterValue({ location, queryParameter: 'q' });

    const [
        getProductsBySearch,
        { data: oriProductsData, error: error, loading: loading }
    ] = useLazyQuery(getSearchNoFilter, { fetchPolicy: 'no-cache' });
    const [getFilterBySearch, { data: oriFilterData }] = useLazyQuery(
        getFilterFromSearch
    );

    const variables = {
        pageSize: pageSize,
        currentPage: currentPage
    };

    if (inputText) {
        variables.inputText = inputText;
    }

    if (filterData) {
        variables.simiFilter = filterData ? filterData : '';
        variables.filters = convertSimiFilterInputToMagentoFilterInput(
            filterData ? JSON.parse(filterData) : {}
        );
    }
    if (sortByData) variables.sort = sortByData;

    useEffect(() => {
        if (inputText) {
            getProductsBySearch({ variables });
        }
    }, [
        inputText,
        getProductsBySearch,
        currentPage,
        pageSize,
        filterData,
        productListOrder,
        productListDir
    ]);

    useEffect(() => {
        if (inputText) {
            getFilterBySearch({ variables });
        }
    }, [inputText, getFilterBySearch]);

    const setPageTo = useCallback(
        (page, pageSize) => {
            setCurrentPageAndLimit(page, pageSize);
            document
                .getElementById('root-product-list')
                .scrollIntoView({ behavior: 'smooth' });
        },
        [setCurrentPageAndLimit]
    );

    const products = useMemo(() => {
        let productsData;
        if (oriProductsData)
            productsData = JSON.parse(JSON.stringify(oriProductsData));

        if (productsData && productsData.simiproducts) {
            productsData.products = productsData.simiproducts;
            productsData.products.filters = [];
            productsData.products.sort_fields = [];

            if (oriFilterData && oriFilterData.simiproducts) {
                if (oriFilterData.simiproducts.simi_filters) {
                    productsData.products.filters = JSON.parse(
                        JSON.stringify(oriFilterData.simiproducts.simi_filters)
                    );
                }
                if (oriFilterData.simiproducts.sort_fields) {
                    productsData.products.sort_fields = JSON.parse(
                        JSON.stringify(oriFilterData.simiproducts.sort_fields)
                    );
                }
            }
        } else if (productsData && productsData.products) {
            productsData.products.filters = [];
            productsData.products.sort_fields = [];
            if (oriFilterData && oriFilterData.products) {
                if (oriFilterData.products.aggregations) {
                    const newFilter = JSON.parse(
                        JSON.stringify(oriFilterData.products.aggregations)
                    );
                    productsData.products.filters = convertMagentoFilterToSimiFilter(
                        newFilter
                    );
                }
            }
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return productsData;
    }, [oriProductsData, oriFilterData]);

    const pageControl = {
        startPage,
        endPage,
        setStartPage,
        setEndPage,
        currentPage,
        setPageAndLimit: setPageTo,
        totalPages
    };

    const totalPagesFromData =
        products && products.products
            ? products.products.page_info.total_pages
            : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    const appliedFilter = filterData ? JSON.parse(productListFilter) : null;

    const cateEmpty =
        !appliedFilter &&
        products &&
        products.products &&
        products.products.total_count === 0
            ? true
            : false;

    return {
        products,
        error,
        loading,
        pageSize,
        sortByData,
        appliedFilter,
        cateEmpty,
        pageControl,
        inputText
    };
};
