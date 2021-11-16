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

require('./products.scss');

const Products = props => {
    const {
        data,
        filterData,
        isSignedIn,
        history,
        title,
        cmsData,
        underHeader,
        type,
        loading,
        loadStyle,
        sortByData,
        pageType,
        pageSize,
        pageControl
    } = props;

    const { products } = data;
    const { total_count } = products;

    const renderFilter = () => {

        if (data && data.products && data.products.filters) {
            const maxPrice = data.products.maxPrice || null;
            // const minPrice = data.products.minPrice || null;
            const minPrice = 0; // default filter from zero
            return (
                <div>
                    <Filter
                        data={data.products.filters}
                        filterData={filterData}
                        maxPrice={maxPrice}
                        minPrice={minPrice}
                        total_count={total_count ? total_count : 0}
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

    const renderList = () => {
        const items = data ? data.products.items : null;
        if (!data) return <Loading />;

        return (
            <React.Fragment>
                <Sortby data={data} sortByData={sortByData} />
                <section className="gallery">
                    {!data.products || !data.products.total_count ? (
                        <div className="no-product">
                            <NoProductsFound />
                        </div>
                    ) : (
                            <Gallery
                                items={items}
                                history={history}
                            />
                        )}
                </section>
                <div className="product-grid-pagination" style={{ marginBottom: 20 }}>
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

    let itemCount = '';
    if (data && data.products && data.products.total_count) {
        const text =
            data.products.total_count > 1
                ? Identify.__('items')
                : Identify.__('item');
        itemCount = (
            <div className={`${Identify.isRtl() ? 'rtl-count' : ''} items-count`}>
                {data.products.total_count} {text}
            </div>
        );
    }

    return (
        <article className="products-root" id="root-product-list">
            <h1 className="title">
                <div className="categoryTitle">{title}</div>
            </h1>
            {itemCount}
            <div className="product-list-container-siminia">
                {renderLeftNavigation()}
                <div className="listing-product"
                    style={{ display: 'inline-block', width: '100%' }}>
                    {renderList()}
                </div>
            </div>
        </article>
    );
};

export default Products;
