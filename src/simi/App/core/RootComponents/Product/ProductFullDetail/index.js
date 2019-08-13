import ProductFullDetail from './ProductFullDetail';

import { connect } from 'src/drivers';
import { addItemToCart, updateItemInCart } from 'src/actions/cart';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

const mapDispatchToProps = {
    addItemToCart,
    updateItemInCart,
    toggleMessages
};

const mapStateToProps = ({ user }) => { 
    const { isSignedIn } = user;
    return {
        isSignedIn
    }; 
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductFullDetail);
