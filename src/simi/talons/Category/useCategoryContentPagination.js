import { useEffect, useMemo, useCallback } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';
import Identify from 'src/simi/Helper/Identify';
import { usePagination } from '@magento/peregrine';
import {
    convertMagentoFilterToSimiFilter,
    convertSimiFilterInputToMagentoFilterInput
} from 'src/simi/Helper/Product';

import {
    getCateNoFilter,
    getFilterFromCate,
    getCateNoFilterGiftCard
} from 'src/simi/queries/catalog_gql/simiCategory.gql'; //'src/simi/queries/catalog_gql/category.gql';

let sortByData = null;
let filterData = null;

import { useLocation } from 'react-router-dom';

// use default venia pagination ( only change page, not change pagesize)
export const useCategoryContentPagination = props => {
    const { categoryId, productsPageDesktop, productsPagePhone } = props;
    const location = useLocation()

    const [paginationValues, paginationApi] = usePagination();
    let pageSize = Identify.findGetParameter('product_list_limit');
    pageSize = pageSize
        ? Number(pageSize)
        : window.innerWidth < 1024
        ? productsPagePhone
        : productsPageDesktop;

    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

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

    const [
        getProductsByCategory,
        { data: oriProductsData, error: error, loading: loading }
    ] = useLazyQuery(location.pathname === '/gift-card.html' ? getCateNoFilterGiftCard : getCateNoFilter);

    const [getFilterByCategory, { data: oriFilterData }] = useLazyQuery(
        getFilterFromCate
    );

    const variables = {
        id: Number(categoryId),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(categoryId),
        filters: {}
    };
    if (filterData || categoryId) {
        variables.simiFilter = filterData ? filterData : '';
        variables.filters = convertSimiFilterInputToMagentoFilterInput(
            filterData ? JSON.parse(filterData) : {},
            categoryId
        );
    }

    if (sortByData) variables.sort = sortByData;

    useEffect(() => {
        if (categoryId) {
            getProductsByCategory({ variables });
        }
    }, [categoryId, getProductsByCategory, currentPage]);

    useEffect(() => {
        if (categoryId) {
            getFilterByCategory({ variables });
        }
    }, [categoryId, getFilterByCategory, filterData]);

    const setPageTo = useCallback(
        page => {
            setCurrentPage(page);
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        },
        [setCurrentPage]
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
        currentPage,
        setPage: setPageTo,
        totalPages
    };

    const totalPagesFromData =
        products && products.simiproducts
            ? products.simiproducts.page_info.total_pages
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
        products.simiproducts &&
        products.simiproducts.total_count === 0
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
        pageControl
    };
};
