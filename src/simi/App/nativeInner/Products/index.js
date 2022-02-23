import React from 'react';
import Gallery from './Gallery';
import Identify from 'src/simi/Helper/Identify';
import Sortby from './Sortby';
import SortbyPrice from './SortbyPrice';
import Filter from './Filter';
import SimiPagination from 'src/simi/BaseComponents/SimiPagination';
// import SimiPagination from '@magento/venia-ui/lib/components/Pagination';
import Loading from 'src/simi/BaseComponents/Loading';
import LoadMore from './loadMore';
import NoProductsFound from './NoProductsFound';
import { useIntl } from 'react-intl';
import { useWindowSize } from '@magento/peregrine';
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import { Link } from 'react-router-dom';

require('./products.scss');

const Products = props => {
    const {
        data,
        filterData,
        isSignedIn,
        history,
        title,
        underHeader,
        type,
        loading,
        loadStyle,
        sortByData,
        pageType,
        pageSize,
        pageControl
    } = props;
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const { products } = data;
    const { total_count } = products;
    const { formatMessage } = useIntl();

    const renderFilter = () => {
        if (data && data.products && data.products.filters) {
            let maxPrice = data.products.maxPrice || null;
            // const minPrice = data.products.minPrice || null;
            const minPrice = 0; // default filter from zero
            const availableFilters = data.products.filters;
            let priceSeparator = '-';
            //get maxPrice from filter price option
            if (!maxPrice) {
                availableFilters.every((filterItem, filterItemIndx) => {
                    if (filterItem.request_var === 'price') {
                        maxPrice = 0;
                        if (filterItem.filter_items) {
                            filterItem.filter_items.map(filter_item => {
                                const newMaxPrice = filter_item.value_string.split(
                                    '_'
                                );
                                if (
                                    newMaxPrice &&
                                    newMaxPrice.length &&
                                    newMaxPrice[1] &&
                                    parseFloat(newMaxPrice[1]) > maxPrice
                                ) {
                                    priceSeparator = '_';
                                    maxPrice = parseFloat(newMaxPrice[1]);
                                }
                            });
                        }
                        if (maxPrice) delete availableFilters[filterItemIndx];
                        return false;
                    }
                    return true;
                });
            }
            return (
                <div>
                    <Filter
                        data={availableFilters}
                        filterData={filterData}
                        maxPrice={maxPrice}
                        minPrice={minPrice}
                        total_count={total_count ? total_count : 0}
                        priceSeparator={priceSeparator}
                        productsData={data}
                    />
                </div>
            );
        }
    };

    const renderLeftNavigation = () => {
        const shopby = [];
        const filter = renderFilter();
        if (filter) {
            shopby.push(
                <div
                    key="siminia-left-navigation-filter"
                    className="left-navigation"
                >
                    {filter}
                </div>
            );
        }
        return shopby;
    };

    const updateSetPage = newPage => {
        if (pageControl) {
            const { setPage, currentPage } = pageControl;
            if (
                newPage !== currentPage &&
                (newPage - 1) * pageSize < total_count
            )
                setPage(newPage);
        }
    };

    let itemCount = '';
    if (data && data.products && data.products.total_count) {
        const text =
            data.products.total_count > 1
                ? formatMessage({ id: 'items' })
                : formatMessage({ id: 'item' });
        itemCount = (
            <div
                className={`${Identify.isRtl() ? 'rtl-count' : ''} items-count`}
            >
                {data.products.total_count} {text}
            </div>
        );
    }
    const renderList = () => {
        const items = data ? data.products.items : null;
        if (!data) return <Loading />;

        return (
            <React.Fragment>
                <div className="product-list-top">
                    {isPhone ? (
                        ''
                    ) : (
                        <div className="items-count-ctn">{itemCount}</div>
                    )}
                    {/* <Sortby data={data} sortByData={sortByData} /> */}
                </div>
                <section className="gallery">
                    {!data.products || !data.products.total_count ? (
                        <div className="no-product">
                            <NoProductsFound />
                        </div>
                    ) : (
                        <Gallery items={items} history={history} />
                    )}
                </section>
                <div
                    className="product-grid-pagination"
                    style={{ marginBottom: 20 }}
                >
                    {loadStyle === 2 ? (
                        <SimiPagination
                            data={items}
                            itemCount={total_count}
                            pageControl={pageControl}
                            pageSize={pageSize}
                            showPageNumber={true}
                            showInfoItem={true}
                            itemsPerPageOptions={[12, 24, 36, 48, 60]}
                        />
                    ) : (
                        <LoadMore
                            updateSetPage={e => updateSetPage(e)}
                            itemCount={total_count}
                            items={products.items}
                            currentPage={pageControl.currentPage}
                            loading={loading}
                        />
                    )}
                </div>
            </React.Fragment>
        );
    };
    const renderCarouselChildCate = () => {
        let html = null;
        const { category } = data;
        if (
            category &&
            category.children &&
            category.children instanceof Array &&
            category.children.length
        ) {
            const mainCate = (
                <li key={category.id} className="active-item">
                    <Link
                        to={{
                            pathname: '/' + category.url_path + cateUrlSuffix(),
                            cateId: category.id
                        }}
                    >
                        {formatMessage({
                            id: `All ${category.name}`,
                            defaultMessage: `All ${category.name}`
                        })}
                    </Link>
                </li>
            );

            const listCates = category.children.map((cate, idx) => {
                const location = {
                    pathname: '/' + cate.url_path + cateUrlSuffix(),
                    cateId: cate.id
                };
                return (
                    <li key={cate.id}>
                        <Link to={location}>
                            {formatMessage({
                                id: `cateName`,
                                defaultMessage: cate.name
                            })}
                        </Link>
                    </li>
                );
            });
            html = (
                <ul className="carousel-child-cate">
                    {mainCate}
                    {listCates}
                </ul>
            );
        }
        return html;
    };
    return (
        <article className="products-root" id="root-product-list">
            <h1 className="title">
                <div className="categoryTitle">{title}</div>
            </h1>
            {isPhone ? itemCount : ''}
            <div className="product-list-container-siminia">
                {renderLeftNavigation()}
                <Sortby data={data} sortByData={sortByData} />
                {renderCarouselChildCate()}
                <div
                    className="listing-product"
                    style={{ display: 'inline-block', width: '100%' }}
                >
                    {renderList()}
                </div>
            </div>
        </article>
    );
};

export default Products;
