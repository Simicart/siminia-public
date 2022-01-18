import React from 'react'
import Brands from '../brands/brands'
import { useBrandCategory } from '../../talons/useBrandCategory'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useParams } from "react-router-dom";
import { FormattedMessage } from 'react-intl';
import { Helmet } from "react-helmet";

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
    return (<>
        {categoryInfo.meta_title &&
            <Helmet>
                <title>{categoryInfo.meta_title}</title>
            </Helmet>
        }
        {categoryInfo.meta_keywords &&
            <Helmet>
                <meta name="keywords" content={categoryInfo.meta_keywords} />
            </Helmet>
        }
        {categoryInfo.meta_description &&
            <Helmet>
                <meta name="description" content={categoryInfo.meta_description} />
            </Helmet>
        }
        <Brands categoryId={categoryInfo.cat_id} categoryName={categoryInfo.name} />
    </>)
}

export default Category