import React from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import { Meta } from '@magento/venia-ui/lib/components/Head';

const Category = props => {
    const { category } = props;

    var htmlTag = document.querySelectorAll('html')[0];
    htmlTag.setAttribute('prefix', 'og: http://ogp.me/ns#');

    if (category && category instanceof Object) {
        const {
            name,
            image,
            description,
            url_key,
            meta_title,
            meta_keywords,
            meta_description
        } = category;
        const urlSuffix = cateUrlSuffix();
        const urlBase = window.location.origin;
        const category_url =
            (url_key && urlBase + '/' + url_key + urlSuffix) || '';
        const logoImage = urlBase + '/static/logo.png';

        const description_crop = meta_description || description || '';

        const meta_title_crop = meta_title || name || '';

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
                    <meta name="twitter:card" content="summary" />
                    <meta property="og:image" content={image || logoImage} />
                    <meta
                        property="og:description"
                        content={description_crop || ''}
                    />
                    <meta property="og:url" content={category_url} />
                    {meta_keywords && (
                        <meta name="keywords" content={meta_keywords || ''} />
                    )}
                </Helmet>
            </>
        );
    }
    return null;
};

export default compose(withRouter)(Category);
