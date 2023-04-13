import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import defaultClasses from '../MainPage/mainPage.module.css';
import SearchBox from '../SearchBox';
import Sidebar from '../Sidebar';
import SearchContent from './searchContent';
import Page404 from '../../NoMatch/Page404';

const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

const FaqSearch = props => {
    const { formatMessage } = useIntl();
    const title = formatMessage({
        id: 'FAQs Search Result',
        defaultMessage: 'FAQs Search Result'
    });
    const classes = defaultClasses;

    if(faqsEnabled === 0) return <Page404/>

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
                <SearchContent />
                <Sidebar />
            </div>
        </div>
    );
};

export default FaqSearch;
