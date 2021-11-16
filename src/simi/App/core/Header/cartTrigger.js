import React from 'react';
import { connect } from 'src/drivers';
import { compose } from 'redux';

import CartCounter from './cartCounter';

import Basket from "src/simi/BaseComponents/Icon/Basket";
import classify from 'src/classify';
import defaultClasses from './cartTrigger.css'
import Identify from 'src/simi/Helper/Identify'
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger';
import { GET_CART_DETAILS as GET_CART_DETAILS_QUERY } from 'src/simi/App/core/Cart/cartPage.gql';
import { GET_ITEM_COUNT_QUERY } from './cartTrigger.gql';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';

const Trigger = props => {
    const { storeConfig, classes } = props;

    const { handleClick, itemCount: itemsQty, isPhone } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        },
        storeConfig,
        isBasicTheme: true
    });

    const iconColor = 'rgb(var(--venia-global-color-text))';
    const svgAttributes = {
        stroke: iconColor
    };
    if (itemsQty > 0) {
        svgAttributes.fill = iconColor;
    }

    const cartIcon = <React.Fragment>
        <div className={classes['item-icon']} style={{ display: 'flex', justifyContent: 'center' }}>
            <Basket style={{ width: 30, height: 30, display: 'block', margin: 0 }} />
        </div>
        {!isPhone &&
            <div className={classes['item-text']}>
                {Identify.__('Basket')}
            </div>
        }
    </React.Fragment>

    return (
        <div role="presentation" className={classes.root} aria-label="Open cart page" onClick={handleClick}>
            {cartIcon}
            <CartCounter counter={itemsQty ? itemsQty : 0} />
        </div>
    )
}


/* export class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        itemsQty: PropTypes.number
    };

    get cartIcon() {
        const {
            classes,
            cart: { details }
        } = this.props;
        const itemsQty = details.items_qty;
        const iconColor = 'rgb(var(--venia-global-color-text))';
        const svgAttributes = {
            stroke: iconColor
        };
        const isPhone = window.innerWidth < 1024
        if (itemsQty > 0) {
            svgAttributes.fill = iconColor;
        }
        return (
            <React.Fragment>
                <div className={classes['item-icon']} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Basket style={{ width: 30, height: 30, display: 'block', margin: 0 }} />
                </div>
                {!isPhone &&
                    <div className={classes['item-text']}>
                        {Identify.__('Basket')}
                    </div>
                }
            </React.Fragment>
        )
    }

    render() {
        const {
            classes,
            cart: { details }
        } = this.props;
        const { cartIcon } = this;
        const itemsQty = details.items_qty;
        return (
            <Link
                to={resourceUrl('/cart.html')}
                className={classes.root}
                aria-label="Open cart page"
            >
                {cartIcon}
                <CartCounter counter={itemsQty ? itemsQty : 0} />
            </Link>
        )
    }
} */

const mapStateToProps = ({ simireducers }) => {
    const { storeConfig } = simireducers;
    return {
        storeConfig
    }
}

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(Trigger);
