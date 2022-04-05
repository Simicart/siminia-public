import React, { useMemo, useState } from 'react';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import defaultClasses from './reviewItemMb.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import Image from '@magento/venia-ui/lib/components/Image';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { MdKeyboardArrowUp } from 'react-icons/md';
const ReviewItemMb = props => {
    const item = props.review;
    const IMAGE_SIZE = 150;
    const MAX_WIDTH = 120;
    const { product, text, created_at, average_rating, summary } = item;
    const [showMore, setShowMore] = useState(true);
    const { formatMessage } = useIntl();
    const viewMoreHandle = () => {
        setShowMore(!showMore);
    };
    const classes = useStyle(defaultClasses);
    const { url_key, url_suffix, image, name } = product;
    const itemLink = useMemo(
        () => resourceUrl(`/${url_key}${url_suffix || ''}`),
        [url_key, url_suffix]
    );
    let reviewTextWidth;
    const reviewText = document.getElementById(`review + ${created_at}`);
    if (reviewText) {
        reviewTextWidth = reviewText.offsetWidth;
    }
    const showMoreCondition = text.length < MAX_WIDTH ? true : false;
    return (
        <div className={classes.container}>
            <Link to={itemLink} className={classes.imageContainer}>
                <Image
                    alt={product.name}
                    classes={{
                        root: classes.imageRoot,
                        image: classes.image
                    }}
                    width={IMAGE_SIZE}
                    resource={image.url}
                />
            </Link>
            <div className={classes.contentContainer}>
                <div className={classes.name}>
                    <Link to={itemLink}>{name}</Link>
                </div>
                <StaticRate rate={average_rating} />
                <div className={classes.reviewSummary}>{summary}</div>
                <div
                    className={
                        showMore ? classes.reviewText : classes.reviewTextMore
                    }
                    id={`review + ${created_at}`}
                >
                    {text}
                </div>
                <div className={classes.time}>{created_at}</div>
                {!showMoreCondition ? (
                    <div
                        className={classes.reviewButton}
                        onClick={viewMoreHandle}
                    >
                        {showMore ? (
                            <div className={classes.viewDetails}>
                                <FormattedMessage
                                    id={'reviewItem.viewDetails'}
                                    defaultMessage={'View Details'}
                                />
                            </div>
                        ) : (
                            <div className={classes.viewDetails}>
                                <FormattedMessage
                                    id={'reviewItem.viewSummary'}
                                    defaultMessage={'View Summary'}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};
export default ReviewItemMb;
