import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import defaultClasses from './mainPage.module.css';
import Sidebar from '../Sidebar';
import MainContent from './mainContent';
import Page404 from '../../NoMatch/Page404';
import { useStoreConfig } from '../talons/useStoreConfig';
const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;
const FAQ = props => {
    const {
        storeConfig,
        storeConfigLoading,
        storeConfigError
    } = useStoreConfig();
    const { enable } = storeConfig?.bssFaqsConfig || '';
    const { formatMessage } = useIntl();
    const title = formatMessage({
        id: 'FAQs Main Page',
        defaultMessage: 'FAQs Main Page'
    });
    const classes = defaultClasses;

    if (!faqsEnabled || parseInt(enable) === 0 ) return <Page404 />;

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
                <MainContent bssFaqsConfig = {storeConfig?.bssFaqsConfig}/>
                <Sidebar />
            </div>
        </div>
    );
};

export default FAQ;
