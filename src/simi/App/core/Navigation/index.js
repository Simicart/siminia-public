export { default as Navigation } from './navigation';

import { connect } from 'src/drivers';
import { closeDrawer } from 'src/actions/app';
import { createCart, getCartDetails } from 'src/actions/cart';
import Navigation from './navigation';

const mapStateToProps = ({ app, cart, simireducers }) => {
    const { drawer } = app
    const { cartId } = cart
    const { storeConfig } = simireducers;
    return {
        drawer,
        cartId,
        storeConfig
    }
}
const mapDispatchToProps = {
    closeDrawer,
    createCart,
    getCartDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
