import React, { Fragment, Suspense, useEffect } from 'react';
import { connect } from 'src/drivers';

import CartCounter from './cartCounter';

import Basket from 'src/simi/BaseComponents/Icon/Basket';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import defaultClasses from './cartTrigger.module.css';
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger';
import { GET_CART_DETAILS as GET_CART_DETAILS_QUERY } from 'src/simi/App/core/Cart/cartPage.gql';
import { GET_ITEM_COUNT_QUERY } from './cartTrigger.gql';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { useIntl } from 'react-intl';

const MiniCart = React.lazy(() => import('src/simi/App/nativeInner/MiniCart'));

let miniCartOpenOnce = false;

const Trigger = props => {
    const { storeConfig, classes: propClasses } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();

    const {
        isPhone,
        handleLinkClick,
        handleTriggerClick,
        itemCount: itemsQty,
        miniCartRef,
        miniCartIsOpen,
        hideCartTrigger,
        setMiniCartIsOpen,
        miniCartTriggerRef
    } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        },
        storeConfig
    });

    const iconColor = 'rgb(var(--venia-global-color-text))';
    const svgAttributes = {
        stroke: iconColor
    };
    if (itemsQty > 0) {
        svgAttributes.fill = iconColor;
    }

    useEffect(() => {
        if (miniCartIsOpen) miniCartOpenOnce = true;
    }, [miniCartIsOpen]);

    const cartIcon = (
        <Fragment>
            <div
                className={classes['item-icon']}
                style={{ display: 'flex', justifyContent: 'center' }}
                ref={miniCartTriggerRef}
            >
                <Basket
                    style={{
                        width: 30,
                        height: 30,
                        display: 'block',
                        margin: 0
                    }}
                />
                <CartCounter counter={itemsQty ? itemsQty : 0} />
            </div>
            {!isPhone && (
                <div className={classes['item-text']}>
                    {formatMessage({ id: 'Cart' })}
                </div>
            )}
        </Fragment>
    );

    return (
        <Fragment>
            <div
                role="presentation"
                className={classes.root}
                aria-label="Open cart page"
                onClick={
                    isPhone || hideCartTrigger
                        ? handleLinkClick
                        : handleTriggerClick
                }
            >
                {cartIcon}
            </div>
            {miniCartIsOpen || miniCartOpenOnce ? (
                <Suspense fallback={null}>
                    <MiniCart
                        isOpen={miniCartIsOpen}
                        setIsOpen={setMiniCartIsOpen}
                        ref={miniCartRef}
                        classes={{
                            root: classes['minicartRoot'] + ' container',
                            root_open:
                                classes['minicartRootOpen'] + ' container',
                            checkoutButton: classes['checkoutButton'],
                            body: classes['miniCartBody']
                        }}
                    />
                </Suspense>
            ) : (
                ''
            )}
        </Fragment>
    );
};

const mapStateToProps = ({ simireducers }) => {
    const { storeConfig } = simireducers;
    return {
        storeConfig
    };
};

export default connect(
    mapStateToProps,
    null
)(Trigger);
