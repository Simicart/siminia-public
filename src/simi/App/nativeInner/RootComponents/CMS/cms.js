import React, { Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useCmsPage } from '@magento/peregrine/lib/talons/Cms/useCmsPage';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import CategoryList from '@magento/venia-ui/lib/components/CategoryList';
import { Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useIntl } from 'react-intl';

import defaultClasses from './cms.module.css';
import Seo from '../../../core/Seo';
import SeoBasic from '../../../core/SeoBasic';
const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;
const CMSPage = props => {
    const { identifier } = props;

    const talonProps = useCmsPage({ identifier });
    const {
        cmsPage,
        hasContent,
        rootCategoryId,
        shouldShowLoadingIndicator
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    if (hasContent) {
        const {
            content_heading,
            title,
            meta_title,
            meta_description,
            content
        } = cmsPage;

        const headingElement =
            content_heading !== '' ? (
                <h1 className={classes.heading}>{content_heading}</h1>
            ) : null;

        const pageTitle = meta_title || title;

        return (
            <Fragment>
                <StoreTitle>{pageTitle}</StoreTitle>
                <Meta name="title" content={pageTitle} />
                <Meta name="description" content={meta_description} />
                {mageworxSeoEnabled ? <Seo /> : <SeoBasic />}
                {headingElement}
                <RichContent html={content} />
            </Fragment>
        );
    }

    // Fallback to a category list if there is no cms content.
    return (
        <CategoryList
            title={formatMessage({
                id: 'cms.shopByCategory',
                defaultMessage: 'Shop by category'
            })}
            id={rootCategoryId}
        />
    );
};

CMSPage.propTypes = {
    id: number,
    classes: shape({
        heading: string
    })
};

export default CMSPage;
