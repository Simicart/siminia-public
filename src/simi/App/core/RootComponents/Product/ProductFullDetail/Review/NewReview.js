import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import classes from './newReview.css';
import { Whitebtn } from 'src/simi/BaseComponents/Button'
import { SwipeableRate } from 'src/simi/BaseComponents/Rate'
import { submitReview } from 'src/simi/Model/Product'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import {showToastMessage} from 'src/simi/Helper/Message'
import {smoothScrollToView} from 'src/simi/Helper/Behavior'

const NewReview = props => {
    const {product} = props
    if (!product.simiExtraField || !product.simiExtraField.app_reviews || !product.simiExtraField.app_reviews.form_add_reviews || !product.simiExtraField.app_reviews.form_add_reviews.length)
        return ''

    const form_add_review = product.simiExtraField.app_reviews.form_add_reviews[0]
    const { rates } = form_add_review
    if (!rates)
        return ''

    const setData = (data) => {
        hideFogLoading()
        smoothScrollToView($('#root'))
        if (data.errors) {
            if (data.errors.length) {
                const errors = data.errors.map(error => {
                    return {
                        type: 'error',
                        message: error.message,
                        auto_dismiss: false
                    }
                })
                props.toggleMessages(errors)
            }
        } else {
            if (data.message && data.message) {
                props.toggleMessages([{
                    type: 'success',
                    message: Array.isArray(data.message)?data.message[0]:data.message,
                    auto_dismiss: false
                }])
            }
        }
    }

    const handleSubmitReview = () => {
        const nickname = $('#new-rv-nickname').val()
        const title = $('#new-rv-title').val()
        const detail = $('#new-rv-detail').val()
        if (!nickname || !title || !detail) {
            showToastMessage(Identify.__('Please fill in all required fields'));
        } else {
            const params = {
                product_id: product.id,
                ratings: {},
                nickname,
                title,
                detail
            };
            const star = $('.select-star');
            for (let i = 0; i < star.length; i++) {
                const rate_key = $(star[i]).attr('data-key');
                const point = $(star[i]).attr('data-point');
                params.ratings[rate_key] = point;
            }
            showFogLoading()
            submitReview(setData, params)
        }
    }
    
    return (
        <div>
            <h2 className={classes.reviewlistTitle}>
                <span>{Identify.__("You're reviewing:")} {Identify.__(product.name)}</span>
            </h2>
            <div className={classes["review-form"]} style={{padding: '8px'}}>
                <p className={classes["your-rating-title"]}>{Identify.__('Your Rating')}</p>
                <table className={classes["table"]}>
                    <tbody>
                    {rates.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td className={classes["label-item"]} width="50px">{Identify.__(item.rate_code)}</td>
                                    <td id={item.rate_code}><SwipeableRate rate={1} size={25} rate_option={item.rate_options} rate_code={item.rate_code} change={true}/></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <div className={classes["form-content"]}>
                    <div className={classes["form-group"]}>
                        <p className={classes["label-item"]}>{Identify.__('Nickname')}<span className={classes["rq"]}>*</span></p>
                        <input type="text" id="new-rv-nickname" className={`form-control`} name="nickname" style={{background : '#f2f2f2'}} required/>
                    </div>
                    <div className={classes["form-group"]}>
                        <p className={classes["label-item"]}>{Identify.__('Title')}<span className={classes["rq"]}>*</span></p>
                        <input type="text" id="new-rv-title" className={`form-control`} name="title" style={{background : '#f2f2f2'}} required/>
                    </div>
                    <div className={classes["form-group"]}>
                        <p className={classes["label-item"]}>{Identify.__('Detail')}<span className={classes["rq"]}>*</span></p>
                        <textarea id="new-rv-detail" name="detail" className={`form-control`} rows="10" style={{background : '#f2f2f2'}}></textarea>
                    </div>
                    <div className={classes["btn-submit-review-ctn"]}>
                        <Whitebtn 
                            text={Identify.__('Submit Review')}
                            className={classes["btn-submit-review"]}
                            onClick={handleSubmitReview}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewReview