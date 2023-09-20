import React from 'react';
import { SwipeableRate } from 'src/simi/BaseComponents/Rate';
import { useIntl } from 'react-intl';

const ProductRating = props => {
    const {
        productReviewRatingsMetadata: ratingData,
        setRatingVal,
        ratingVal,
        classes
    } = props;

    const { formatMessage } = useIntl();

    const changedRating = (newVal, ratingItm) => {
        const newRatingVal = Object.assign({}, ratingVal);
        if (ratingItm.values && ratingItm.values[newVal]) {
            newRatingVal[ratingItm.id] = {
                ...ratingItm.values[newVal],
                rate: newVal
            };
        }
        setRatingVal(newRatingVal);
    };
    if (ratingData && ratingData.items && ratingData.items.length) {
        return (
            <div className={classes.ratingCtn}>
                {ratingData.items.map(ratingItm => {
                    return (
                        <div className={classes.rating} key={ratingItm.name}>
                            <span className={classes.ratingName}>{ratingItm.name}:</span>
                            <SwipeableRate
                                onChange={newVal => {
                                    changedRating(newVal, ratingItm);
                                }}
                                rate={
                                    ratingVal && ratingVal[ratingItm.id]
                                        ? ratingVal[ratingItm.id].rate
                                        : 4
                                }
                                size={20}
                                classes={classes}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
    return <div style={{ color: 'red'}}>{formatMessage({id: 'Review rating not found', defaultMessage: "Review rating not found"})}</div>;
};

export default ProductRating;
