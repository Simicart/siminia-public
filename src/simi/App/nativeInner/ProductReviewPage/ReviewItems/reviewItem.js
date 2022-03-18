import React, { useEffect, useMemo, useState } from 'react';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import defaultClasses from './reviewItem.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import Image from '@magento/venia-ui/lib/components/Image';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { rewriteURIForGET } from '@apollo/client';
import { set } from 'lodash';

const ReviewItem = props => {
    const item = props.review;
    const IMAGE_SIZE = 150;
    const MAX_WIDTH = 600;
    const { product, text, created_at, average_rating, summary } = item;
    const [showMore, setShowMore] = useState(true);
    const [showMoreCondition, setShowMoreCondition] = useState(true);
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
    useEffect(()=> {
        if(reviewText){
            reviewTextWidth = reviewText.offsetWidth;
            console.log(reviewTextWidth)
            if(reviewTextWidth < MAX_WIDTH){
                setShowMoreCondition(true);
            }
            else{
                setShowMoreCondition(false)
            }
        }
    }, [reviewText]);
    console.log(showMoreCondition)
    
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
                {!showMoreCondition ? (
                    <Button
                        className={classes.reviewButton}
                        onClick={viewMoreHandle}
                    >
                        {showMore ? (
                            <FormattedMessage
                                id={'reviewItem.seeMore'}
                                defaultMessage={'See More'}
                            />
                        ) : (
                            <FormattedMessage
                                id={'reviewItem.seeLess'}
                                defaultMessage={'See Less '}
                            />
                        )}
                    </Button>
                ) : (
                    ''
                )}
                <div className={classes.time}>{created_at}</div>
            </div>
        </div>
    );
};
export default ReviewItem;
