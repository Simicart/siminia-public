import React from 'react';
import Loading from 'src/simi/BaseComponents/Loading/ReactLoading';
import Identify from 'src/simi/Helper/Identify';


const Pagination = (props) => {
    const { loading, loadMoreReview, currentPage } = props;

    if (loading) return <Loading />

    return (
        <div className="load-more" role="presentation" onClick={() => loadMoreReview(currentPage + 1)} >
            <div className="btn-load-more">{Identify.__('See More')}</div>
        </div>
    )
}

export default Pagination;
