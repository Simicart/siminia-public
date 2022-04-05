import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useHistory } from 'react-router-dom';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useIntl } from 'react-intl';
import defaultClasses from './productreview.module.css';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import { XSquare, X } from 'react-feather';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { Form } from 'informed';
import useProductReview from '../../../../talons/ProductFullDetail/useProductReview';
import ProductRating from './ProductRating';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { configColor } from 'src/simi/Config';
import Identify from 'src/simi/Helper/Identify';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import DataStructure from '../../Seo/Markup/Product';
import DataStructureBasic from '../../SeoBasic/Markup/Product';

const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

// require('./productReview.scss');
const ProductReview = forwardRef((props, ref) => {
    const { product } = props;
    const history = useHistory();
    const storeConfig = Identify.getStoreConfig();
    const enabledReview =
        storeConfig &&
        storeConfig.storeConfig &&
        parseInt(storeConfig.storeConfig.product_reviews_enabled);
    const enabledGuestReview =
        storeConfig &&
        storeConfig.storeConfig &&
        parseInt(storeConfig.storeConfig.allow_guests_to_write_product_reviews);

    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();
    const [isOpen, setIsOpen] = useState(false);
    const [ratingVal, setRatingVal] = useState({});
    const [showItem, setShowItem] = useState(1);

    const {
        data,
        loading,
        submitReviewLoading,
        submitReview
    } = useProductReview({
        product,
        setIsOpen,
        enabledReview,
        enabledGuestReview
    });

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    useImperativeHandle(ref, () => {
        return {
            togglePopup: togglePopup
        };
    });

    const reviews =
        data && data.products.items[0] ? data.products.items[0].reviews : false;
    if (!enabledReview) return '';
    const handleSubmitReview = formVal => {
        const valueToSubmit = { ...formVal, ...{ sku: product.sku } };
        const ratingArr = [];
        const ratingData =
            data && data.productReviewRatingsMetadata
                ? data.productReviewRatingsMetadata
                : [];

        if (ratingData && ratingData.items && ratingData.items.length) {
            ratingData.items.map(item => {
                let value = false;
                if (item.id && ratingVal[item.id])
                    value = ratingVal[item.id].value_id;
                else if (item.values && item.values[4])
                    value = item.values[4].value_id;
                if (value)
                    ratingArr.push({
                        id: item.id,
                        value_id: value
                    });
            });
        }
        valueToSubmit.ratings = ratingArr;
        submitReview({
            variables: {
                reviewInput: valueToSubmit
            }
        });
    };
    const countRating = reviews => {
        let arr = [0, 0, 0, 0, 0];
        if (reviews.items.length > 0) {
            reviews.items.forEach((item, index) => {
                if (
                    item &&
                    item.ratings_breakdown &&
                    item.ratings_breakdown[0]
                ) {
                    if (item.ratings_breakdown[0].value == 1) {
                        arr[0] = arr[0] + 1;
                    }
                    if (item.ratings_breakdown[0].value == 2) {
                        arr[1] = arr[1] + 1;
                    }
                    if (item.ratings_breakdown[0].value == 3) {
                        arr[2] = arr[2] + 1;
                    }
                    if (item.ratings_breakdown[0].value == 4) {
                        arr[3] = arr[3] + 1;
                    }
                    if (item.ratings_breakdown[0].value == 5) {
                        arr[4] = arr[4] + 1;
                    }
                }
            });
            return arr;
        }
        return null;
    };
    const popupWriteReview = () => {
        let html = null;
        html = (
            <div className={classes.mainPopup}>
                <div className={classes.heading}>
                    <div className={classes.closeBtn}>
                        <button onClick={togglePopup}>
                            <X />
                        </button>
                    </div>
                    <img
                        className={classes.reviewImage}
                        src={product.small_image}
                        alt="review"
                    />
                    <p className={classes.reviewProductName}>{product.name}</p>
                </div>
                <div className={classes.fieldsContainer}>
                    <div className={classes.content}>
                        <p>Required fileds are maked with *</p>
                    </div>
                    {data && data.productReviewRatingsMetadata ? (
                        <ProductRating
                            productReviewRatingsMetadata={
                                data.productReviewRatingsMetadata
                            }
                            {...{ setRatingVal, ratingVal, classes }}
                        />
                    ) : (
                        ''
                    )}
                    <Form onSubmit={handleSubmitReview} id="form-write-review">
                        <Field required={true}>
                            <TextInput
                                placeholder={formatMessage({
                                    id: 'Name',
                                    defaultMessage: 'Name'
                                })}
                                field="nickname"
                                type="text"
                                validate={isRequired}
                            />
                        </Field>
                        <Field required={true}>
                            <TextInput
                                placeholder={formatMessage({
                                    id: 'Title',
                                    defaultMessage: 'Title'
                                })}
                                field="summary"
                                type="text"
                                validate={isRequired}
                            />
                        </Field>
                        <Field required={true}>
                            <TextInput
                                placeholder={formatMessage({
                                    id: 'Description',
                                    defaultMessage: 'Description'
                                })}
                                field="text"
                                type="text"
                                validate={isRequired}
                            />
                        </Field>
                        <div className={classes.submitBtnContainer}>
                            <button
                                className={classes.submitReviewBtn}
                                type="submit"
                            >
                                {submitReviewLoading
                                    ? formatMessage({
                                          id: 'Loading'
                                      }).toUpperCase()
                                    : formatMessage({
                                          id: 'Submit Review'
                                      }).toUpperCase()}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        );
        return html;
    };
    const reviewRating = () => {
        let html = null;
        const arr = countRating(reviews);
        const formatArr =
            arr && arr.length
                ? arr.map(item => {
                      if (item < 10) {
                          return `0${item}`;
                      } else return item;
                  })
                : [];
        html = (
            <div className="ratingBlock">
                <div className="ratingSummary">
                    <span>{(product.rating_summary * 5) / 100}/5</span>
                    <div>
                        <StaticRate
                            rate={parseInt(product.rating_summary)}
                            classes={{
                                'static-rate': classes['static-rate']
                            }}
                            size={25}
                            backgroundColor={configColor.content_color}
                        />
                    </div>
                </div>

                <div className="rating">
                    <StaticRate
                        rate={100}
                        classes={{
                            'static-rate': classes['static-rate']
                        }}
                        size={25}
                        backgroundColor={configColor.content_color}
                    />
                    <span className="count">{formatArr[4]}</span>
                </div>
                <div className="rating">
                    <StaticRate
                        rate={80}
                        classes={{
                            'static-rate': classes['static-rate']
                        }}
                        size={25}
                        backgroundColor={configColor.content_color}
                    />
                    <span className="count">{formatArr[3]}</span>
                </div>
                <div className="rating">
                    <StaticRate
                        rate={60}
                        classes={{
                            'static-rate': classes['static-rate']
                        }}
                        size={25}
                        backgroundColor={configColor.content_color}
                    />
                    <span className="count">{formatArr[2]}</span>
                </div>
                <div className="rating">
                    <StaticRate
                        rate={40}
                        classes={{
                            'static-rate': classes['static-rate']
                        }}
                        size={25}
                        backgroundColor={configColor.content_color}
                    />
                    <span className="count">{formatArr[1]}</span>
                </div>
                <div className="rating">
                    <StaticRate
                        rate={20}
                        classes={{
                            'static-rate': classes['static-rate']
                        }}
                        size={25}
                        backgroundColor={configColor.content_color}
                    />
                    <span className="count">{formatArr[0]}</span>
                </div>
            </div>
        );
        return html;
    };
    const itemPerPage = reviews => {
        let showItemsReview;
        if (reviews.items.length > 0) {
            if (showItem * 3 <= reviews.items.length) {
                showItemsReview = reviews.items.slice(0, showItem * 3);
            } else showItemsReview = reviews.items;
        } else return null;
        return showItemsReview;
    };

    const renderReviews = reviews => {
        let html = null;
        if (reviews.items.length > 0) {
            const listItem = itemPerPage(reviews);

            html = listItem.map((item, index) => {
                const dateFormat = date => {
                    const mystring = date;
                    const arrayStrig = mystring.split(' ');
                    return arrayStrig[0];
                };

                return (
                    <div key={index} className="review-item">
                        <div className="review-item-head">
                            <div>
                                <span>{dateFormat(item.created_at)}</span>
                                <span>.</span>
                                <span>{item.nickname}</span>
                            </div>
                            {item &&
                            item.ratings_breakdown &&
                            item.ratings_breakdown[0] ? (
                                <div className="rating-star">
                                    <StaticRate
                                        rate={
                                            parseInt(
                                                item.ratings_breakdown[0].value
                                            ) * 20
                                        }
                                        classes={{
                                            'static-rate':
                                                classes['static-rate']
                                        }}
                                        backgroundColor={
                                            configColor.content_color
                                        }
                                    />
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="summary">
                            {item.summary.toUpperCase()}
                        </div>
                        <div className="review-text">{item.text}</div>
                    </div>
                );
            });
            return html;
        } else return null;
    };
    const items = (reviews && reviews.items) || [];
    const classes = mergeClasses(props.classes, defaultClasses);
    return reviews && reviews.items && reviews.items.length != 0 ? (
        <div className="reviewsContainer">
            {mageworxSeoEnabled ? (
                <DataStructure reviews={items} />
            ) : (
                <DataStructureBasic reviews={items} />
            )}
            <div className="reviewBtn">
                <span className="QtyReivew">
                    {reviews.items.length}{' '}
                    {formatMessage({
                        id: 'Review',
                        defaultMessage: 'Review'
                    })}
                </span>
                <button
                    className={classes.writeRWBtn}
                    onClick={() => {
                        if (!isSignedIn && !enabledGuestReview) {
                            history.push('/sign-in');
                            return;
                        }
                        togglePopup();
                    }}
                >
                    {formatMessage({
                        id: 'Add Your Review',
                        defaultMessage: 'Add Your Review'
                    })}
                </button>
            </div>
            <div className="reviewItems">
                <div className="reviewRatingBlock">{reviewRating()}</div>
                <div className="reviewList">
                    {renderReviews(reviews)}
                    {showItem * 3 < reviews.items.length && (
                        <div className="btnShowMore">
                            <button
                                onClick={() => {
                                    setShowItem(showItem + 1);
                                }}
                            >
                                {formatMessage({
                                    id: 'Show more',
                                    defaultMessage: 'Show more'
                                })}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div
                className={isOpen ? classes.overlayActive : classes.overlayNone}
            >
                {isOpen ? popupWriteReview() : null}
            </div>
        </div>
    ) : (
        <div className={isOpen ? classes.overlayActive : classes.overlayNone}>
            {isOpen ? popupWriteReview() : null}
        </div>
    );
});
export default ProductReview;
