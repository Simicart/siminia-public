import React from 'react';
import { useProducts } from 'src/simi/talons/TapitaPageBuilder/useProducts';
//import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import GalleryItem from './GalleryItem';
import defaultClasses from './list.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const ProductList = props => {
    const { item, formatMessage } = props;
    let filterData = { category_id: { eq: '6' } };
    let sortData;
    let pageSize = 12;
    if (item.dataParsed) {
        const { dataParsed } = item;
        if (dataParsed.openProductsWidthSKUs) {
            let openProductsWidthSKUs = item.dataParsed.openProductsWidthSKUs;
            openProductsWidthSKUs = openProductsWidthSKUs.trim();
            openProductsWidthSKUs = openProductsWidthSKUs.split(',');
            filterData = {
                sku: {
                    in: openProductsWidthSKUs
                }
            };
        } else if (dataParsed.openCategoryProducts) {
            filterData = {
                category_id: { eq: String(dataParsed.openCategoryProducts) }
            };
        }
        if (dataParsed.openProductsWidthSortAtt) {
            const directionToSort = dataParsed.openProductsWidthSortDir
                ? dataParsed.openProductsWidthSortDir.toUpperCase()
                : 'ASC';
            sortData = {};
            sortData[dataParsed.openProductsWidthSortAtt] = directionToSort;
        }
        if (dataParsed.openProductsWidthSortPageSize) {
            pageSize = parseInt(dataParsed.openProductsWidthSortPageSize);
        }
    }

    const { data, loading } = useProducts({ filterData, sortData, pageSize });
    const classes = mergeClasses(defaultClasses, props.classes);

    if (
        data &&
        data.products &&
        data.products.items &&
        data.products.items.length
    ) {
        const name = formatMessage({ val: item.name });
        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        marginBottom: 15,
                        justifyContent: 'space-between'
                    }}
                >
                    {name}
                </div>
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        flexWrap: 'nowrap',
                        overflow: 'auto'
                    }}
                >
                    {data.products.items.map((productItem, indx) => {
                        return (
                            <div
                                key={indx}
                                style={{
                                    minWidth: 260,
                                    display: 'inline-block',
                                    marginInlineEnd: 15
                                }}
                            >
                                <GalleryItem
                                    key={indx}
                                    item={mapGalleryItem(productItem)}
                                    classes={classes}
                                    formatMessage={formatMessage}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    } else if (loading) {
        return <LoadingIndicator />;
    }
    return '';
};

export default ProductList;
