import React, { Fragment, useState } from 'react';
import { useMainPage } from '../talons/useMainPage';
import { useStoreConfig } from '../talons/useStoreConfig';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import defaultClasses from '../MainPage/mainPage.module.css';
import Search from 'src/simi/BaseComponents/Icon/Search';
import { Link } from 'react-router-dom';
import SearchBox from '../SearchBox';
import Sidebar from '../Sidebar';
import { useParams } from 'react-router-dom';
import { useCategory } from '../talons/useCategory';
import CategoryContent from './categoryContent';

const Category = props => {
    const { formatMessage } = useIntl();
    const title = formatMessage({
        id: 'FAQs Category',
        defaultMessage: 'FAQs Category'
    });
    const classes = defaultClasses;

    return (
        <div className={`${classes.wrapperMainPage} container`}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>
            </Helmet>
            <div class={classes.mainPage}>
                <h1 class={classes.title}>{title}</h1>
            </div>
            <div className={classes.columns}>
                <CategoryContent />
                <Sidebar />
            </div>
        </div>
    );
};

export default Category;
