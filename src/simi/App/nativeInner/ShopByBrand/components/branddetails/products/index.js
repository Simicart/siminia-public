import React, { useEffect, useMemo, useRef, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { number, shape, string } from 'prop-types';
import { useLazyQuery, useQuery } from '@apollo/client';
import { usePagination, useSort } from '@magento/peregrine';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

// import ProductsContent from './productsContent';
import defaultClasses from '@magento/venia-ui/lib/RootComponents/Category/category.module.css';
import {
    getFiltersFromSearch,
    getFilterInput
} from '@magento/peregrine/lib/talons/FilterModal/helpers';
import { useCategoryContentSimiPagination } from 'src/simi/talons/Category/useCategoryContentSimiPagination';
import {GET_BRAND_PRODUCTS} from '../../../talons/Brand.gql';
import FILTER_INTROSPECTION from '../../../queries/filterIntrospectionQuery.graphql';
import { LazyComponent } from '../../../../../../BaseComponents/LazyComponent';
const ProductsContent = props => {
    return (
        <LazyComponent
            component={() => import('src/simi/App/nativeInner/Products')}
            {...props}
        />
    );
};
const Products = props => {
    const { option_id, pageSize, page_title } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const sortProps = useSort();
  
    const [currentSort] = sortProps;

    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [runQuery, queryResponse] = useLazyQuery(GET_BRAND_PRODUCTS);
    const { loading, error, data } = queryResponse;
    const { search } = useLocation();
   
    
    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const { data: introspectionData } = useQuery(FILTER_INTROSPECTION);
    
    // Create a type map we can reference later to ensure we pass valid args
    // to the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size) {
            return;
        }

        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });
        newFilters['manufacturer'] = { eq: String(option_id) };
     
        runQuery({
            variables: {
                currentPage: Number(currentPage),
                filters: newFilters,
                pageSize: Number(pageSize),
                sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
            }
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [
        currentPage,
        currentSort,
        filterTypeMap,
        option_id,
        pageSize,
        runQuery,
        search
    ]);

    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !loading && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, loading, setCurrentPage]);

    // Reset the current page back to one (1) when the search string, filters
    // or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !==
                currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !==
                currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1);
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, previousSearch, search, setCurrentPage]);

    if (error && currentPage === 1 && !loading) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
        return <div>Data Fetch Error</div>;
    }

    // Show the loading indicator until data has been fetched.
    if (totalPagesFromData === null) {
        return fullPageLoadingIndicator;
    }

    return (
        <Fragment>
            {/* <ProductsContent
                brandId={option_id}
                classes={classes}
                data={loading ? null : data}
                pageControl={pageControl}
                sortProps={sortProps}
            /> */}
            <ProductsContent
                    type={'category'}
                    title={page_title}
                    history={history}
                    pageSize={pageSize}
                    data={data}
                    sortByData={sortProps}
                    // filterData={appliedFilter}
                    loading={loading}
                    loadStyle={2}
                    pageControl={pageControl}
                />
        </Fragment>
    );
};

Products.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    pageSize: number
};

Products.defaultProps = {
    pageSize: 299
};

export default Products;
