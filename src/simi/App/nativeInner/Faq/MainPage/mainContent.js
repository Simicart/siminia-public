import React, { Fragment, useState } from 'react';
import { useMainPage } from '../talons/useMainPage';
import { useStoreConfig } from '../talons/useStoreConfig';
import { useIntl } from 'react-intl';
import defaultClasses from './mainPage.module.css';
import { Link } from 'react-router-dom';
import SearchBox from '../SearchBox';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

const MainContent = props => {
    const { bssFaqsConfig } = props;
    const { formatMessage } = useIntl();
    const { mainPageData, mainPageLoading, mainPageError } = useMainPage();

    const classes = defaultClasses;
    const { main_content } = mainPageData?.mainPageFaqs || '';
    const [isQuestion, setIsQuestion] = useState(0);
    const handleExpandQuestion = (faqId, cateId) => {
        if (faqId === isQuestion) {
            setIsQuestion(0);
        } else {
            setIsQuestion(faqId);
        }
    };
    const renderQuestionList = (list, id) => {
        return list?.map(faq => {
            const str = faq.frontend_label.slice(6);
            const indexStr = str.indexOf('","');
            const label = str.slice(0, indexStr);
            return (
                <li key={faq.faq_id}>
                    <div
                        className={classes.sidebarItem}
                        faq_id={faq.faq_id}
                        url_key=""
                        onClick={() => handleExpandQuestion(faq.faq_id, id)}
                    >
                        {label ? label : faq.title}
                    </div>
                    <div
                        className={`${classes.shortAnswer} ${
                            isQuestion === faq.faq_id ? classes.expanding : ''
                        } ${
                            bssFaqsConfig?.question_display === 'expand'
                                ? classes.expanding
                                : ''
                        }`}
                        faq_id={faq.faq_id}
                    >
                        <div className={classes.questionShortAnswer}>
                            <RichContent html={faq.short_answer} />
                        </div>
                        <div>
                            <Link
                                className={classes.faqUrl}
                                to={`/faqs/question/${faq.url_key}`}
                            >
                                {formatMessage({
                                    id: 'See more',
                                    defaultMessage: 'See more'
                                })}
                            </Link>
                        </div>
                        <p className={classes.createdInfo}>
                            {formatMessage({
                                id: 'Created by Admin on:',
                                defaultMessage: 'Created by Admin on:'
                            })}{' '}
                            {faq.time}
                        </p>
                    </div>
                </li>
            );
        });
    };
    const renderMainContent = () => {
        return main_content?.map(cate => {
            return (
                <div className={classes.categoryBlock}>
                    <div className={classes.categoryImage}>
                        {cate.image && (
                            <img src={cate.image} alt={cate.title} />
                        )}
                    </div>

                    <div className={classes.categoryBlockInfo}>
                        <div className={classes.categoryTitle}>
                            <span>{cate.title}</span>
                        </div>
                    </div>
                    <div className={classes.questionList}>
                        <ul>
                            {renderQuestionList(cate.faq, cate.faq_category_id)}
                        </ul>
                    </div>
                </div>
            );
        });
    };
    return (
        <div className={classes.column}>
            <SearchBox />
            <div className={classes.mainBlock}>{renderMainContent()}</div>
        </div>
    );
};

export default MainContent;
