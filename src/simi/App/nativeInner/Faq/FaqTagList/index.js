import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import defaultClasses from '../MainPage/mainPage.module.css';
import SearchBox from '../SearchBox';
import Sidebar from '../Sidebar';
import TagListContent from './tagListContent';
import Page404 from '../../NoMatch/Page404';

const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

const FaqTagList = props => {
    const {strTagName} = props
    const { formatMessage } = useIntl();
    const title = formatMessage({
        id: 'FAQs Question with Tag',
        defaultMessage: 'FAQs Question with Tag'
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
                <TagListContent />
                <Sidebar />
            </div>
        </div>
    );
};

export default FaqTagList;
