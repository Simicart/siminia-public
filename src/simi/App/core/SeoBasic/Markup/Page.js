import React from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

/* 
props: {
    page: {}
}
*/
// CMS Page
const Page = props => {
    const { page } = props;

    // Add <html prefix= "og: http://ogp.me/ns#">

    var htmlTag = document.querySelectorAll('html')[0];
    htmlTag.setAttribute('prefix', 'og: http://ogp.me/ns#');

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
        let url = (url_key && urlBase + '/' + url_key) || '';
        const logoImage = urlBase + '/static/logo.png';

        // Crop by config
        let description_crop =
            meta_description ||
            content_heading ||
            (content && content.replace(/(<([^>]+)>)/gi, '').trim()) ||
            '';

        let meta_title_crop = meta_title || title || '';

        return (
            <>
                <Helmet>
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={meta_title_crop} />
                    <meta name="twitter:card" content="summary" />
                    <meta
                        property="og:description"
                        content={description_crop}
                    />
                    <meta property="og:url" content={url} />
                    <meta property="og:image" content={logoImage} />
                    {meta_keywords && (
                        <meta name="keywords" content={meta_keywords || ''} />
                    )}
                </Helmet>
            </>
        );
    }
    return null;
};

export default compose(withRouter)(Page);
