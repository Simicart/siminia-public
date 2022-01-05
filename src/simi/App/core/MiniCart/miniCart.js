import React, { Fragment, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    Lock as LockIcon,
    AlertCircle as AlertCircleIcon
} from 'react-feather';
import { bool, shape, string } from 'prop-types';

import { useScrollLock, Price, useToasts } from '@magento/peregrine';
import { useMiniCart } from '../../../talons/MiniCart/useMiniCart';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';
import ProductList from './ProductList';
import defaultClasses from './miniCart.module.css';
import operations from './miniCart.gql';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 * @param {Function} props.setIsOpen - Function to toggle mini cart
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart({
        setIsOpen,
        operations
    });
    
    const {
        closeMiniCart,
        errorMessage,
        handleEditCart,
        handleProceedToCheckout,
        handleRemoveItem,
        loading,
        productList,
        subTotal,
        totalQuantity,
        configurableThumbnailSource,
        storeUrlSuffix
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;
    const quantityClassName = loading
        ? classes.quantity_loading
        : classes.quantity;
    const priceClassName = loading ? classes.price_loading : classes.price;

    const isCartEmpty = !(productList && productList.length);

    const [, { addToast }] = useToasts();
   
    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, errorMessage]);

    const header = subTotal ? (
        <Fragment>
            <div className={classes.stockStatusMessageContainer}>
                <StockStatusMessage cartItems={productList} />
            </div>
            {/* <span className={quantityClassName}>
                <FormattedMessage
                    id={'miniCart.totalQuantity'}
                    defaultMessage={'Items'}
                    values={{ totalQuantity }}
                />
            </span> */}
            <span className={priceClassName}>
                <span className={classes.labelSubtotal}>
                    <FormattedMessage
                        id={'miniCart.subtotal'}
                        defaultMessage={'Subtotal'}
                    />
                </span>
                <span className={classes.priceSubtotal}>
                    <Price
                        currencyCode={subTotal.currency}
                        value={subTotal.value}
                    />
                </span>
                <span className={classes.labelGrandTotal}>
                    <FormattedMessage
                        id={'miniCart.grandTotal'}
                        defaultMessage={'Grand Total'}
                    />
                </span>
                <span className={classes.priceGrandTotal}>
                    <Price
                        currencyCode={subTotal.currency}
                        value={subTotal.value}
                    />
                </span>
            </span>
        </Fragment>
    ) : null;

    const contents = isCartEmpty ? (
        <div className={classes.emptyCart}>
            <div className={classes.emptyMessage}>
                <FormattedMessage
                    id={'miniCart.empty'}
                    defaultMessage={'YOUR CART IS EMPTY'}
                />
                <button className={classes.continue}>
                    <FormattedMessage
                        id={'miniCart.continue'}
                        defaultMessage={'Continue Shopping'}
                    />
                </button>
                
            </div>
        </div>
    ) : (
        <Fragment>
            <div className={classes.body}>
                <div className={classes.title}>
                    <FormattedMessage
                        id={'miniCart.title'}
                        defaultMessage={'SHOPPING CART'}
                    />
                </div>
                <ProductList
                    items={productList}
                    loading={loading}
                    handleRemoveItem={handleRemoveItem}
                    closeMiniCart={closeMiniCart}
                    configurableThumbnailSource={configurableThumbnailSource}
                    storeUrlSuffix={storeUrlSuffix}
                />
            </div>
            <div className={classes.header}>{header}</div>
            <div className={classes.footer}>
                <Button
                    onClick={handleEditCart}
                    priority="high"
                    className={classes.viewCartButton}
                    disabled={loading || isCartEmpty}
                >
                    <FormattedMessage
                        id={'miniCart.viewCart'}
                        defaultMessage={'View Cart'}
                    />
                </Button>
                <Button
                    onClick={handleProceedToCheckout}
                    priority="high"
                    className={classes.goToCheckoutButton}
                    disabled={loading || isCartEmpty}
                >
                    <FormattedMessage
                        id={'miniCart.gotocheckout'}
                        defaultMessage={'GO TO CHECKOUT'}
                    />
                </Button>
            </div>
        </Fragment>
    );

    return (
        <aside className={rootClass}>
            <div ref={ref} className={contentsClass}>
                {contents}
            </div>
        </aside>
    );
});

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        contents: string,
        contents_open: string,
        header: string,
        body: string,
        footer: string,
        checkoutButton: string,
        editCartButton: string,
        emptyCart: string,
        emptyMessage: string,
        stockStatusMessageContainer: string
    }),
    isOpen: bool
};
