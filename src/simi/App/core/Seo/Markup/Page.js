import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import {Helmet} from "react-helmet";
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

/* 
props: {
    page: {}
}
*/
// CMS Page
const Page = (props) => {
    const {storeConfig} = Identify.getStoreConfig() || {}
    const {mageworx_seo} = storeConfig || {}
    let seo; try { seo = JSON.parse(mageworx_seo); }catch{}
    const {markup, xtemplates} = seo || {};
    const pageConfig = markup && markup.page || {}
    const {
        crop_meta_title,
        max_title_length,
        crop_meta_description,
        max_description_length
    } = xtemplates || {}
    
    const {
        og_enabled,
        tw_enabled,
        tw_username
    } = pageConfig || {}
    
    const { page } = props;

    // Add <html prefix= "og: http://ogp.me/ns#">
    if (og_enabled) {
        var htmlTag = document.querySelectorAll('html')[0];
        htmlTag.setAttribute('prefix', 'og: http://ogp.me/ns#')
    }

    if (page && page instanceof Object) {
        const {
            meta_description,
            meta_keywords,
            meta_title,
            title,
            url_key,
            content_heading,
            content
        } = page;
        const urlBase = window.location.origin;
        let url = url_key && urlBase+'/'+url_key || '';
        const logoImage = urlBase + '/static/logo.png';

        // Crop by config
        let description_crop = meta_description || content_heading || content && content.replace(/(<([^>]+)>)/ig,"").trim() || '';
        if (crop_meta_description && max_description_length) {
            description_crop = description_crop.substr(0, parseInt(max_description_length));
        }
        let meta_title_crop = meta_title || title || '';
        if (crop_meta_title && max_title_length) {
            meta_title_crop = meta_title_crop.substr(0, parseInt(max_title_length));
        }

        return (
            <>
            {og_enabled &&
                <Helmet>
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={meta_title_crop} />
                    <meta property="og:description" content={description_crop} />
                    <meta property="og:url" content={url} />
                    <meta property="og:image" content={logoImage} />
                    {meta_keywords && <meta name="keywords" content={meta_keywords || ''} />}
                </Helmet>
            }
            {tw_enabled &&
                <Helmet>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content={`@${tw_username}`} />
                    <meta property="og:url" content={url} />
                    <meta property="og:title" content={meta_title_crop} />
                    <meta property="og:description" content={description_crop} />
                    <meta property="og:image" content={logoImage} />
                    {meta_keywords && <meta name="keywords" content={meta_keywords || ''} />}
                </Helmet>
            }
            </>
        )
    }
    return null;
}

export default compose(withRouter)(Page);