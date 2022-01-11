import React from 'react'
import Brands from '../brands/brands'
import { useBrandCategory } from '../../talons/useBrandCategory'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useParams } from "react-router-dom";
import { FormattedMessage } from 'react-intl';

const Category = props => {
    const { categoryUrl = "" } = useParams();
    const { categoryData, categoryLoading } = useBrandCategory()

    if (categoryLoading)
        return fullPageLoadingIndicator;

    if (!categoryData || !categoryData.mpbrandCategories || !categoryData.mpbrandCategories.length)
        return (
            <FormattedMessage
                id={'brand.NoCategoryFound'}
                defaultMessage={'Cannot find category'}
            />
        )

    const urlKeyToFind = categoryUrl.replace('.html', '');
    let categoryInfo;
    categoryData.mpbrandCategories.map(
        mpbrandCategory => {
            if (mpbrandCategory.url_key === urlKeyToFind)
                categoryInfo = mpbrandCategory
        }
    )
    if (!categoryInfo || !categoryInfo.cat_id || !categoryInfo.name)
        return <FormattedMessage
            id={'brand.NoCategoryFound'}
            defaultMessage={'Cannot find category'}
        />
    return <Brands categoryId={categoryInfo.cat_id} categoryName={categoryInfo.name} />
}

export default Category