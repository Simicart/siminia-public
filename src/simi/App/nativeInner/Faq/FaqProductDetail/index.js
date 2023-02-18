import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import defaultClasses from '../MainPage/mainPage.module.css';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ASK_A_QUESTION } from '../talons/Faq.gql';
import Loader from '../../Loader';
import { useStoreConfig } from '../talons/useStoreConfig';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import { useFaqProductDetail } from './useFaqProductDetail';
const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

const FaqProductDetail = props => {
    const { urlKey, productId } = props;
    const {
        storeConfig,
        storeConfigLoading,
        storeConfigError
    } = useStoreConfig();
    const { enable } = storeConfig?.bssFaqsConfig || '';

    const {
        faqDetailData,
        faqDetailLoading,
        faqDetailError
    } = useFaqProductDetail({ urlKey: urlKey });
    const classes = defaultClasses;
    const faqs = faqDetailData?.products?.items[0]?.faqs || [];
    const { formatMessage } = useIntl();
    const [isActive, setIsActive] = useState(false);
    const [isQuestion, setIsQuestion] = useState(0);
    const [name, setName] = useState('');
    const [question, setQuestion] = useState('');
    const [isSubmit, setIsSubmit] = useState(true);
    const [addQuestion, { data, loading, error }] = useMutation(ASK_A_QUESTION);
    const { message } = data?.submitFaqs || '';
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

    useEffect(() => {
        if (name !== '' && question.trim().length >= 10) {
            setIsSubmit(false);
        } else {
            setIsSubmit(true);
        }
    }, [name, question]);

    const handleSubmit = () => {
        addQuestion({
            variables: {
                question: question,
                customer: name,
                productId: productId
            }
        });
        setName('');
        setQuestion('');
    };

    if (loading || faqDetailLoading) {
        return <Loader />;
    }
    if (!faqsEnabled || parseInt(enable) === 0 || storeConfigLoading) return '';

    return (
        <div className={classes.faqProductDetail}>
            <div className={classes.faqForm}>
                <div
                    className={`${classes.askButton} ${
                        isActive ? classes.activeQuestion : ''
                    }`}
                >
                    <div onClick={() => setIsActive(!isActive)}>
                        {formatMessage({
                            id: 'Ask a question',
                            defaultMessage: 'Ask a question'
                        })}
                    </div>
                </div>
                {isActive && (
                    <div className={classes.askField}>
                        <div className={classes.textField}>
                            <label
                                className={classes.askLabel}
                                for="faqAskUser"
                            >
                                <span>
                                    {formatMessage({
                                        id: 'Name',
                                        defaultMessage: 'Name'
                                    })}
                                </span>
                            </label>

                            <input
                                id="faqAskUser"
                                type="text"
                                name="username"
                                onChange={e => setName(e.target.value)}
                            />

                            <label
                                className={classes.askLabel}
                                for="faqAskQuestion"
                            >
                                <span>
                                    {formatMessage({
                                        id: 'Question',
                                        defaultMessage: 'Question'
                                    })}
                                </span>
                            </label>
                            <textarea
                                id="faqAskQuestion"
                                name="keyword"
                                rows="5"
                                onChange={e => setQuestion(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={isSubmit}
                            onClick={e => handleSubmit(e)}
                            className={classes.productSubmit}
                        >
                            <div>
                                {formatMessage({
                                    id: 'Submit',
                                    defaultMessage: 'Submit'
                                })}
                            </div>
                        </button>
                        {question.trim().length < 10 &&
                            question.trim().length > 0 && (
                                <div className={classes.questionError}>
                                    {formatMessage({
                                        id:
                                            'The question length must be greater than 10 and less than 255',
                                        defaultMessage:
                                            'The question length must be greater than 10 and less than 255'
                                    })}
                                </div>
                            )}
                        {message && (
                            <div className={classes.faqNoti}>{message}</div>
                        )}
                    </div>
                )}
            </div>
            <div className={classes.questionList}>
                <ul>{renderQuestionList(faqs)}</ul>
            </div>
        </div>
    );
};

export default FaqProductDetail;
