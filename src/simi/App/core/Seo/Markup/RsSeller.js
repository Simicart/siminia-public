import React from 'react';
import Identify from 'src/simi/Helper/Identify';
// import {Helmet} from "react-helmet";
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { useStoreConfigData } from '../talons/useStoreConfigData';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

/* 
props: {
    type: 'all|home'
}
*/
// Rich Snippets Home
const RsSeller = props => {
    const {
        storeConfigData,
        storeConfigLoading,
        derivedErrorMessage
    } = useStoreConfigData();
    if (storeConfigLoading) return fullPageLoadingIndicator;
    if (derivedErrorMessage) return <div>{derivedErrorMessage}</div>;

    const mageworx_seo =
        storeConfigData && storeConfigData.storeConfig
            ? storeConfigData.storeConfig.mageworx_seo
            : '';
    let seo;
    try {
        seo = JSON.parse(mageworx_seo);
    } catch {}

    const sellerConfig = (seo && seo.markup && seo.markup.seller) || {};

    const {
        seller_type,
        show_on_pages,
        name,
        image,
        description,
        phone,
        fax,
        email,
        location,
        region,
        street,
        post_code,
        price_range
    } = sellerConfig || {};

    if (
        sellerConfig &&
        props.type &&
        props.type.toLowerCase() === show_on_pages
    ) {
        // Remove old structure
        const existedTag = document.getElementById('simi-seller-rsdata');
        if (existedTag) {
            existedTag.parentNode.removeChild(existedTag);
        }
        const urlBase = window.location.origin;
        const url = urlBase;
        let dataStructure = window.sellerDataStructure; // Init data

        // Create script element
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('id', 'simi-seller-rsdata');

        dataStructure = {
            ...(dataStructure || {}),
            '@context': 'https://schema.org/',
            '@type': seller_type,
            url: url,
            name: name,
            image: image,
            description: description,
            telephone: phone,
            faxNumber: fax,
            email: email,
            location: location,
            address: {
                '@type': 'PostalAddress',
                streetAddress: street,
                addressLocality: post_code,
                addressRegion: region
            },
            priceRange: price_range
        };

        window.sellerDataStructure = dataStructure; // save data to env
        script.innerHTML = JSON.stringify(dataStructure);
        document.head.appendChild(script);
    }

    return null;
};

export default compose(withRouter)(RsSeller);
