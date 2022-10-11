import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { useStoreConfigData } from '../talons/useStoreConfigData';

/* 
props: {
    type: String
}
*/
// Rich Snippets Home
const RsHome = props => {
    const {
        storeConfigData,
        storeConfigLoading,
        derivedErrorMessage
    } = useStoreConfigData();
    if (storeConfigLoading) return '';
    if (derivedErrorMessage) return '';
    console.log(storeConfigData)

    const mageworx_seo =
        storeConfigData && storeConfigData.storeConfig
            ? storeConfigData.storeConfig.mageworx_seo
            : '';

    let seo;
    try {
        seo = JSON.parse(mageworx_seo);
    } catch {}

    const websiteConfig = (seo && seo.markup && seo.markup.website) || {};

    const { rs_enabled } = websiteConfig || {};

    const urlBase = window.location.origin;
    const url = urlBase;
    let dataStructure = window.homeDataStructure; // Init data

    // Remove old structure
    const existedTag = document.getElementById('simi-home-rsdata');
    if (existedTag) {
        existedTag.parentNode.removeChild(existedTag);
    }

    if (rs_enabled && props.type && props.type.toLowerCase() === 'home') {
        // Create script element
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('id', 'simi-home-rsdata');

        const title = document.querySelector('head title');

        dataStructure = {
            ...(dataStructure || {}),
            '@context': 'https://schema.org/',
            '@type': 'WebSite',
            url: url,
            name: (title && title.innerHTML) || '',
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${url.replace(
                        /\/$/,
                        ''
                    )}/search?query={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
            }
        };

        window.homeDataStructure = dataStructure; // save data to env
        script.innerHTML = JSON.stringify(dataStructure);
        document.head.appendChild(script);
    }

    return null;
};

export default compose(withRouter)(RsHome);
