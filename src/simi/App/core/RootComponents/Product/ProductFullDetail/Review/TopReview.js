import React from 'react'
import Identify from 'src/simi/Helper/Identify'
import {StaticRate} from 'src/simi/BaseComponents/Rate'
import classes from './TopReview.css'

const TopReview = props => {
    const { app_reviews } = props
    return (
        <div className={classes["review-rate"]}>
            <StaticRate rate={app_reviews.rate} classes={classes}/>
            <span className={classes["review-count"]}>
                ({app_reviews.number} {(app_reviews.number)?Identify.__('Reviews'):Identify.__('Review')})
            </span>
        </div>
    )
}

export default TopReview