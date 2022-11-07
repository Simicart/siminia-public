import React, { useEffect, useRef, useState } from 'react';
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
import { useEventListener, useWindowSize } from '@magento/peregrine';
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import { Link } from 'react-router-dom';
import { BiFilterAlt } from 'react-icons/bi';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { ChevronDown, ChevronUp, ArrowRight } from 'react-feather';
import CategoryDesription from '../CategoryList/CategoryDescription';
import { useBrands } from '../ShopByBrand/talons/useBrands';
require('./products.scss');

let count = 0;
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
        pageControl,
        brandsData
    } = props;

    const brandsList =
        brandsData && brandsData.mpbrand && brandsData.mpbrand.items;
    const { category, products } = data;
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const isMobileSite = windowSize.innerWidth <= 768;
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
                <>
                    <Filter
                        data={availableFilters}
                        filterData={filterData}
                        maxPrice={maxPrice}
                        minPrice={minPrice}
                        total_count={total_count ? total_count : 0}
                        priceSeparator={priceSeparator}
                        productsData={data}
                    />
                </>
            );
        }
    };
    const renderShopByBrand = () => {
        return (
            <div className="brands">
                <div className="brand-heading">
                    <span className="brand-title">
                        {formatMessage({
                            id: 'Shop By Brand',
                            defaultMessage: `Shop By Brand`
                        })}
                    </span>
                    <span
                        className={`${
                            Identify.isRtl() ? 'view-all-rtl' : 'view-all'
                        }`}
                    >
                        <Link to={'/brands.html'}>
                            {formatMessage({
                                id: 'View All',
                                defaultMessage: 'View All'
                            })}
                        </Link>
                        <span className="arrow-right">
                            <MdOutlineKeyboardArrowRight />
                        </span>
                    </span>
                </div>
                {brandsList ? (
                    <div className="brands-list">
                        {brandsList
                            .filter((item, index) => index < 6)
                            .map(brand => {
                                const urlKey =
                                    '/brands/' +
                                    (brand.url_key
                                        ? brand.url_key
                                        : brand.default_value.toLowerCase()) +
                                    '.html';
                                return (
                                    <div key={brand.brand_id}>
                                        <Link to={urlKey}>
                                            <img
                                                width={109}
                                                height={46}
                                                src={brand.image}
                                                alt={brand.value}
                                            />
                                        </Link>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
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
                    {renderShopByBrand()}
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
    console.log('categorycategory', category);
    const renderList = () => {
        const items = data ? data.products.items : null;
        if (!data) return <Loading />;

        return (
            <React.Fragment>
                <div className="product-list-top">
                    <div className="category-title">{title}</div>
                    <div className="items-count-ctn">{itemCount}</div>
                    {windowSize.innerWidth > 768 ? (
                        <Sortby
                            showingDropdown={showingDropdown}
                            data={data}
                            sortByData={sortByData}
                        />
                    ) : (
                        ''
                    )}
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
                            itemsPerPageOptions={[12, 24, 36]}
                            pageSize={pageSize}
                            showPageNumber={true}
                            showInfoItem={true}
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
                console.log('location', location);
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

    const [showingDropdown, setShowDropdown] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const clickSortBy = () => {
        count = 0;
        setShowDropdown(!showingDropdown);
        setShowFilter(false);
    };
    const clickSortByPrice = () => {
        count++;
    };
    const clickFilter = () => {
        setShowFilter(!showFilter);
        setShowDropdown(false);
    };

    let topInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            topInsets = parseInt(simicartRNinsets.top);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            topInsets = parseInt(simpifyRNinsets.top);
        }
    } catch (err) {}
    const heightFixed = 54 + topInsets;

    const dropdownRef = useRef(null);
    const handleClickOutside = e => {
        if (
            showFilter &&
            dropdownRef &&
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target)
        ) {
            setShowFilter(false);
        }
    };
    useEventListener(globalThis, 'keydown', handleClickOutside);
    useEventListener(globalThis, 'mousedown', handleClickOutside);
    return (
        <article className="products-root" id="root-product-list">
            <h1 className="title">
                <div className="categoryTitle">{title}</div>
            </h1>
            {/* {windowSize.innerWidth > 768 ? (
                <div className={`${category ? 'wrapCategoryDesription' : ''}`}>
                    <CategoryDesription childCate={category} />
                </div>
            ) : (
                ''
            )} */}
            <div className="product-list-container-siminia">
                {/* {windowSize.innerWidth <= 768 ? (
                    <div
                        className={`${
                            category ? 'wrapCategoryDesription' : ''
                        }`}
                    >
                        <CategoryDesription childCate={category} />
                    </div>
                ) : (
                    ''
                )} */}
                <div style={{ top: heightFixed }} className="wrapper">
                    {windowSize.innerWidth > 768 ? (
                        ''
                    ) : (
                        <div className="sortby-filter">
                            <div className="product-list-filter">
                                <div
                                    className="wrap-top"
                                    onClick={() => clickFilter()}
                                >
                                    <span className="label">
                                        <span
                                            className={`${
                                                filterData === null
                                                    ? ''
                                                    : 'activeIconFilter'
                                            } icon-filter`}
                                        >
                                            <BiFilterAlt />
                                        </span>
                                        {formatMessage({
                                            id: 'filter',
                                            defaultMessage: 'Filter'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="product-list-sortby-price">
                                <div
                                    className="wrapActiveSortbyPrice"
                                    onClick={() => {
                                        clickSortByPrice();
                                    }}
                                >
                                    <SortbyPrice
                                        data={data}
                                        sortByData={sortByData}
                                    />
                                    {count > 0 ? (
                                        <div className="activeSortbyPrice" />
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>

                            <div className="product-list-sortby">
                                <div
                                    className="wrap-top"
                                    onClick={() => clickSortBy()}
                                >
                                    <span className="label">
                                        {formatMessage({
                                            id: 'sort by',
                                            defaultMessage: 'Sort by'
                                        })}
                                    </span>
                                    <span className="icon-dropdown">
                                        {showingDropdown ? (
                                            <ChevronUp size={15} />
                                        ) : (
                                            <ChevronDown size={15} />
                                        )}
                                    </span>
                                    {count === 0 ? (
                                        <div className="active" />
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {showingDropdown ? (
                        <Sortby
                            showingDropdown={showingDropdown}
                            data={data}
                            sortByData={
                                sortByData === null
                                    ? { position: 'ASC' }
                                    : sortByData
                            }
                        />
                    ) : (
                        ''
                    )}
                    {renderCarouselChildCate()}
                </div>
                {windowSize.innerWidth > 768 ? renderLeftNavigation() : ''}
                <div
                    ref={dropdownRef}
                    className={`${
                        showFilter ? 'activeFilter' : 'unActiveFilter'
                    }`}
                >
                    {renderLeftNavigation()}
                </div>
                <div
                    className={`${
                        category && category.children.length === 0
                            ? 'marginTop'
                            : ''
                    } listing-product`}
                    style={{ display: 'inline-block', width: '100%' }}
                >
                    {renderList()}
                </div>
            </div>
            {showFilter ? <div className="bg-white" /> : ''}
        </article>
    );
};

export default Products;
