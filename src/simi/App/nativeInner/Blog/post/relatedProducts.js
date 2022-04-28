import React from 'react';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { GET_PRODUCTS_BY_SKUS } from '../../talons/Blog/Blog.gql';
import { useQuery } from '@apollo/client';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const RelatedProducts = props => {
    const { classes, items } = props;
    let skus = [];
    items.map(item => {
        skus.push(item.sku)
    })
    const { data: productItems, loading } = useQuery(GET_PRODUCTS_BY_SKUS,
        {
            variables: {
                skus: skus,
                pageSize: 999
            }
        })

    if (loading)
        return <LoadingIndicator />
    if (!productItems || !productItems.products || !productItems.products.items)
        return ''
    let classesToItem = JSON.parse(JSON.stringify(classes));
    classesToItem.root = classes.relatedProductRoot;
    return (
        <div className={`${classes.relatedProducts} ${classes.detailsSection}`}>
            <div className={classes.sectionHeader}>
                {`Related Products`}
            </div>
            <div className={classes.sectionContent}>
                {productItems.products.items.map(
                    (productitem, index) => <GalleryItem classes={classesToItem} item={mapGalleryItem(productitem)} key={index} />
                )}
            </div>
        </div>
    )
}

export default RelatedProducts;