import React from 'react';
import { Helmet } from 'react-helmet';
import RobotsBasic from './RobotsBasic';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

const SeoBasic = props => {
    const { title, description } = props || {};
    return (
        <Helmet>
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {RobotsBasic({
                location: props.location,
                pageType: props.pageType
            })}
        </Helmet>
    );
};

export default compose(withRouter)(SeoBasic);
