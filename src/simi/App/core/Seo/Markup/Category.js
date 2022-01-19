import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import {Helmet} from "react-helmet";
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import { useStoreConfigData } from '../talons/useStoreConfigData';

/* 
props: {
    category: {}
}
*/
const Category = (props) => {
    const {storeConfigData} = useStoreConfigData();
    
    const {storeConfig} = storeConfigData;

    const {mageworx_seo} = storeConfig || {}

    let seo; try { seo = JSON.parse(mageworx_seo); }catch{}


    const {markup, xtemplates} = seo || {};
    const categoryConfig = markup && markup.category || {}
    const {
        crop_meta_title,
        max_title_length,
        crop_meta_description,
        max_description_length
    } = xtemplates || {}
   
    const {
        rs_enabled, // Ignore
        og_enabled,
        tw_enabled,
        tw_username
    } = categoryConfig || {}
    
    const { category } = props;

    // Add <html prefix= "og: http://ogp.me/ns#">
    if (og_enabled) {
        var htmlTag = document.querySelectorAll('html')[0];
        htmlTag.setAttribute('prefix', 'og: http://ogp.me/ns#')
    }

    if (category && category instanceof Object) {
        const {
            name,
            image,
            description,
            url_key,
            meta_title,
            meta_keywords,
            meta_description,
        } = category;
        const urlSuffix = cateUrlSuffix();
        const urlBase = window.location.origin;
        let category_url = url_key && urlBase+'/'+url_key+urlSuffix || '';
        const logoImage = urlBase + '/static/logo.png';

        // Crop by config
        let description_crop = meta_description || description || '';
        if (crop_meta_description && max_description_length) {
            description_crop = description_crop.substr(0, parseInt(max_description_length));
        }
        let meta_title_crop = meta_title || name || '';
        if (crop_meta_title && max_title_length) {
            meta_title_crop = meta_title_crop.substr(0, parseInt(max_title_length));
        }

        return (
            <>
            {og_enabled &&
                <Helmet>
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={meta_title_crop} />
                    <meta property="og:image" content={image || logoImage} />
                    <meta property="og:description" content={description_crop || ''} />
                    <meta property="og:url" content={category_url} />
                    {meta_keywords && <meta name="keywords" content={meta_keywords || ''} />}
                </Helmet>
            }
            {tw_enabled &&
                <Helmet>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content={`@${tw_username}`} />
                    <meta property="og:url" content={category_url} />
                    <meta property="og:title" content={meta_title_crop} />
                    <meta property="og:description" content={description_crop || ''} />
                    <meta property="og:image" content={image || logoImage} />
                    {meta_keywords && <meta name="keywords" content={meta_keywords || ''} />}
                </Helmet>
            }
            </>
        )
    }
    return null;
}

export default compose(withRouter)(Category);