import React from 'react';
import { Redirect } from 'src/drivers';
import { useIntl } from 'react-intl';
import { compose } from 'redux';

import classify from 'src/classify';
import defaultClasses from './search.module.css';
import Products from 'src/simi/App/nativeInner/Products';
import { withRouter } from 'react-router-dom';
import CategoryContentShimmer from '@magento/venia-ui/lib/RootComponents/Category/categoryContent.shimmer';
import NoProductsFound from 'src/simi/BaseComponents/Products/NoProductsFound';
import { useSearchContentSimiPagination } from 'src/simi/talons/Search/useSearchContentSimiPagination';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Breadcrumbs from 'src/simi/BaseComponents/Breadcrumbs';

const Search = props => {
    const { classes, location, history } = props;
    const { formatMessage } = useIntl();

    const loadStyle = 2; // 1: button load-more, 2: pagination

    const talonProps = useSearchContentSimiPagination({
        location,
        parameter1: 'page',
        parameter2: 'product_list_limit',
        initialTotalPages: 1,
        defaultInitialPageSize: 299,
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

    const isMobileSite = window.innerWidth <= 768;

    if (!inputText) {
        <Redirect to="/" />;
    }

    if (error) return <div>{formatMessage({ id: 'Data Fetch Error' })}</div>;

    if (!products || !products.products) return <CategoryContentShimmer />;

    const breadcrumb = [
        { name: formatMessage({ id: 'Home' }), link: '/' },
        { name: formatMessage({ id: 'Search results for' }) + ' ' + inputText }
    ];
    const title = formatMessage({ id: 'Search results for' }) + ' ' + inputText;

    return (
        <div className={`${!isMobileSite ? classes['container'] : classes['bg-color']} `}>      
        <div className={`${classes.root} container simi-fadein`}>
            {TitleHelper.renderMetaHeader({ title })}
            <Breadcrumbs breadcrumb={breadcrumb} history={history} />
            {pageControl.totalPages > 0 ? (
                <Products
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
                />
            ) : (
                <NoProductsFound />
            )}
        </div>
        </div>
    );
};

export default compose(
    withRouter,
    classify(defaultClasses)
)(Search);
