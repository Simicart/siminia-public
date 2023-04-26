import { useEffect, useMemo, useCallback } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';
import Identify from 'src/simi/Helper/Identify';
import {
    convertMagentoFilterToSimiFilter,
    convertSimiFilterInputToMagentoFilterInput
} from 'src/simi/Helper/Product';
import { useSimiPagination } from 'src/simi/talons/Pagination/useSimiPagination';
let sortByData = null;
let filterData = null;
import { GET_BRANDS_LIST } from '../../App/nativeInner/ShopByBrand/talons/Brand.gql';

import {
    getCateNoFilter,
    getFilterFromCate,
    getCateNoFilterGiftCard
} from 'src/simi/queries/catalog_gql/category.gql'; 

import {
    getCateNoFilter as getSimiCateNoFilter,
    getFilterFromCate as getSimiFilterFromCate,
    getCateNoFilterGiftCard as getSimiCateNoFilterGiftCard
} from 'src/simi/queries/catalog_gql/simiCategory.gql'; 
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useQuery } from '@apollo/client';

const shophByBrandEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND) === 1;

const connectorEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_CONNECTOR &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CONNECTOR) === 1;

import { useLocation } from 'react-router-dom';

// use pagination follow site magento default ( change both page and pagesize)
export const useCategoryContentSimiPagination = props => {
    const location = useLocation()
    const {
        categoryId,
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
    const [{ isSignedIn }] = useUserContext();
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

    const queryGetProductByCategory = connectorEnabled 
          ? (location.pathname === '/gift-card.html' ? getSimiCateNoFilterGiftCard : getSimiCateNoFilter) 
          : (location.pathname === '/gift-card.html' ? getCateNoFilterGiftCard : getCateNoFilter)
    const [
        getProductsByCategory,
        { data: oriProductsData, error: error, loading: loading }
    ] = useLazyQuery(queryGetProductByCategory);

    const queryGetFilterByCategory = connectorEnabled ? getSimiFilterFromCate : getFilterFromCate
    const [getFilterByCategory, { data: oriFilterData }] = useLazyQuery(
        queryGetFilterByCategory
    );

    const variables = {
        id: Number(categoryId),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(categoryId),
        filters: {}
    };
    if(isSignedIn) variables.signedIn = 'true' 
    if (filterData || categoryId) {
        variables.simiFilter = filterData ? filterData : '';
        variables.filters = convertSimiFilterInputToMagentoFilterInput(
            filterData ? JSON.parse(filterData) : {},
            categoryId
        );
    }
    if (sortByData) variables.sort = sortByData;

    if (categoryId && !error && !loading && !oriProductsData) {
        getProductsByCategory({ variables });
        getFilterByCategory({ variables });
    }


    const {
        data: brandsData,
        loading: brandsLoading,
        error: brandsError
    } = useQuery(GET_BRANDS_LIST, {
        variables: {
            pageSize: 199,
            currentPage: 1,
        },
        fetchPolicy:"cache-and-network",
        skip: !shophByBrandEnabled
    });


    useEffect(() => {
        if (categoryId) {
            getProductsByCategory({ variables });
        }
    }, [
        categoryId,
        getProductsByCategory,
        currentPage,
        pageSize,
        filterData,
        productListOrder,
        productListDir
    ]);

    useEffect(() => {
        if (categoryId) {
            getFilterByCategory({ variables });
        }
    }, [categoryId, getFilterByCategory, filterData]);

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
        pageControl,
        brandsData,
        brandsLoading,
        brandsError
    };
};
