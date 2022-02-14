import React from 'react';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import RobotsBasic from './RobotsBasic';

const Canonical = props => {
    let link = '';
    
    const { url } = props || {};

    let canonicalUrl = url || '';
    if (url instanceof Object) {
        canonicalUrl = (url && url.url) || '';
    }

    const { type } = props || { type: 'HOME' };

    link = canonicalUrl.replace(/\/$/, ''); // remove trailing slash
    
    const robotContent = RobotsBasic({
        isLogic: true,
        location: props.location,
        pageType: type
    }); // String
    if (robotContent) {
        try {
            if (robotContent.includes('noindex')) {
                link = ''; // not allowed canonical for robots
            }
        } catch (err) {}
    }
    switch (type) {
        case 'HOME':
            break;
        case 'CATEGORY':
            if (props.location) {
                if (props.location.search) {
                    link += props.location.search;
                } else if (props.location.pathname) {
                    link += props.location.pathname;
                }
            }
            break;
        case 'PRODUCT':
            break;
        case 'CMS':
            break;
        default:
            break;
    }
    if (!link) return null;

    return (
        <Helmet>
            <link rel="canonical" href={link} />
        </Helmet>
    );
};

export default compose(withRouter)(Canonical);
