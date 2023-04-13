import React, { useState } from 'react';
import { Star } from 'react-feather';
import { useMutation } from '@apollo/client';
import ReviewStatus from './ReviewStatus';
import convertRatings from '../talons/convertRatings';
import SUBMIT_PREVIEW from '../talons/useSubmitReview';
import {
    changeValueStar,
    changePriceStar,
    changeRatingStar
} from '../functions/gift-card-review/StarHandle';
import '../styles/styles.scss';
import { FormattedMessage } from 'react-intl'

const GiftCardReivew = ({ giftCardData }) => {
    //handle star state
    const [value, setValue] = useState([
        'uncheck',
        'uncheck',
        'uncheck',
        'uncheck',
        'uncheck'
    ]);
    const [price, setPrice] = useState([
        'uncheck',
        'uncheck',
        'uncheck',
        'uncheck',
        'uncheck'
    ]);
    const [rating, setRating] = useState([
        'uncheck',
        'uncheck',
        'uncheck',
        'uncheck',
        'uncheck'
    ]);
    const [valueIndex, setValueIndex] = useState(-1);
    const [priceIndex, setPriceIndex] = useState(-1);
    const [ratingIndex, setRatingIndex] = useState(-1);
    const [starValueError, setStarValueError] = useState(false);
    const [starPriceError, setStarPriceError] = useState(false);
    const [starRatingError, setStarRatingError] = useState(false);

    //review input
    const [nickName, setNickName] = useState('');
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [nickNameError, setNickNameError] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [detailsError, setDetailsError] = useState(false);

    //show review status
    const [showReviewStatus, setShowReviewStatus] = useState(false);
    const [reviewStatus, setReviewStatus] = useState('');
    const [submitButton, setSubmitButton] = useState('Submit');

    //define add review function
    const [
        addReview
    ] = useMutation(SUBMIT_PREVIEW, {
        onCompleted: () => {
            setSubmitButton('Submit');
            setReviewStatus('Submit review successful!');
            setShowReviewStatus(true);
        },
        onError: () => {
            setSubmitButton('Submit');
            setReviewStatus('Some errors occurred. Please try again later');
            setShowReviewStatus(true);
        }
    });

    //handle add review function
    const handleSubmitReview = () => {
        const element1 = document.querySelector('.gift-card-star-wrapper');
        const element2 = document.querySelector('.gift-card-nickname-input');
        const element3 = document.querySelector('.gift-card-title-input');
        const element4 = document.querySelector('.gift-card-details-input');

        if (valueIndex === -1) {
            setStarValueError(true);
        } else setStarValueError(false);
        if (priceIndex === -1) {
            setStarPriceError(true);
        } else setStarPriceError(false);
        if (ratingIndex === -1) {
            setStarRatingError(true);
        } else setStarRatingError(false);
        if (nickName.length === 0) {
            element2.style.borderColor = 'red';
            setNickNameError(true);
        } else {
            setNickNameError(false);
            element2.style.borderColor = 'rgb(223, 225, 226)';
            element2.style.borderWidth = '1px';
        }
        if (title.length === 0) {
            element3.style.borderColor = 'red';
            setTitleError(true);
        } else {
            setTitleError(false);
            element3.style.borderColor = 'rgb(223, 225, 226)';
            element3.style.borderWidth = '1px';
        }
        if (details.length === 0) {
            element4.style.borderColor = 'red';
            setDetailsError(true);
        } else {
            setDetailsError(false);
            element4.style.borderColor = 'rgb(223, 225, 226)';
            element4.style.borderWidth = '1px';
        }

        element2.style.boxShadow = 'none';
        element3.style.boxShadow = 'none';
        element4.style.boxShadow = 'none';

        if (valueIndex === -1) {
            const topHeight = element1.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
        } else if (priceIndex === -1) {
            const topHeight = element1.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
        } else if (ratingIndex === -1) {
            const topHeight = element1.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
        } else if (nickName.length === 0) {
            const topHeight = element2.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element2.style.boxShadow = '0 0 10px #206dac';
            element2.focus({ preventScroll: true });
        } else if (title.length === 0) {
            const topHeight = element3.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element3.style.boxShadow = '0 0 10px #206dac';
            element3.focus({ preventScroll: true });
        } else if (details.length === 0) {
            const topHeight = element4.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element4.style.boxShadow = '0 0 10px #206dac';
            element4.focus({ preventScroll: true });
        } else {
            setSubmitButton('Submitting...');
            const convert = convertRatings(valueIndex, priceIndex, ratingIndex);
            addReview({
                variables: {
                    input: {
                        nickname: nickName,
                        ratings: [
                            {
                                id: 'Mg==',
                                value_id: convert.valueEncoded
                            },
                            {
                                id: 'Mw==',
                                value_id: convert.priceEncoded
                            },
                            {
                                id: 'NA==',
                                value_id: convert.ratingEncoded
                            }
                        ],
                        sku: giftCardData.products.items[0]?.sku,
                        summary: title,
                        text: details
                    }
                }
            });
        }
    };

    return (
        <div className="gift-card-review-wrapper">
            <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>
                <FormattedMessage id="You're reviewing:" defaultMessage="You\'re reviewing:"></FormattedMessage>
                {' '}
                <span style={{ fontWeight: 300 }}>
                    {giftCardData.products.items[0]?.name}
                </span>
            </h1>
            <p
                style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 30,
                    borderBottom: '2px solid gray'
                }}
            >
                <FormattedMessage id='Your rating ' defaultMessage='Your rating '></FormattedMessage>
                <span style={{ color: 'red' }}>
                <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                </span>
            </p>
            <div style={{ marginTop: 40 }}>
                <div className="gift-card-value-rating">
                    <div
                        style={{
                            width: '5%',
                            position: 'relative',
                            height: 20
                        }}
                    >
                        <p style={{ fontSize: 14, position: 'absolute', top: '20%' }}>
                            <FormattedMessage id='Value' defaultMessage='Value'></FormattedMessage>
                        </p>
                    </div>
                    <div className="gift-card-star-wrapper">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {value.map((element, index) => (
                                <Star
                                    key={index}
                                    onClick={() =>
                                        changeValueStar(
                                            index,
                                            setValue,
                                            setValueIndex
                                        )
                                    }
                                    className={`gift-card-star-${element}`}
                                    size={18}
                                />
                            ))}
                        </div>
                        <div style={{ marginTop: 20 }}>
                            {starValueError && (
                                <p style={{ color: 'red' }}>
                                    <FormattedMessage id='Please select at least one star for value above.' 
                                    defaultMessage='Please select at least one star for value above.'></FormattedMessage>     
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="gift-card-price-rating">
                    <div
                        style={{
                            width: '5%',
                            position: 'relative',
                            height: 20
                        }}
                    >
                        <p style={{ fontSize: 14, position: 'absolute', top: '25%' }}>
                            <FormattedMessage id='Price' defaultMessage='Price'></FormattedMessage>
                        </p>
                    </div>
                    <div className="gift-card-star-wrapper">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {price.map((element, index) => (
                                <Star
                                    key={index}
                                    onClick={() =>
                                        changePriceStar(
                                            index,
                                            setPrice,
                                            setPriceIndex
                                        )
                                    }
                                    className={`gift-card-star-${element}`}
                                    size={18}
                                />
                            ))}
                        </div>
                        <div style={{ marginTop: 20 }}>
                            {starPriceError && (
                                <p style={{ color: 'red' }}>
                                    <FormattedMessage id='Please select at least one star for value above.' 
                                    defaultMessage='Please select at least one star for value above.'></FormattedMessage>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="gift-card-rating-rating">
                    <div
                        style={{
                            width: '5%',
                            position: 'relative',
                            height: 20
                        }}
                    >
                        <p style={{ fontSize: 14, position: 'absolute', top: '25%' }}>
                        <FormattedMessage id='Raing' defaultMessage='Rating'></FormattedMessage>
                        </p>
                    </div>
                    <div className="gift-card-star-wrapper">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {rating.map((element, index) => (
                                <Star
                                    key={index}
                                    onClick={() =>
                                        changeRatingStar(
                                            index,
                                            setRating,
                                            setRatingIndex
                                        )
                                    }
                                    className={`gift-card-star-${element}`}
                                    size={18}
                                />
                            ))}
                        </div>
                        <div style={{ marginTop: 20 }}>
                            {starRatingError && (
                                <p style={{ color: 'red' }}>
                                    <FormattedMessage id='Please select at least one star for value above.' 
                                    defaultMessage='Please select at least one star for value above.'></FormattedMessage>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <p
                style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 30,
                    borderBottom: '2px solid gray',
                    marginBottom: 40
                }}
            >
                <FormattedMessage id='User info ' defaultMessage='User info '></FormattedMessage>
                <span style={{ color: 'red' }}>
                    <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                </span>
            </p>
            <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>
                    <FormattedMessage id='Nickname ' defaultMessage='Nickname '></FormattedMessage>
                    <span style={{ color: 'red' }}>
                        <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                    </span>
                </p>
                <input
                    className="gift-card-nickname-input"
                    onChange={e => setNickName(e.target.value)}
                    onFocus={() => {
                        document.querySelector(
                            '.gift-card-nickname-input'
                        ).style.boxShadow = '0 0 10px #206dac';
                    }}
                    onBlur={() => {
                        document.querySelector(
                            '.gift-card-nickname-input'
                        ).style.boxShadow = 'none';
                    }}
                />
                {nickNameError && (
                    <p style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                        <FormattedMessage id='This is a required field.' defaultMessage='This is a required field.'></FormattedMessage>
                    </p>
                )}
            </div>
            <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>
                    <FormattedMessage id='Title ' defaultMessage='Title'></FormattedMessage>
                    <span style={{ color: 'red' }}>
                        <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                    </span>
                </p>
                <input
                    className="gift-card-title-input"
                    onChange={e => setTitle(e.target.value)}
                    onFocus={() => {
                        document.querySelector(
                            '.gift-card-title-input'
                        ).style.boxShadow = '0 0 10px #206dac';
                    }}
                    onBlur={() => {
                        document.querySelector(
                            '.gift-card-title-input'
                        ).style.boxShadow = 'none';
                    }}
                />
                {titleError && (
                    <p style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                        <FormattedMessage id='This is a required field.' defaultMessage='This is a required field.'></FormattedMessage>
                    </p>
                )}
            </div>
            <div>
                <p style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>
                    <FormattedMessage id='Details ' defaultMessage='Details '></FormattedMessage>
                    <span style={{ color: 'red' }}>
                        <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                    </span>
                </p>
                <textarea
                    className="gift-card-details-input"
                    onChange={e => setDetails(e.target.value)}
                    onFocus={() => {
                        document.querySelector(
                            '.gift-card-details-input'
                        ).style.boxShadow = '0 0 10px #206dac';
                    }}
                    onBlur={() => {
                        document.querySelector(
                            '.gift-card-details-input'
                        ).style.boxShadow = 'none';
                    }}
                />
                {detailsError && (
                    <p style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                        <FormattedMessage id='This is a required field.' defaultMessage='This is a required field.'></FormattedMessage>
                    </p>
                )}
            </div>
            <div
                className={
                    submitButton === 'Submitting...'
                        ? 'gift-card-submit-review-loading-button'
                        : 'gift-card-submit-review-button'
                }
            >
                <button
                    style={{ width: '100%', height: '100%' }}
                    onClick={handleSubmitReview}
                >
                    {submitButton}
                </button>
            </div>
            <ReviewStatus
                showReviewStatus={showReviewStatus}
                reviewStatus={reviewStatus}
                setShowReviewStatus={setShowReviewStatus}
            />
        </div>
    );
};

export default GiftCardReivew;
