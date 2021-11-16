import CartPage from './cartPage';
import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

const mapDispatchToProps = {
    toggleMessages
};

export default connect(
    null,
    mapDispatchToProps
)(CartPage);
