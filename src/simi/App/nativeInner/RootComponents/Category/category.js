import React from 'react';
import { number } from 'prop-types';
import { withRouter } from 'src/drivers';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Breadcrumbs from 'src/simi/BaseComponents/Breadcrumbs';
import { resourceUrl, cateUrlSuffix } from 'src/simi/Helper/Url';
import CategoryContentShimmer from './categoryContent.shimmer';
/* import { useCategoryContent } from 'src/simi/talons/Category/useCategoryContent'; */
import { useCategoryContentSimiPagination } from 'src/simi/talons/Category/useCategoryContentSimiPagination';
import CategoryHeader from './categoryHeader';
import SeoBasic from '../../../core/SeoBasic';
import CanonicalBasic from '../../../core/SeoBasic/CanonicalBasic';
import MarkupCategoryBasic from '../../../core/SeoBasic/Markup/Category';
import NoProductsFound from 'src/simi/BaseComponents/Products/NoProductsFound';
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent';
import { useIntl } from 'react-intl';
// import Seo from '../../Seo';
import Canonical from '../../../core/Seo/Canonical';
import MarkupCategory from '../../../core/Seo/Markup/Category';
import Seo from '../../../core/Seo';
require('./category.scss');

const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

//call chunked package along with API (for opimizing the package purpose)
const Products = props => {
    return (
        <LazyComponent
            component={() => import('src/simi/App/nativeInner/Products')}
            {...props}
        />
    );
};

const Category = props => {
    const { id, history } = props;
    const { formatMessage } = useIntl();

    const loadStyle = 2; // 1: button load-more (useCategoryContent), 2: pagination (useCategoryContentSimiPagination)

    const talonProps = useCategoryContentSimiPagination({
        categoryId: id,
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
        pageControl
    } = talonProps;

    if (error) return <div>{formatMessage({ id: 'Data Fetch Error' })}</div>;

    if (!products || !products.category) {
        return (
            <div className="container">
                <CategoryContentShimmer />
            </div>
        );
    }

    const isMobileSite = window.innerWidth <= 768;

    const { category, mageworx_canonical_url } = products;

    const isApplyingFilter = window.location.search ? true : false;

    const categoryTitle = category && category.name ? category.name : '';
    let breadcrumb = [{ name: formatMessage({ id: 'Home' }), link: '/' }];
    if (props.breadcrumb) {
        breadcrumb = props.breadcrumb;
    } else {
        if (category && category.breadcrumbs instanceof Array) {
            let path = '';
            category.breadcrumbs.forEach(item => {
                path += '/' + item.category_url_key;
                breadcrumb.push({
                    name: item.category_name,
                    link: path + cateUrlSuffix()
                });
            });
        }
        breadcrumb.push({ name: category.name });
    }

    return (
        <div className={`${!isMobileSite ? 'container' : 'bg-color'} `}>
            {mageworxSeoEnabled ? (
                <>
                    <Seo pageType="CATEGORY" />
                    <Canonical url={mageworx_canonical_url} type="CATEGORY" />
                    <MarkupCategory category={category} />
                </>
            ) : (
                <>
                    <SeoBasic pageType="CATEGORY" />
                    <CanonicalBasic
                        url={mageworx_canonical_url}
                        type="CATEGORY"
                    />
                    <MarkupCategoryBasic category={category} />
                </>
            )}

            {!isMobileSite && breadcrumb && breadcrumb.length ? (
                <div style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                    <Breadcrumbs breadcrumb={breadcrumb} />
                </div>
            ) : (
                ''
            )}
            {TitleHelper.renderMetaHeader({
                title: category.meta_title
                    ? category.meta_title
                    : category.name,
                desc: category.meta_description
                    ? category.meta_description
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
