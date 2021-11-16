import React from 'react';
import { func } from 'prop-types';

import CouponCode from 'src/simi/App/core/Cart/PriceAdjustments/CouponCode/couponCode'
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';

require('./priceAdjustments.scss');

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = props => {
    const { setPageIsUpdating, toggleMessages } = props;

    return (
        <div className="simi-checkout-price-adjustment">
            <CouponCode setIsCartUpdating={setPageIsUpdating} toggleMessages={toggleMessages} defaultOpen={false} />
        </div>
    );
};

PriceAdjustments.propTypes = {
    setPageIsUpdating: func
};

const mapDispatchToProps = {
    toggleMessages
}

export default connect(
    null,
    mapDispatchToProps
)(PriceAdjustments);
