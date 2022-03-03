import React, { useMemo } from 'react';
import './style.css';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const CarouselShimmer = props => {
    return (
        <div className="product-detail-carousel shimmer">
            <Shimmer width="100%" height="700px" />
        </div>
    )
};

export default CarouselShimmer;
