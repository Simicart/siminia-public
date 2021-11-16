import React from 'react';
import ProductFullDetail from './ProductFullDetail';

import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { useWindowSize } from '@magento/peregrine';

const mapDispatchToProps = {
    toggleMessages
};

const HOProductDetails = props => {
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
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
