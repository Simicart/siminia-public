import React, { Fragment, useState } from 'react';
import { useMainPage } from '../talons/useMainPage';
import { useStoreConfig } from '../talons/useStoreConfig';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import defaultClasses from './faqQuestion.module.css';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useFaqQuestion } from '../talons/useFaqQuestion';
import Loader from '../../Loader';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon
} from 'react-share';
import { Link } from 'react-router-dom';
import { ADD_VOTE_FAQ } from '../talons/Faq.gql';
import { useMutation } from '@apollo/client';
import faqImg from '../Image/faq.png';
import { useVoteFaq } from '../talons/useVoteFaq';

const FaqQuestion = props => {
    const stateParam = useLocation()?.state?.stateParam || '';
    const {
        storeConfig,
        storeConfigLoading,
        storeConfigError
    } = useStoreConfig();
    const { social_button, related_faq_show } =
        storeConfig?.bssFaqsConfig || '';
    const bgColor = storeConfig?.bssFaqsConfig?.background_color || '';
    const { questionUrl = '' } = useParams();
    const { questionData, questionLoading, questionError } = useFaqQuestion({
        url_key: questionUrl
    });
    const { mainPageData, mainPageLoading, mainPageError } = useMainPage();
    const { main_content, sidebar } = mainPageData?.mainPageFaqs || {};
    const categoryImage = sidebar?.category?.filter(
        cate => cate.faq_id === questionData?.questionUrl?.category_id
    )[0]?.image;
    const shareProps = {
        url: window.location.href
    };
    const { questionUrl: question } = questionData || {};

    const { formatMessage } = useIntl();
    const title = formatMessage({
        id: 'FAQs Question',
        defaultMessage: 'FAQs Question'
    });

    const [addVoteFaq, { data }] = useMutation(ADD_VOTE_FAQ);

    const handleVoteFaq = () => {
        addVoteFaq({
            variables: {
                type: '',
                faqId: 2
            }
        });
    };

    const classes = defaultClasses;
    const [isActive, setIsActive] = useState(0);
    const handleExpand = faqId => {
        if (faqId === isActive) {
            setIsActive(0);
        } else {
            setIsActive(faqId);
        }
    };
    const getAllFaq = () => {
        const arrFaq = [];
        const uniqueFaqId = [];
        main_content?.forEach(element => {
            const { faq } = element;
            faq.forEach(elm => {
                {
                    arrFaq.push(elm);
                }
            });
        });
        const listFaq = arrFaq.filter(element => {
            const isDuplicate = uniqueFaqId.includes(element.faq_id);

            if (!isDuplicate) {
                uniqueFaqId.push(element.faq_id);
                return true;
            }
            return false;
        });
        return listFaq;
    };
    const styles = {
        backgroundColor: bgColor
    };
    const renderRelatedFaq = () => {
        const relatedId =
            questionData?.questionUrl?.related_faq_id?.split(',') || [];
        const relatedFaqs = [];
        relatedId.forEach(element => {
            relatedFaqs.push(getAllFaq().find(item => item.faq_id === element));
        });
        return relatedFaqs?.map(faq => {
            return (
                <li key={faq?.faq_id}>
                    <div
                        className={classes.sidebarItem}
                        faq_id={faq?.faq_id}
                        url_key=""
                        onClick={() => handleExpand(faq?.faq_id)}
                    >
                        {faq?.title}
                    </div>
                    <div
                        className={`${classes.shortAnswer} ${
                            isActive === faq?.faq_id ? classes.expanding : ''
                        }`}
                        faq_id={faq?.faq_id}
                    >
                        <div className={classes.questionShortAnswer}>
                            <RichContent html={faq?.short_answer} />
                        </div>
                        <div>
                            <Link
                                className={classes.faqUrl}
                                to={`/faqs/question/${faq?.url_key}`}
                            >
                                {formatMessage({
                                    id: 'See more',
                                    defaultMessage: 'See more'
                                })}
                            </Link>
                        </div>
                        <p className={classes.createdInfo}>
                            {formatMessage({
                                 id: `Created by ${faq?.customer} on:`,
                                 defaultMessage: `Created by ${faq?.customer} on:`
                            })}{' '}
                            {faq?.time}
                        </p>
                    </div>
                </li>
            );
        });
    };

    if (questionLoading) {
        return <Loader />;
    }
    if (!questionData) return '';
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
                <div className={classes.column}>
                    <div className={classes.faqQuestion}>
                        <div className={classes.faqQuestionImage}>
                            {categoryImage ||(!categoryImage && stateParam) && (
                                <img
                                    src={stateParam ? faqImg : categoryImage}
                                    alt="categoryImage"
                                />
                            )}
                        </div>
                        <div className={classes.questionBlockInfo}>
                            <div className={classes.questionTitleBlock}>
                                <span>{question?.title}</span>
                            </div>
                            <div className={classes.createdBy}>
                                {formatMessage({
                                    id: 'Created by ',
                                    defaultMessage: 'Created by '
                                })}
                                <span>{question?.customer}</span>
                            </div>
                            <div className={classes.questionTimeBlock}>
                                {formatMessage({
                                    id: 'On: ',
                                    defaultMessage: 'On: '
                                })}
                                <span>{question?.time}</span>
                            </div>
                            <div className={classes.questionAnswerBblock}>
                                <RichContent html={question?.answer} />
                            </div>
                        </div>
                    </div>

                    <div className={classes.faqVote}>
                        <div className={classes.label}>
                            <div>
                                {formatMessage({
                                    id: 'Was this article helpful?',
                                    defaultMessage: 'Was this article helpful?'
                                })}
                            </div>
                        </div>
                        <div className={classes.vote}>
                            <div
                                onClick={handleVoteFaq}
                                className={classes.voteLike}
                            >
                                <div
                                    tooltip="Helpful"
                                    className={classes.helpful}
                                >
                                    <AiOutlineLike color="#1b95e0" size={20} />
                                    <span className={classes.counter}>
                                        {question?.helpful_vote}
                                    </span>
                                </div>
                            </div>
                            <div className={classes.voteUnLike}>
                                <div
                                    tooltip="UnHelpful"
                                    className={classes.unHelpful}
                                >
                                    <AiOutlineDislike
                                        color="#ef5350"
                                        size={20}
                                    />
                                    <span className={classes.counter}>
                                        {question?.unhelpful_vote}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {question?.tag && <div className={classes.faqTagBlock}>
                        <div className={classes.tagLabel}>
                            <div>
                                {formatMessage({
                                    id: 'TAG:',
                                    defaultMessage: 'TAG:'
                                })}
                            </div>
                        </div>
                        <div className={classes.faqTag}>
                            <Link
                                className={classes.faqUrl}
                                to={`/faqs/tag/${question.tag}`}
                            >
                                {question.tag}
                            </Link>
                        </div>
                    </div>}
                    {social_button === '1' && (
                        <div className={classes.faqSocialShare}>
                            <div className={classes.jssocialsShares}>
                                <div className={classes.twitter}>
                                    <TwitterShareButton {...shareProps}>
                                        <TwitterIcon size={50} round={false} />
                                    </TwitterShareButton>
                                </div>
                                <div className={classes.facebook}>
                                    <FacebookShareButton {...shareProps}>
                                        <FacebookIcon size={50} round={false} />
                                    </FacebookShareButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {related_faq_show === '1' && (
                    <div className={classes.sidebar}>
                        <div className={classes.wrapperRelated}>
                            <div style={styles} className={classes.relatedFaq}>
                                <div>
                                    {formatMessage({
                                        id: 'Related FAQs',
                                        defaultMessage: 'Related FAQs'
                                    })}
                                </div>
                            </div>
                            <div className={classes.wrapperListFaq}>
                                <ul>{renderRelatedFaq()}</ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaqQuestion;
