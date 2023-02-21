import React, { Fragment, useState } from 'react';
import { useMainPage } from '../talons/useMainPage';
import { useStoreConfig } from '../talons/useStoreConfig';
import { useIntl } from 'react-intl';
import defaultClasses from '../MainPage/mainPage.module.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useCategory } from '../talons/useCategory';
import Loader from '../../Loader';
import { useTagList } from '../talons/useTagList';
import SearchBox from '../SearchBox';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
const TagListContent = props => {
    const { tagName = '' } = useParams();
    const { tagListData, tagListLoading, tagListError } = useTagList({
        url_key: tagName
    });
    const { formatMessage } = useIntl();
    const classes = defaultClasses;
    const { result } = tagListData?.tagFaqs || [];
    const [isQuestion, setIsQuestion] = useState(0);
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

    if (tagListLoading) {
        return <Loader />;
    }
    return (
        <div className={classes.column}>
            <SearchBox />
            <div className={classes.mainBlock}>
                <div className={classes.categoryBlock}>
                    <div className={classes.categoryBlockInfo}>
                        <div className={classes.categoryTitle}>
                            <span>
                                {formatMessage({
                                    id: `We found ${
                                        result.length
                                    } result(s) with tag(s): `
                                })}

                                {result.map(faq => {
                                    return (
                                        <span className={classes.tagName}>
                                            {faq.tag}
                                        </span>
                                    );
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={classes.questionList}>
                    <ul>{renderQuestionList(result)}</ul>
                </div>
            </div>
        </div>
    );
};

export default TagListContent;
