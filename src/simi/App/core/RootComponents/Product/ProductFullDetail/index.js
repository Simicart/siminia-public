import React from 'react';
import ProductFullDetail from './ProductFullDetail';

import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

const mapDispatchToProps = {
    toggleMessages
};

const HOProductDetails = props => {
    const isPhone = window.innerWidth < 1024;
    return <ProductFullDetail {...props} isPhone={isPhone} />
}

const mapStateToProps = ({ cart }) => {
    const { cartId } = cart
    return {
        cartId
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HOProductDetails);
