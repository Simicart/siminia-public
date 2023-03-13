import React, { Fragment, useState } from 'react';
import { useMainPage } from '../talons/useMainPage';
import { useStoreConfig } from '../talons/useStoreConfig';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import defaultClasses from '../MainPage/mainPage.module.css';
import Search from 'src/simi/BaseComponents/Icon/Search';
import { Link, useHistory } from 'react-router-dom';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
let strTagName = '';
const Sidebar = props => {
    const {
        storeConfig,
        storeConfigLoading,
        storeConfigError
    } = useStoreConfig();
    const { most_faq_show, most_faq_number } = storeConfig?.bssFaqsConfig || '';
    const bgColor = storeConfig?.bssFaqsConfig?.background_color || '';
    const { formatMessage } = useIntl();
    const { mainPageData, mainPageLoading, mainPageError } = useMainPage();
    const classes = defaultClasses;
    const { category, most_faq, tag } =
        mainPageData?.mainPageFaqs?.sidebar || [];
    const [isActive, setIsActive] = useState(0);
    const handleExpand = faqId => {
        if (faqId === isActive) {
            setIsActive(0);
        } else {
            setIsActive(faqId);
        }
    };

    const renderMostFaqs = () => {
        return most_faq?.map(faq => {
            const label = Object.values(JSON.parse(faq.frontend_label));

            return (
                <li key={faq.faq_id}>
                    <div
                        className={classes.sidebarItem}
                        faq_id={faq.faq_id}
                        url_key=""
                        onClick={() => handleExpand(faq.faq_id)}
                    >
                        {label && label[0] !== '' ? label[0] : faq.title}
                    </div>
                    <div
                        className={`${classes.shortAnswer} ${
                            isActive === faq.faq_id ? classes.expanding : ''
                        }`}
                        faq_id={faq.faq_id}
                    >
                        <div className={classes.questionShortAnswer}>
                            <RichContent html={faq.short_answer} />
                            {/* {faq.short_answer} */}
                        </div>
                        <div>
                            <Link
                                className={classes.faqUrl}
                                to={{
                                    pathname: `/faqs/question/${faq.url_key}`,
                                    state: { stateParam: true }
                                }}
                            >
                                {formatMessage({
                                    id: 'See more',
                                    defaultMessage: 'See more'
                                })}
                            </Link>
                        </div>
                        <p className={classes.createdInfo}>
                            {formatMessage({
                                id: `Created by ${faq.customer} on:`,
                                defaultMessage: `Created by ${faq.customer} on:`
                            })}{' '}
                            {faq.time}
                        </p>
                    </div>
                </li>
            );
        });
    };

    const renderCategory = () => {
        return category?.map(cate => {
            return (
                <li key={cate.faq_category_id}>
                    <div
                        className={classes.sidebarItem}
                        faq_id={cate.faq_category_id}
                        url_key={cate.url_key}
                    >
                        <Link to={`/faqs/category/${cate.url_key}`}>
                            {cate.title}
                        </Link>
                    </div>
                </li>
            );
        });
    };

    const history = useHistory();

    let listTagName = [];

    const handleClickTagName = tagName => {
        if (!listTagName.includes(tagName)) {
            listTagName.push(tagName);
        }
        listTagName.forEach(function(element) {
            if (!strTagName.includes(element)) {
                strTagName += element + `~`;
            }
        });
        return history.push(`/faqs/tag/${strTagName}`);
    };
    const renderTagList = () => {
        return tag?.map(tagName => {
            return (
                <div
                    onClick={() => handleClickTagName(tagName)}
                    className={classes.sidebarTag}
                >
                    <div>
                        <span>
                            {formatMessage({
                                id: tagName
                            })}
                        </span>
                    </div>
                </div>
            );
        });
    };
    const styles = {
        backgroundColor: bgColor
    };
    return (
        <div className={classes.sidebar}>
            {most_faq_show === '1' && most_faq_number && (
                <div className={classes.sidebarMostFaq}>
                    <div style={styles} className={classes.label}>
                        <div>
                            {formatMessage({
                                id: 'Most FAQs',
                                defaultMessage: 'Most FAQs'
                            })}
                        </div>
                    </div>

                    <div className={classes.mostFaq}>
                        <ul>{renderMostFaqs(most_faq)}</ul>
                    </div>
                </div>
            )}

            <div className={classes.sidebarCategory}>
                <div style={styles} className={classes.label}>
                    <div>
                        {formatMessage({
                            id: 'Category',
                            defaultMessage: 'Category'
                        })}
                    </div>
                </div>
                <div className={classes.category}>
                    <ul>{renderCategory()}</ul>
                </div>
            </div>

            <div className={classes.sidebarTagList}>
                <div style={styles} className={classes.label}>
                    <div>
                        {formatMessage({
                            id: 'Tag list',
                            defaultMessage: 'Tag list'
                        })}
                    </div>
                </div>
                <div className={classes.tagList}>{renderTagList()}</div>
            </div>
        </div>
    );
};

export default Sidebar;
