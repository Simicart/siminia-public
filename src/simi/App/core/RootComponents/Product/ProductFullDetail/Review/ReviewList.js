import React, { useState, useEffect } from 'react';
import {getReviews} from 'src/simi/Model/Product';
import Loading from 'src/simi/BaseComponents/Loading';
import Identify from 'src/simi/Helper/Identify';
import Pagination from 'src/simi/BaseComponents/Pagination';
import {StaticRate} from 'src/simi/BaseComponents/Rate'

require('./reviewList.scss');

const ReviewList = props => {

    const {product_id} = props;
    const api_data = Identify.ApiDataStorage('product_list_review');
    const initData = (api_data && api_data instanceof Object && api_data.hasOwnProperty(product_id))?api_data[product_id]:null

    const [data, setData] = useState(initData)

    const renderListItem = () => {
        if(data && data.reviews && data.reviews.length) {
            return (
                <div className="list-review-item">
                    <Pagination data={data.reviews} renderItem={renderItem} />
                </div>
            )
        }
        return <div className="text-center">
            {Identify.__('Review is empty')}
        </div>
    };

    const renderItem = (item)=>{
        if(item.hasOwnProperty('votes')){
            const rating_votes = item.votes.map((rate, index) => {
                const point = rate.value;
                return (
                   <div className="rating-votes" key={index}>
                       <div className="label-rate">{Identify.__(rate.label)}</div>
                       <div className="item-rating"><Rate rate={parseInt(point,10)} size={13}/></div>
                   </div>
               )
            });
            const created = (
                        <div className="item-created flex">
                            <span>{item.created_at}</span>
                            <span style={{margin : '0 5px'}}>{Identify.__('By')}</span>
                            <span>{item.nickname}</span>
                        </div>
                    )
            return(
                <div className="review-item item" key={item.review_id}>
                    <div className="item-title flex">{item.title}</div>
                    <div className="review-item-detail">
                        <div className="item-votes">
                            {rating_votes}
                        </div>
                        <div className="item-review-content" >
                            <div className="item-detail">{item.detail}</div>
                            {created}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            )
        }

        return(
            <div className="review-item item" key={item.review_id}>
                <div className="item-title flex">{item.title}</div>
                <div className="review-item-detail">
                    <div className="item-rate"><StaticRate rate={item.rate_points} /></div>
                    <div className="item-created flex" style={{marginLeft : Identify.isRtl() ? 0 : 'auto',marginRight : Identify.isRtl() ? 'auto' : 0}}>
                        <span>{item.created_at}</span>
                        <span style={{margin : '0 5px'}}>By</span>
                        <span>{item.nickname}</span>
                    </div>
                </div>
                <div className="item-detail">{item.detail}</div>
            </div>
        )
    };

    useEffect(() => {
        if(!data) {
            getReviews(apiCallBack, product_id)
        }
    });

    const apiCallBack = (data) => {
        if (data.errors) {
            const errors = data.errors;
            let text = "";
            for (const i in errors) {
                const error = errors[i];
                text += error.message + ' ';
            }
            if (text !== "") {
                Identify.showToastMessage(text);
            }
        } else {
            setData(data)
            const api_data = {};
            api_data[props.product_id] = data
            Identify.ApiDataStorage('product_list_review','update',api_data)
        }
    }

    if(!data){
        return (<Loading />);
    }

    return (
        <div>
            <h2 className="review-list-title">
                <span>{Identify.__('Customer Reviews')}</span>
            </h2>
            {renderListItem()}
        </div>
    )
}
export default ReviewList