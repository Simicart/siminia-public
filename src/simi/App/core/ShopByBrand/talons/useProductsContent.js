import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const DRAWER_NAME = 'filter';
const pageSize = 6;
const placeholderItems = Array.from({ length: pageSize }).fill(null);

export const useProductsContent = props => {
    const {
        brandId,
        data,
        queries: { getProductFiltersByBrand }
    } = props;
    

    const [loadFilters, setLoadFilters] = useState(false);
    const [, { toggleDrawer }] = useAppContext();

    const handleLoadFilters = useCallback(() => {
        setLoadFilters(true);
    }, [setLoadFilters]);
    const handleOpenFilters = useCallback(() => {
        setLoadFilters(true);
        toggleDrawer(DRAWER_NAME);
    }, [setLoadFilters, toggleDrawer]);

    const [getFilters, { data: filterData }] = useLazyQuery(
        getProductFiltersByBrand
    );

    useEffect(() => {
        if (brandId) {
            getFilters({
                variables: {
                    brandConfigValue: {
                        eq: brandId
                    }
                }
            });
        }
    }, [brandId, getFilters]);

    const filters = filterData ? filterData.products.aggregations : null;
    const modedFilters = filters ? filters.filter(filterOption => {
        return filterOption.label.toLowerCase().indexOf('brands') === -1
    }) : null;
    
    const items = data ? data.products.items : placeholderItems;
    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;

    return {
        filters: modedFilters,
        handleLoadFilters,
        handleOpenFilters,
        items,
        loadFilters,
        totalPagesFromData
    };
};
