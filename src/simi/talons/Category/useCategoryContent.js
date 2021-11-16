import { useEffect, useState, useMemo, useCallback } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';
import Identify from 'src/simi/Helper/Identify';
import {
    convertMagentoFilterToSimiFilter,
    convertSimiFilterInputToMagentoFilterInput
} from 'src/simi/Helper/Product';
let sortByData = null;
let filterData = null;
let loadedData = null;

import {
    getCateNoFilter,
    getFilterFromCate
} from 'src/simi/queries/catalog_gql/simiCategory.gql'; //'src/simi/queries/catalog_gql/category.gql';

export const useCategoryContent = props => {
    const { categoryId, productsPageDesktop, productsPagePhone } = props;

    const [thisPage, setThisPage] = useState(false);

    let pageSize = Identify.findGetParameter('product_list_limit');
    pageSize = pageSize
        ? Number(pageSize)
        : window.innerWidth < 1024
        ? productsPagePhone
        : productsPageDesktop;

    const paramPage = Identify.findGetParameter('page');
    const [currentPage, setCurrentPage] = useState(
        paramPage ? Number(paramPage) : 1
    );

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
    ] = useLazyQuery(getCateNoFilter);

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

    if (categoryId && !error && !loading && !oriProductsData) {
        getProductsByCategory({ variables });
        getFilterByCategory({ variables });
    }

    useEffect(() => {
        if (categoryId) {
            getProductsByCategory({ variables });
        }
    }, [categoryId, getProductsByCategory, currentPage, filterData]);

    useEffect(() => {
        if (categoryId) {
            getFilterByCategory({ variables });
        }
    }, [categoryId, getFilterByCategory, filterData]);

    const setPageTo = useCallback(
        page => {
            setCurrentPage(page);
            setThisPage(true);
        },
        [setCurrentPage, setThisPage]
    );

    const products = useMemo(() => {
        let productsData;
        if (oriProductsData && oriFilterData) {
            productsData = JSON.parse(JSON.stringify(oriProductsData));
            if (
                productsData &&
                (productsData.simiproducts || productsData.products)
            ) {
                if (productsData.simiproducts) {
                    productsData.products = productsData.simiproducts;
                }
                productsData.products.filters = [];
                productsData.products.sort_fields = [];
                if (oriFilterData && oriFilterData.simiproducts) {
                    if (oriFilterData.simiproducts.simi_filters) {
                        productsData.products.filters = JSON.parse(
                            JSON.stringify(
                                oriFilterData.simiproducts.simi_filters
                            )
                        );
                    }
                    if (oriFilterData.simiproducts.sort_fields) {
                        productsData.products.sort_fields = JSON.parse(
                            JSON.stringify(
                                oriFilterData.simiproducts.sort_fields
                            )
                        );
                    }
                } else if (oriFilterData && oriFilterData.products) {
                    if (oriFilterData.products.aggregations) {
                        const newFilter = JSON.parse(
                            JSON.stringify(oriFilterData.products.aggregations)
                        );
                        productsData.products.filters = convertMagentoFilterToSimiFilter(
                            newFilter
                        );
                    }
                }
                // concat data when load more button clicked
                const stringVar = JSON.stringify({
                    ...variables,
                    ...{ currentPage: 0 }
                });
                if (
                    !loadedData ||
                    !loadedData.vars ||
                    loadedData.vars !== stringVar
                ) {
                    loadedData = productsData;
                } else {
                    let loadedItems = loadedData.products.items;
                    const newItems = productsData.products.items;
                    loadedItems = loadedItems.concat(newItems);
                    for (var i = 0; i < loadedItems.length; ++i) {
                        for (var j = i + 1; j < loadedItems.length; ++j) {
                            if (
                                loadedItems[i] &&
                                loadedItems[j] &&
                                loadedItems[i].id === loadedItems[j].id
                            )
                                loadedItems.splice(j--, 1);
                        }
                    }
                    loadedData.products.items = loadedItems;
                }
                loadedData.vars = stringVar;
                if (
                    loadedData &&
                    loadedData.category &&
                    parseInt(loadedData.category.id) === parseInt(categoryId)
                )
                    return loadedData;

            } else if (loadedData && thisPage) {
                // keep previous data when click load more button
                return loadedData;
            }
        }
        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return productsData;
    }, [oriProductsData, categoryId, oriFilterData]);


    const totalPagesFromData =
        products && products.simiproducts
            ? products.simiproducts.page_info.total_pages
            : null;

    const pageControl = {
        currentPage,
        setPage: setPageTo,
        totalPages: totalPagesFromData
    };

    const appliedFilter = filterData ? JSON.parse(productListFilter) : null;

    const cateEmpty =
        !appliedFilter &&
        products &&
        products.simiproducts &&
        products.simiproducts.total_count === 0
            ? true
            : false;

    const cmsData =
        products && products.category && products.category.simiCategoryCms
            ? products.category.simiCategoryCms
            : null;

    return {
        products,
        error,
        loading,
        pageSize,
        sortByData,
        appliedFilter,
        cateEmpty,
        cmsData,
        pageControl
    };
};
