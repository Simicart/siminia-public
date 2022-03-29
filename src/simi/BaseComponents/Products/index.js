import React from 'react';
import Gallery from './Gallery';
import Identify from 'src/simi/Helper/Identify';
import Sortby from './Sortby';
import Filter from './Filter';
import SimiPagination from 'src/simi/BaseComponents/SimiPagination';
// import SimiPagination from '@magento/venia-ui/lib/components/Pagination';
import Loading from 'src/simi/BaseComponents/Loading';
import LoadMore from './loadMore';
import NoProductsFound from './NoProductsFound';
import { useIntl } from 'react-intl';
import { useWindowSize } from '@magento/peregrine';
import CategoryDesription from '../../App/core/CategoryDescription';

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
    const { products, category } = data;
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
        console.log("propsss",props)
        return (
            <React.Fragment>
                <div className="product-list-top">
                    {isPhone ? (
                        ''
                    ) : (
                        <div className="items-count-ctn">{itemCount}</div>
                    )}
                    <Sortby data={data} sortByData={sortByData} />
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

    return (
        <article className="products-root" id="root-product-list">
            <h1 className="title">
                <div className="categoryTitle">{title}</div>
            </h1>
            {windowSize.innerWidth > 768 ? (
                <div className={`${category ? 'wrapCategoryDesription' : ''}`}>
                    <CategoryDesription childCate={category} />
                </div>
            ) : (
                ''
            )}
            {isPhone ? itemCount : ''}
            <div className="product-list-container-siminia">
                {windowSize.innerWidth <= 768 ? (
                    <div
                        className={`${
                            category ? 'wrapCategoryDesription' : ''
                        }`}
                    >
                        <CategoryDesription childCate={category} />
                    </div>
                ) : (
                    ''
                )}
                {renderLeftNavigation()}
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
