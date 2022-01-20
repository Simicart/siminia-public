import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { useStoreConfigData } from './talons/useStoreConfigData';

/* 
props = {
    pageType: String,
    location: Object,
    isLogic: true|false
} 
*/

const Robots = (props) => {

    const pages = {
        'checkout': ['checkout'],
        'contact': ['contact'],
        'customer': [
            'account',
            'orderhistory',
            'profile',
            'newsletter',
            'addresses',
            'my-rewards',
        ],
        'compare': [''],
        'rss': [''],
        'search': ['search'],
        'product_send': ['product_send'],
        'wishlist': ['wishlist'],
    }
    const {storeConfigData, storeConfigLoading, derivedErrorMessage} = useStoreConfigData();
    if (storeConfigLoading) return fullPageLoadingIndicator
    if (derivedErrorMessage) return <div>{derivedErrorMessage}</div>;

    const {storeConfig} = storeConfigData;

    const {mageworx_seo} = storeConfig || {}

    let seo; try { seo = JSON.parse(mageworx_seo); }catch{}

    const robotsConfig = mageworx_seo && seo.base && seo.base.robots || {}
    let content = '';

    const {
        default_category_ln_pages,
        noindex_additional_pages,
        noindex_nofollow_additional_pages,
        count_filters_for_noindex,
        attribute_combinations
    } = robotsConfig || {}

    const actions = ["catalog_category_view", "catalog_product_view"];

    if (['CATEGORY', 'PRODUCT'].includes(props.pageType) && robotsConfig) {
        
        const metaRobots = document.querySelectorAll('meta[name=robots]');
        if (metaRobots.length && !props.isLogic) {
            metaRobots.forEach((meta) => meta.remove());
        }

        if (props.pageType === 'CATEGORY'){
            content = ''; // Default content
        }
        
        // Get search filter values in url params
        let filterVals = '';
        if (props.location.search) {
            const search = decodeURIComponent(props.location.search).split('?'); // explode 1?2 to [1, 2]
            if (search.length > 1) {
                let attrs = search[1].split('&'); // explode 1&2 to [1, 2]
                if (attrs.length > 0) {
                    attrs.every((param) => {
                        const p = param.split('=');
                        if (p[0] === 'filter' && p[1]) {
                            try{
                                filterVals = JSON.parse(p[1]);
                            }catch(error){}
                            return false; //break loop
                        }
                        return true;
                    });
                }
            }
        }

        // Add count of filters for set NOINDEX, FOLLOW for LN
        if (props.pageType === 'CATEGORY' && filterVals) {
            content = default_category_ln_pages; // Default for Category Layer Navigation
            if (count_filters_for_noindex && parseInt(count_filters_for_noindex) <= Object.keys(filterVals).length) {
                content = 'noindex, follow';
            }
        }
        // Add meta header NOINDEX, FOLLOW for additional pages if it is category or product
        noindex_additional_pages && noindex_additional_pages.every((page) => {
            if (actions.includes(page) && page) { // is product page or category
                if ((page === 'catalog_category_view' && props.pageType === 'CATEGORY') || 
                    (page === 'catalog_product_view' && props.pageType === 'PRODUCT') 
                ) {
                    content = 'noindex, follow';
                    return false;
                }
            }
            return true;
        })
        // Add NOINDEX, NOFOLLOW Robots Meta Header for Additional Pages if it is category or product
        noindex_nofollow_additional_pages && noindex_nofollow_additional_pages.every((page) => {
            if (actions.includes(page) && page) { // is product page or category
                if ((page === 'catalog_category_view' && props.pageType === 'CATEGORY') || 
                    (page === 'catalog_product_view' && props.pageType === 'PRODUCT') 
                ) {
                    content = 'noindex, nofollow';
                    return false;
                }
            }
            return true;
        });

        // Add Robots for Attributes Combinations
        if (props.pageType === 'CATEGORY'){
            attribute_combinations && filterVals && (
                Object.keys(attribute_combinations).every((attrKey) => {
                    if (Object.keys(filterVals).includes(attrKey)) { // if exist attribute name in filter param
                        content = attribute_combinations[attrKey];
                        return false;
                    } else if(attrKey.split('+').length > 1) { // example brand+color
                        if(attrKey.split('+').every((key) => {
                            if (Object.keys(filterVals).includes(key)) {
                                return true;
                            }
                            return false;
                        })){
                            content = attribute_combinations[attrKey];
                            return false;
                        }
                    }
                    return true;
                })
            );
        }
       
        if (props.isLogic) return content;
        if (!content) return null;

        return <meta name="robots" content={content.toLowerCase()} />
    }

    // Add NOINDEX, NOFOLLOW Robots Meta Header for Additional Pages
    noindex_nofollow_additional_pages && noindex_nofollow_additional_pages.every((page) => {
        if (!actions.includes(page) && page) {
            if (props.location && props.location.pathname && page) {
                const expr = new RegExp(page.split('*').join('.*')); // to expression
                if (expr.test(props.location.pathname)) {
                    content='noindex, nofollow';
                    return false; // break loop
                }
            }
        }
        return true;
    });

    // Add meta header NOINDEX, FOLLOW for additional pages
    noindex_additional_pages && noindex_additional_pages.every((page) => {
        if (!actions.includes(page) && page) {
            if (props.location && props.location.pathname && page) {
                const expr = new RegExp(page.split('*').join('.*')); // to expression
                if (expr.test(props.location.pathname)) {
                    content='noindex, follow';
                    return false; // break loop
                }
            }
        }
        return true;
    });

    // Add meta header NOINDEX, FOLLOW for selected pages
    if (config && config.mageworx_seo){
        const {noindex_pages} = robotsConfig || {}
        if (noindex_pages) {
            noindex_pages.every((page) => {
                for(let pageKey in pages){
                    if (page.includes(pageKey)) {
                        return pages[pageKey].every(urlPath => {
                            if (props.location && props.location.pathname && props.location.pathname.includes(urlPath) && urlPath) {
                                content='noindex, follow';
                                document.body.setAttribute('data-mageworx-seo', 'robots');
                                return false; //break
                            }
                            return true;
                        });
                    }
                }
                return true;
            });
        }
    }

    if (props.isLogic) return content;

    if (!content) return null;

    return <meta name="robots" content={content} />
}

export default Robots;