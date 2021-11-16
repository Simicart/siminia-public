import React from 'react';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import { SwipeableRate } from 'src/simi/BaseComponents/Rate';
import { showToastMessage } from 'src/simi/Helper/Message';
require('./newReview.scss');

const NewReview = props => {
    const { product, isSignedIn, firstname, lastname, onSubmitReview } = props;
    const { sku } = product;

    const storeConfig = Identify.getStoreConfig();
    const ratingForm = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config.rating_form || null;
    const allowGuestReview = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config.catalog.review.hasOwnProperty('catalog_review_allow_guest') ? Number(storeConfig.simiStoreConfig.config.catalog.review.catalog_review_allow_guest) : 1;
    if (!ratingForm) return null;

    let nickname = isSignedIn ? `${firstname} ${lastname}` : '';

    const handleSubmitReview = () => {
        const reviewForm = $('.review-form');
        const nickname = reviewForm.find('#new-rv-nickname').val().trim();
        const summary = reviewForm.find('#new-rv-title').val().trim();
        const text = reviewForm.find('#new-rv-detail').val().trim();
        if (!isSignedIn && !allowGuestReview) {
            showToastMessage(Identify.__('Guest could not write review!'));
            return;
        }

        if (!nickname || !summary || !text) {
            showToastMessage(Identify.__('Please fill in all required fields'));
        } else {
            const starRate = reviewForm.find('.select-star');
            const ratings = [];
            for (let i = 0; i < starRate.length; i++) {
                const rate_key = $(starRate[i]).attr('data-key');
                const point = $(starRate[i]).attr('data-point');
                const objRateItem = {
                    id: btoa(rate_key),
                    value_id: btoa(point)
                };
                ratings.push(objRateItem);
            }
            const params = {
                sku,
                nickname,
                summary,
                text,
                ratings
            };
            onSubmitReview(params);
        }
    }

    return (
        <div>
            <h2 className="review-list-title">
                <span>{Identify.__("You're reviewing:")} {Identify.__(product.name)}</span>
            </h2>
            <div className="review-form" style={{ padding: '8px' }}>
                <p className="your-rating-title">{Identify.__('Your Rating')}</p>
                <table className="table">
                    <tbody>
                        {ratingForm.map((item, index) => (<tr key={index}>
                            <td className="label-item" width="50px">{Identify.__(item.rate_code)}</td>
                            <td id={item.rate_code}><SwipeableRate rate={1} size={25} rate_option={item.rate_options} rate_code={item.rate_code} change={true} /></td>
                        </tr>))}
                    </tbody>
                </table>
                <div className="form-content">
                    <div className="form-group">
                        <p className="label-item">{Identify.__('Nickname')}<span className="rq">*</span></p>
                        <input type="text" id="new-rv-nickname" className="form-control" name="nickname" style={{ background: '#f2f2f2' }} required defaultValue={nickname} />
                    </div>
                    <div className="form-group">
                        <p className="label-item">{Identify.__('Title')}<span className='rq'>*</span></p>
                        <input type="text" id="new-rv-title" className="form-control" name="title" style={{ background: '#f2f2f2' }} required />
                    </div>
                    <div className="form-group">
                        <p className="label-item">{Identify.__('Detail')}<span className="rq">*</span></p>
                        <textarea id="new-rv-detail" name="detail" className={`form-control`} rows="10" style={{ background: '#f2f2f2' }}></textarea>
                    </div>
                    <div className="btn-submit-review-ctn">
                        <Whitebtn
                            text={Identify.__('Submit Review')}
                            className="btn-submit-review"
                            onClick={handleSubmitReview} />
                    </div>
                </div>
            </div>
        </div>
    );

}

const mapStateToProps = ({ user }) => {
    const { currentUser } = user;
    const { firstname, lastname } = currentUser;

    return {
        firstname,
        lastname
    };
}


export default connect(mapStateToProps, null)(NewReview);
