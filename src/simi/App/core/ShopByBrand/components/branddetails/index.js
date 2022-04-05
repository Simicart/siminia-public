import React from "react";
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useParams } from "react-router-dom";
import { useBrandDetails } from '../../talons/useBrandDetails';
import defaultClasses from './branddetails.module.css';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import Categories from './bdetailscategories';
import Products from './products/index';
import Breadcrumbs from "src/simi/BaseComponents/Breadcrumbs";

const BrandDetails = (props) => {
    const classes = defaultClasses
    const { brandUrl = "" } = useParams();
    const { formatMessage } = useIntl();
    const { brandData, brandLoading, derivedErrorMessage } = useBrandDetails({ url_key: brandUrl.replace('.html', '') });
    if (brandLoading)
        return fullPageLoadingIndicator;
    if (derivedErrorMessage)
        return <div className={classes.brandError}>{derivedErrorMessage}</div>;
    if (!brandData || !brandData.mpbrand || !brandData.mpbrand.items || !brandData.mpbrand.items[0])
        return (
            <div className={classes.brandError}>
                <FormattedMessage
                    id={'brand.NoBrandFound'}
                    defaultMessage={'No Brand Found'}
                />
            </div>
        );

    const brandInformation = brandData.mpbrand.items[0]
    const breadcrumbs = [
        { 
            name: formatMessage({id: 'brandDetails.home', defaultMessage: 'Home'}), 
            link: '/' 
        }, 
        {
            name: formatMessage({id: 'brandDetails.brands',defaultMessage: 'Brands'}), 
            link: '/brands.html'
        },
        {
            name: formatMessage({id: 'brandDetails.brand',defaultMessage: 'Brands'}), 
        },

    ];
    return (
        <div className={`${classes.rootDetails} container` }>
            <Title>{brandInformation.meta_title}</Title>
            <Meta name="description" content={brandInformation.meta_description} />
            <Meta name="keywords" content={brandInformation.meta_keywords} />
            <div className={classes.breadCrumb}>
                <Breadcrumbs breadcrumb={breadcrumbs} history={props.history} />
            </div>
            <h1>{brandInformation.page_title}</h1>
            <Categories classes={classes} />
            <Products option_id={brandInformation.option_id} classes={classes} />
        </div>
    );
}

export default BrandDetails;