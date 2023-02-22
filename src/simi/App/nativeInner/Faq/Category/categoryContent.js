import React, { Fragment, useState } from 'react';
import { useMainPage } from '../talons/useMainPage';
import { useStoreConfig } from '../talons/useStoreConfig';
import { useIntl } from 'react-intl';
import defaultClasses from '../MainPage/mainPage.module.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useCategory } from '../talons/useCategory';
import Loader from '../../Loader';
import SearchBox from '../SearchBox';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
const CategoryContent = props => {
    const { categoryUrl = '' } = useParams();
    const { categoriesData, categoriesLoading, categoriesError } = useCategory({
        url_key: categoryUrl
    });
    const { formatMessage } = useIntl();
    const classes = defaultClasses;
    const { main_content } = categoriesData?.categoryUrl || {};
    const { faq } = main_content || [];
    const categoryId = main_content?.faq_category_id || '';
    const [isQuestion, setIsQuestion] = useState(0);
    const { color, title_color } = main_content || '';
    const handleExpandQuestion = faqId => {
        if (faqId === isQuestion) {
            setIsQuestion(0);
        } else {
            setIsQuestion(faqId);
        }
    };
    const renderQuestionList = list => {
        return list?.map(faq => {
            return (
                <li key={faq.faq_id}>
                    <div
                        className={classes.sidebarItem}
                        faq_id={faq.faq_id}
                        url_key=""
                        onClick={() => handleExpandQuestion(faq.faq_id)}
                    >
                        {faq.title}
                    </div>
                    <div
                        className={`${classes.shortAnswer} ${
                            isQuestion === faq.faq_id ? classes.expanding : ''
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

    if (categoriesLoading) {
        return <Loader />;
    }

    return (
        <div className={classes.column}>
            <SearchBox categoryId={categoryId} />

            <div className={classes.mainBlock}>
                <div className={classes.categoryBlock}>
                    {main_content.image && (
                        <div
                            style={{
                                backgroundColor: color,
                                boxShadow: `0px 5px 24px ${color}`
                            }}
                            className={classes.categoryImage}
                        >
                            <img src={main_content.image} />
                        </div>
                    )}
                    <div className={classes.categoryBlockInfo}>
                        <div className={classes.categoryTitle}>
                            <span style={{ color: title_color }}>
                                {main_content.title}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={classes.questionList}>
                    <ul>{renderQuestionList(faq)}</ul>
                </div>
            </div>
        </div>
    );
};

export default CategoryContent;
