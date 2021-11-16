import React from 'react';
import {useProducts} from 'src/simi/talons/TapitaPageBuilder/useProducts';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./scroll.css";
//import GalleryItem from "@magento/venia-ui/lib/components/Gallery/item";
import GalleryItem from './GalleryItem';
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {mapGalleryItem} from "./grid";
import {CarefreeHorizontalScroll} from "../CarefreeHorizontalScroll/CarefreeHorizontalScroll";

export const ProductScroll = (props) => {
    const {item} = props;
    let filterData = {category_id: {eq: '6'}};
    let sortData;
    let pageSize = 8;
    if (item.dataParsed) {
        const {dataParsed} = item;
        if (dataParsed.openProductsWidthSKUs) {
            let openProductsWidthSKUs = item.dataParsed.openProductsWidthSKUs;
            openProductsWidthSKUs = openProductsWidthSKUs.trim();
            openProductsWidthSKUs = openProductsWidthSKUs.split(",");
            filterData = {
                sku: {
                    in: openProductsWidthSKUs
                }
            }
        } else if (dataParsed.openCategoryProducts) {
            filterData = {category_id: {eq: String(dataParsed.openCategoryProducts)}};
        }
        if (dataParsed.openProductsWidthSortAtt) {
            const directionToSort = dataParsed.openProductsWidthSortDir ? dataParsed.openProductsWidthSortDir.toUpperCase() : 'ASC';
            sortData = {};
            sortData[dataParsed.openProductsWidthSortAtt] = directionToSort;
        }
        if (dataParsed.openProductsWidthSortPageSize) {
            pageSize = parseInt(dataParsed.openProductsWidthSortPageSize);
        }
    }

    const {data, loading} = useProducts({filterData, sortData, pageSize});
    const classes = mergeClasses(defaultClasses, props.classes);

    if (data && data.products && data.products.items && data.products.items.length) {
        const products = data.products.items.map((productItem, indx) => {
            return <GalleryItem key={indx} item={mapGalleryItem(productItem)} classes={classes}/>
        })

        return (
            <CarefreeHorizontalScroll item={item}>
                {products}
            </CarefreeHorizontalScroll>
        )
    } else if (loading) {
        return <LoadingIndicator/>
    }
    return ''
};

