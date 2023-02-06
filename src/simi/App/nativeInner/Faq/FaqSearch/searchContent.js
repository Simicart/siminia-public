import React, { Fragment, useState } from 'react';
import { useMainPage } from '../talons/useMainPage';
import { useStoreConfig } from '../talons/useStoreConfig';
import { useIntl } from 'react-intl';
import defaultClasses from '../MainPage/mainPage.module.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useCategory } from '../talons/useCategory';
import Loader from '../../Loader';
import { useFaqSearch } from '../talons/useFaqSearch';
import SearchBox from '../SearchBox';
const SearchContent = props => {
    const { keyword = '', category = '' } = useParams();

    const {
        searchResults,
        searchResultsLoading,
        searchResultsError
    } = useFaqSearch({
        key_word: keyword,
        category_id: category
    });
    const { formatMessage } = useIntl();
    const classes = defaultClasses;
    const { searchFaqs } = searchResults || [];

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
                            {faq.short_answer}
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

    if (searchResultsLoading) {
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
                                        searchFaqs.length
                                    } result(s) match the keyword ${keyword}`
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={classes.questionList}>
                    <ul>{renderQuestionList(searchFaqs)}</ul>
                </div>
            </div>
        </div>
    );
};

export default SearchContent;
