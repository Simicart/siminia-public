import React from 'react';
import {Helmet} from "react-helmet";
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Robots from './Robots';
import { useStoreConfigData } from './talons/useStoreConfigData';

const Canonical = (props) => {
    const {storeConfigData} = useStoreConfigData();
    
    const {storeConfig} = storeConfigData;

    const {mageworx_seo} = storeConfig || {}

    let seo; try { seo = JSON.parse(mageworx_seo); }catch{}


    const canonicalConfig = seo && seo.base && seo.base.canonical || {}

    let link = '';
    const {
        canonical_base,
        canonical_for_ln,
        canonical_for_ln_multiple,
        ignore_pages,
        is_disable_by_robots,
        product_url_type, // server processed
        slash_home_page,
        trailing_slash
    } = canonicalConfig || {}
   
    const { url } = props || {}
    let canonicalUrl = url || '';
    if (url instanceof Object) {
        canonicalUrl = url && url.url || '';
    }
   
    const { type } = props || {type: 'HOME'}

    link = canonicalUrl.replace(/\/$/, ''); // remove trailing slash
   
    let isTrailingAdded = false;

    // Canonical URL won't be added for these pages
    if (ignore_pages && ignore_pages.length) {
        if(!ignore_pages.every((page) => !link.includes(page))){
            link = ''; // not allowed canonical for this url
        }
    }

    // Disable Canonical URL for Pages with NOINDEX robots
    if (is_disable_by_robots) {
        const robotContent = Robots({isLogic: true, location: props.location, pageType: type}); // String
        if (robotContent) {
            if(robotContent.includes('noindex')){
                link = ''; // not allowed canonical for robots
            }
        }
    }

    switch(type){
        case 'HOME':
            if (canonical_base) {
                link = canonical_base.replace(/\/$/, '');
                if (parseInt(slash_home_page)) {
                    link += '/';
                }
            }
            isTrailingAdded = true;
            break;
        case 'CATEGORY':
            if (parseInt(canonical_for_ln) === 1) {
                if(props.location) {
                    if(props.location.search) {
                        link += props.location.search;
                    } else if(props.location.pathname) {
                        link += props.location.pathname;
                    }
                }
            } else if (parseInt(canonical_for_ln) === 2 && props.location && props.location.pathname) {
                link += props.location.pathname; 
            }
            break;
        case 'PRODUCT':
            break;
        case 'CMS':
            break;
        default:
            break;
    }

    // Add trailing slash to all pages exclude home
    if (link && parseInt(trailing_slash) && !isTrailingAdded) {
        link += '/';
    }

    if (!link) return null;

    return (
        <Helmet>
            <link rel="canonical" href={link} />
        </Helmet>
    )
}

export default compose(withRouter)(Canonical);