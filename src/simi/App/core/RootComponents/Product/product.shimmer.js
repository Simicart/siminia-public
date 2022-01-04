import React, { Fragment, useMemo } from 'react';
import { string, shape } from 'prop-types';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { BreadcrumbShimmer } from '@magento/venia-ui/lib/components/Breadcrumbs';
import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.module.css';
import CarouselShimmer from '../../ProductImageCarousel/carousel.shimmer';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import { useStyle } from 'src/classify';

const ProductShimmer = props => {
    const { productType } = props;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className="container">
            <BreadcrumbShimmer />
            <div className={classes.root}>
                <section className={classes.title}>
                    <Shimmer width="100%" height={2} key="product-name" />
                </section>
                <section className={classes.imageCarousel}>
                    <CarouselShimmer />
                </section>
                <section
                    className={classes.options}
                    style={{ padding: '1.5rem' }}
                >
                    <div>
                        <Shimmer width="100%" height={4} />
                    </div>
                    <Shimmer width="100%" height={3} />
                    <Shimmer width="100%" height={3} />
                    <Shimmer width="100%" height={6} />
                </section>
                <section className={classes.description}>
                    <div className={classes.descriptionTitle}>
                        <Shimmer
                            width="100%"
                            height={1}
                            key="description-title"
                        />
                    </div>
                    <Shimmer width="100%" height={1} key="description-line-1" />
                    <Shimmer width="100%" height={1} key="description-line-2" />
                    <Shimmer width="100%" height={1} key="description-line-3" />
                </section>
                <section className={classes.details}>
                    <div className={classes.detailsTitle}>
                        <Shimmer width="100%" height={1} key="detail-title" />
                    </div>
                    <Shimmer width="100%" height={1} key="detail-value" />
                </section>
            </div>
        </div>
    );
};

ProductShimmer.defaultProps = {
    classes: {}
};

ProductShimmer.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string,
        unavailableContainer: string
    })
};

export default ProductShimmer;
