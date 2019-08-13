import React from 'react';
import Identify from 'src/simi/Helper/Identify'
import { Redirect } from 'src/drivers';
import {Simiquery} from 'src/simi/Network/Query'
import gql from 'graphql-tag';

import classify from 'src/classify';
import getQueryParameterValue from 'src/util/getQueryParameterValue';
import Loading from 'src/simi/BaseComponents/Loading'
import defaultClasses from './search.css';
import PRODUCT_SEARCH from 'src/simi/queries/catalog/productSearch.graphql';
import Products from 'src/simi/BaseComponents/Products'
import CloseIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Close';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {applySimiProductListItemExtraField} from 'src/simi/Helper/Product'

var sortByData = null
var filterData = null

const getCategoryNameQr = gql`
    query getCategoryName($id: Int!) {
        category(id: $id) {
            name
        }
    }
`;

const Search = props => {
    const { classes, location, history } = props;
    
    let currentPage = Identify.findGetParameter('page')
    currentPage = currentPage?Number(currentPage):1
    let pageSize = Identify.findGetParameter('product_list_limit')
    pageSize = pageSize?Number(pageSize):window.innerWidth < 1024?12:24
    sortByData = null
    const productListOrder = Identify.findGetParameter('product_list_order')
    const productListDir = Identify.findGetParameter('product_list_dir')
    const newSortByData = productListOrder?productListDir?{[productListOrder]: productListDir.toUpperCase()}:{[productListOrder]: 'ASC'}:null
    if (newSortByData && (!sortByData || !ObjectHelper.shallowEqual(sortByData, newSortByData))) {
        sortByData = newSortByData
    }
    filterData = null
    const productListFilter = Identify.findGetParameter('filter')
    if (productListFilter) {
        if (JSON.parse(productListFilter)){
            filterData = productListFilter
        }
    }

    const inputText = getQueryParameterValue({
        location,
        queryParameter: 'query'
    });
    const categoryId = getQueryParameterValue({
        location,
        queryParameter: 'category'
    });

    if (!inputText) {
        return <Redirect to="/" />;
    }

    const queryVariable = categoryId
        ? { inputText, categoryId }
        : { inputText };

    queryVariable.pageSize = pageSize
    queryVariable.currentPage = currentPage
    if (filterData)
        queryVariable.simiFilter = filterData
    if (sortByData)
        queryVariable.sort = sortByData

    const handleClearCategoryFilter = () => {
        history.push(`/search.html?query=${inputText}`) 
    }

    const getCategoryName = (categoryId, classes) => (
        <div className={classes.categoryFilters}>
            <button
                className={classes.categoryFilter}
                onClick={handleClearCategoryFilter}
            >
                <small className={classes.categoryFilterText}>
                    <Simiquery
                        query={getCategoryNameQr}
                        variables={{ id: categoryId }}
                    >
                        {({ loading, error, data }) => {
                            if (error) return null;
                            if (loading) return 'Loading...';
                            return data.category.name;
                        }}
                    </Simiquery>
                </small>
                <CloseIcon
                    style={{width: 12, height: 13}}
                />
            </button>
        </div>
    );

    return (
        <Simiquery query={PRODUCT_SEARCH} variables={queryVariable}>
            {({ loading, error, data }) => {
                if (error) return <div>Data Fetch Error</div>;
                if (loading) return <Loading />;

                if (data) {
                    data.products = applySimiProductListItemExtraField(data.simiproducts)
                    if (data.products.simi_filters)
                        data.products.filters = data.products.simi_filters
                }
            
                if (data.products.items.length === 0)
                    return (
                        <div className={classes.noResult}>
                            No results found!
                        </div>
                    );
                    
                const title = Identify.__(`Search results for '%s'`).replace('%s', inputText);

                return (
                    <div className={`${classes.root} container`}>
                        <div className={classes.categoryTop}>
                            {categoryId &&
                                getCategoryName(categoryId, classes)}
                        </div>
                        <Products
                            title={title}
                            history={props.history}
                            location={props.location}
                            classes={classes}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            data={loading ? null : data}
                            sortByData={sortByData}
                            filterData={filterData?JSON.parse(productListFilter):null}
                        />
                    </div>
                );
            }}
        </Simiquery>
    );
}

export default compose(withRouter, classify(defaultClasses))(Search);
