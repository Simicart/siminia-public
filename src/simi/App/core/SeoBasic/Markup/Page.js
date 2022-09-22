import React from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Meta } from '@magento/venia-ui/lib/components/Head';

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
        const url = (url_key && urlBase + '/' + url_key) || '';
        const logoImage = urlBase + '/static/logo.png';

        // Crop by config
        const description_crop =
            meta_description ||
            content_heading ||
            (content && content.replace(/(<([^>]+)>)/gi, '').trim()) ||
            '';

        const meta_title_crop = meta_title || title || '';

        return (
            <>
                {meta_title_crop ? (
                    <Meta name="title" content={meta_title_crop} />
                ) : (
                    ''
                )}
                {description_crop ? (
                    <Meta name="description" content={description_crop} />
                ) : (
                    ''
                )}
                <Helmet>
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={meta_title_crop} />
                    <meta property="title" content={meta_title_crop} />
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
