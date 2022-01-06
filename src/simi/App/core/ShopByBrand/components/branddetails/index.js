import React from "react";
import { FormattedMessage } from 'react-intl';
import { Link, useParams } from "react-router-dom";
import { useBrandDetails } from '../../talons/useBrandDetails';
import defaultClasses from './branddetails.module.css';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import Categories from './bdetailscategories';
import Products from './products/index';

const BrandDetails = () => {
    const classes = defaultClasses
    const { brandUrl = "" } = useParams();
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

    return (
        <div className={classes.rootDetails}>
            <Title>{brandInformation.meta_title}</Title>
            <Meta name="description" content={brandInformation.meta_description} />
            <Meta name="keywords" content={brandInformation.meta_keywords} />
            <div className={classes.breadCrumb}>
                <Link className={classes.breadCrumbLink} to="/">{`Home`}</Link>
                <span className={classes.breadCrumbSeparator}>{`/`}</span>
                <Link className={classes.breadCrumbLink} to="/brands.html">{`Brands`}</Link>
                <span className={classes.breadCrumbSeparator}>{`/`}</span>
                <span className={classes.breadCrumbText}>{`Brands`}</span>
            </div>
            <h1>{brandInformation.page_title}</h1>
            <Categories classes={classes} />
            <Products option_id={brandInformation.option_id} classes={classes} />
        </div>
    );
}

export default BrandDetails;