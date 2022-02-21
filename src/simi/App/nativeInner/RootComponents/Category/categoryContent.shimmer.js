import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import BreadcrumbsShimmer from '@magento/venia-ui/lib/components/Breadcrumbs/breadcrumbs.shimmer';
import { FilterModalOpenButtonShimmer } from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { SortedByContainerShimmer } from '@magento/venia-ui/lib/components/SortedByContainer';
import defaultClasses from './category.module.css';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';

const CategoryContentShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const placeholderItems = Array.from({ length: 6 }).fill(null);

    return (
        <Fragment>
            <BreadcrumbsShimmer />
            <article className={classes.root}>
                <div className={classes.categoryHeader}>
                    <h1 className={classes.title}>
                        <div className={classes.categoryTitle}>
                            <Shimmer width={5} />
                        </div>
                    </h1>
                </div>
                <div className={classes.contentWrapper}>
                    <div className={classes.sidebar}>
                        <FilterSidebarShimmer />
                    </div>
                    <div className={classes.categoryContent}>
                        <div className={classes.heading}>
                            <div className={classes.categoryInfo}>
                                <Shimmer width={5} />
                            </div>
                            <SortedByContainerShimmer />
                        </div>
                        <section className={classes.gallery}>
                            <div
                                className={classes.galleryShimmerWrapper}
                                aria-live="polite"
                                aria-busy="true"
                            >
                                <div className={classes.galleryShimmerItems}>
                                    {placeholderItems.map((item, index) => (
                                        <div
                                            className={
                                                classes.galleryShimmerItem
                                            }
                                            aria-live="polite"
                                            aria-busy="true"
                                        >
                                            <Shimmer key="product-image">
                                                <Image
                                                    alt="Placeholder for gallery item image"
                                                    classes={{
                                                        image:
                                                            classes.galleryShimmerItemImage,
                                                        root:
                                                            classes.galleryShimmerItemImageContainer
                                                    }}
                                                    src={transparentPlaceholder}
                                                />
                                            </Shimmer>
                                            <Shimmer
                                                width="100%"
                                                key="product-name"
                                            />
                                            <Shimmer
                                                width={3}
                                                key="product-price"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

CategoryContentShimmer.defaultProps = {
    classes: {}
};

CategoryContentShimmer.propTypes = {
    classes: shape({
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string,
        gallery: string
    })
};

export default CategoryContentShimmer;
