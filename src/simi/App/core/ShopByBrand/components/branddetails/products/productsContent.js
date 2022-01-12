import React, { Fragment, Suspense } from 'react';
import { array, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useProductsContent } from '../../../talons/useProductsContent';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import ProductSort from '@magento/venia-ui/lib/components/ProductSort';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import defaultClasses from './productsContent.module.css';
import GET_PRODUCT_FILTERS_BY_BRAND from '../../../queries/getProductFiltersByBrand.graphql';
import Button from '@magento/venia-ui/lib/components/Button';
import Gallery from 'src/simi/BaseComponents/Products/Gallery';
const FilterModal = React.lazy(() => import('@magento/venia-ui/lib/components/FilterModal'));

const ProductsContent = props => {
    const { brandId, data, pageControl, sortProps } = props;
    const [currentSort] = sortProps;
    const talonProps = useProductsContent({
        brandId,
        data,
        queries: {
            getProductFiltersByBrand: GET_PRODUCT_FILTERS_BY_BRAND
        }
    });
    
    const {
        filters,
        handleLoadFilters,
        handleOpenFilters,
        items,
        totalPagesFromData
    } = talonProps;
    console.log("iems", items);
    const classes = mergeClasses(defaultClasses, props.classes);

    // const maybeFilterButtons = filters ? (
    //     <Button
    //         priority={'low'}
    //         classes={{ root_lowPriority: classes.filterButton }}
    //         onClick={handleOpenFilters}
    //         onFocus={handleLoadFilters}
    //         onMouseOver={handleLoadFilters}
    //         type="button"
    //     >
    //         {'Filter'}
    //     </Button>
    // ) : null;

    const maybeSortButton = totalPagesFromData ? (
        <ProductSort sortProps={sortProps} />
    ) : null;

    const maybeSortContainer = totalPagesFromData ? (
        <div className={classes.sortContainer}>
            {'Items sorted by '}
            <span className={classes.sortText}>{currentSort.sortText}</span>
        </div>
    ) : null;

    // const modal = filters ? <FilterModal filters={filters} /> : null;
    
    const content = totalPagesFromData ? (
        <Fragment>
            <section className={classes.gallery}>
                <Gallery items={items} />
            </section>
            <div className={classes.pagination}>
                <Pagination pageControl={pageControl} />
            </div>
        </Fragment>
    ) : 
    <FormattedMessage
        id={'brand.NoProductFound'}
        defaultMessage={'No Product Found'}
    />;

    return (
        <Fragment>
            <article className={classes.root}>
                <div className={classes.headerBtn}>
                    {maybeSortButton}
                </div>
                {/* <div className={classes.sortedBy}>
                    {maybeSortContainer}
                </div> */}
                {content}
                {/* <Suspense fallback={null}>{modal}</Suspense> */}
            </article>

        </Fragment>
    );
};

export default ProductsContent;

ProductsContent.propTypes = {
    classes: shape({
        filterContainer: string,
        sortContainer: string,
        gallery: string,
        headerButtons: string,
        filterButton: string,
        pagination: string,
        root: string,
        title: string
    }),
    sortProps: array
};
