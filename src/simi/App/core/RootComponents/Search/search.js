import React from 'react';
import { Redirect } from 'src/drivers';
import { compose } from 'redux';

import classify from 'src/classify';
import Identify from 'src/simi/Helper/Identify';
import defaultClasses from './search.css';
import Products from 'src/simi/BaseComponents/Products';
import { withRouter } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import NoProductsFound from 'src/simi/BaseComponents/Products/NoProductsFound';
import { useSearchContentSimiPagination } from 'src/simi/talons/Search/useSearchContentSimiPagination';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb";

const Search = props => {
    const { classes, location, history } = props;

    const loadStyle = 2; // 1: button load-more, 2: pagination

    const talonProps = useSearchContentSimiPagination({
        location,
        parameter1: 'page',
        parameter2: 'product_list_limit',
        initialTotalPages: 1,
        defaultInitialPageSize: 12,
        defaultInitialPage: 1
    });

    const {
        products,
        error,
        loading,
        pageSize,
        sortByData,
        appliedFilter,
        cateEmpty,
        pageControl,
        inputText
    } = talonProps;

    if (!inputText) {
        <Redirect to="/" />;
    }

    if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

    if (!products || !products.products)
        return (
            <div className="container simi-fadein">
                <article className="products-gallery-root">
                    <Skeleton width="100%" height={50} />
                    <div className="product-list-container-siminia">
                        <div key="siminia-left-navigation-filter"
                            className="left-navigation" ><Skeleton height={600} /></div>
                        <div className="listing-product">
                            <div className={`result-title`}><Skeleton count={3} /></div>
                            <section className="gallery">
                                <div className="gallery-root">
                                    <div className="gallery-items">
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                    </div>
                                </div>
                            </section>
                            <div className="product-grid-pagination">
                                <Skeleton />
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );

    const breadcrumb = [{ name: Identify.__("Home"), link: '/' }, { name: Identify.__("Search") }, { name: Identify.__("Search results for: '" + inputText + "'"), link: '/search.html?q=' + inputText }];
    const title = Identify.__(`Search results for: '%s'`).replace('%s', inputText);

    return (<div className={`${classes.root} container simi-fadein`}>
        {TitleHelper.renderMetaHeader({ title })}
        <BreadCrumb breadcrumb={breadcrumb} history={history} />
        {pageControl.totalPages > 0 ? <Products
            type={'category'}
            title={title}
            history={history}
            pageSize={pageSize}
            data={products}
            sortByData={sortByData}
            filterData={appliedFilter}
            loading={loading}
            loadStyle={loadStyle}
            pageControl={pageControl}
        /> : <NoProductsFound />}
    </div>);
}

export default compose(withRouter, classify(defaultClasses))(Search);
