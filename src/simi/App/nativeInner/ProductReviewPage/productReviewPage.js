import React, { useCallback, useEffect, useMemo, useState } from 'react';
import defaultClasses from './productReviewPage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import LeftMenu from '../../core/LeftMenu/leftMenu';
import { useGetProductReview } from './useGetProductReview';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import { FormattedMessage, useIntl } from 'react-intl';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import ReviewItem from './ReviewItems/reviewItem';
import ReviewItemMb from './ReviewItems/reviewItemMb';

const ProductReviewPage = props => {
    const talonProps = useGetProductReview();
    const {
        errorMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        reviews,
        pageInfo
    } = talonProps;
    const classes = useStyle(defaultClasses);
    const [width, setWidth] = useState(window.innerWidth);
    const isMobileSite = window.innerWidth <= 768;
    useEffect(() => {
        const handleSize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleSize);
        //clean
        return () => {
            window.removeEventListener('resize', handleSize);
        };
    }, []);

    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'productReviewPage.pageTitleText',
        defaultMessage: 'My Product Reviews'
    });
    const reviewTotal = reviews.length ? (
        <span>
            {' '}
            {reviews.length}
            <FormattedMessage
                id={'productReviewPage.totalCount'}
                defaultMessage={' Reviews'}
            />
        </span>
    ) : null;
    const reviewItems = useMemo(() => {
        return reviews.map(review => {
            if (width < 767) {
                return <ReviewItemMb review={review} />;
            }
            return <ReviewItem review={review} />;
        });
    }, [reviews]);
    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && !reviews.length) {
            return (
                <div style={{textAlign: 'center'}}>
                    <h3>
                        <FormattedMessage
                            id={'productReviewPage.emptyDataMessage'}
                            defaultMessage={"You don't have any reviews yet."}
                        />
                    </h3>
                </div>
            );
        } else {
            return (
                <div className={classes.reviewContainer}>
                    <div className={classes.heading}>{PAGE_TITLE}</div>
                    <div className={classes.headingTotal}>{reviewTotal}</div>
                    {reviewItems}
                </div>
            );
        }
    }, [
        classes.emptyReviewMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        reviews.length
    ]);
    return (
        <div className={`${classes.root} ${!isMobileSite ? 'container' : ''}`}>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div className={classes.wrapper}>
                <LeftMenu label="Product Review" />
                <div className={classes.container}>{pageContents}</div>
            </div>
        </div>
    );
};
export default ProductReviewPage;
