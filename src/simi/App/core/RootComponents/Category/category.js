import React from 'react';
import { number } from 'prop-types';
import Identify from 'src/simi/Helper/Identify';
import { withRouter } from 'src/drivers';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import BreadCrumb from 'src/simi/BaseComponents/BreadCrumb';
import { cateUrlSuffix, resourceUrl } from 'src/simi/Helper/Url';
import Skeleton from 'react-loading-skeleton';
/* import { useCategoryContent } from 'src/simi/talons/Category/useCategoryContent'; */
import { useCategoryContentSimiPagination } from 'src/simi/talons/Category/useCategoryContentSimiPagination';
import CategoryHeader from './categoryHeader';
import NoProductsFound from 'src/simi/BaseComponents/Products/NoProductsFound';
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent';

//call chunked package along with API (for opimizing the package purpose)
const Products = props => {
    return (
        <LazyComponent
            component={() => import('src/simi/BaseComponents/Products')}
            {...props}
        />
    );
};

const Category = props => {
    const { id, history } = props;

    const loadStyle = 2; // 1: button load-more (useCategoryContent), 2: pagination (useCategoryContentSimiPagination)

    const talonProps = useCategoryContentSimiPagination({
        categoryId: id,
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
        cmsData,
        pageControl
    } = talonProps;

    if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

    if (!products || !products.category) {
        return (
            <div className="container simi-fadein">
                <article className="products-root">
                    <div className="title skeleton">
                        <Skeleton width="100%" height={30} />
                    </div>
                    <div className="items-count skeleton">
                        <Skeleton width="100%" height={22} />
                    </div>
                    <div className="product-list-container-siminia">
                        <div
                            key="siminia-left-navigation-filter"
                            className="left-navigation skeleton"
                        >
                            <Skeleton height={1218} />
                        </div>
                        <div className="listing-product">
                            <div className="top-sort-by-skeleton">
                                <Skeleton height={30} />
                            </div>
                            <section className="gallery">
                                <div className="gallery-root">
                                    <div className="gallery-items">
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-show"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-show"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-show"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-show"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="product-grid-pagination">
                                <Skeleton height={30} />
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    }

    const { category } = products;

    //breadcrumb
    const categoryTitle =
        category && category.name ? Identify.__(category.name) : '';
    let breadcrumb = [{ name: Identify.__('Home'), link: '/' }];
    if (props.breadcrumb) {
        breadcrumb = props.breadcrumb;
    } else {
        if (category && category.breadcrumbs instanceof Array) {
            let path = '';
            category.breadcrumbs.forEach(item => {
                path += '/' + item.category_url_key;
                breadcrumb.push({
                    name: Identify.__(item.category_name),
                    link: path + cateUrlSuffix()
                });
            });
        }
        breadcrumb.push({ name: Identify.__(category.name) });
    }
    const isApplyingFilter = window.location.search ? true : false;

    return (
        <div className="container">
            <BreadCrumb breadcrumb={breadcrumb} history={history} />
            {TitleHelper.renderMetaHeader({
                title: category.meta_title
                    ? Identify.__(category.meta_title)
                    : Identify.__(category.name),
                desc: category.meta_description
                    ? Identify.__(category.meta_description)
                    : null,
                meta_other: [
                    <meta
                        name="keywords"
                        content={
                            category.meta_keywords ? category.meta_keywords : ''
                        }
                        key="keywords"
                    />
                ]
            })}
            {category && category.name && category.image && (
                <CategoryHeader
                    name={category.name}
                    image_url={resourceUrl(category.image, {
                        type: 'image-category'
                    })}
                />
            )}
            {pageControl.totalPages === 0 && !isApplyingFilter ? (
                <NoProductsFound categoryId={id} />
            ) : (
                <Products
                    type={'category'}
                    title={categoryTitle}
                    history={history}
                    pageSize={pageSize}
                    data={products}
                    sortByData={sortByData}
                    filterData={appliedFilter}
                    loading={loading}
                    cmsData={cmsData}
                    loadStyle={loadStyle}
                    pageControl={pageControl}
                />
            )}
        </div>
    );
};

Category.propTypes = {
    id: number,
    pageSize: number
};

Category.defaultProps = {
    id: 3,
    pageSize: 12
};

export default withRouter(Category);
