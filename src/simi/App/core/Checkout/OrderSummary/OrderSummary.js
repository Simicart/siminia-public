import React from 'react';
import PriceSummary from 'src/simi/App/core/Cart/PriceSummary';
require('./orderSummary.scss')

const OrderSummary = props => {
    return (
        <div className="checkout-order-summery-root">
            <PriceSummary isUpdating={props.isUpdating} />
        </div>
    );
};

export default OrderSummary;
