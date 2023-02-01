import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import defaultClasses from './mainPage.module.css';
import Sidebar from '../Sidebar';
import MainContent from './mainContent';

const FAQ = props => {
    const { formatMessage } = useIntl();
    const title = formatMessage({
        id: 'FAQs Main Page',
        defaultMessage: 'FAQs Main Page'
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
                <MainContent />
                <Sidebar />
            </div>
        </div>
    );
};

export default FAQ;
