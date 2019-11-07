import React from 'react'
import Identify from 'src/simi/Helper/Identify'
import {StaticRate} from 'src/simi/BaseComponents/Rate'

require('./topReview.scss')

const TopReview = props => {
    const { app_reviews } = props
    return (
        <div className="review-rate">
            <StaticRate rate={app_reviews.rate}/>
            <span className="review-count">
                ({app_reviews.number} {(app_reviews.number)?Identify.__('Reviews'):Identify.__('Review')})
            </span>
        </div>
    )
}

export default TopReview