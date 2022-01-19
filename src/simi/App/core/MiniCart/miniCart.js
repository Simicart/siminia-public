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
import DiscountSummary from '../Cart/PriceSummary/discountSummary';
import TaxSummary from '../Cart/PriceSummary/taxSummary';
import ShippingSummary from '../Cart/PriceSummary/shippingSummary';
import GiftCardSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/giftCardSummary';

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
        configurableThumbnailSource,
        storeUrlSuffix,
        flatData,
        isCheckout
    } = talonProps;

    const {
        subtotal,
        total,
        discounts,
        giftCards,
        taxes,
        shipping,
        priceData
    } = flatData;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;
    const quantityClassName = loading
        ? classes.quantity_loading
        : classes.quantity;
    const priceClassName = loading ? classes.price_loading : classes.price;

    const isCartEmpty = !(productList && productList.length);
    let mpRewardEarn, mpRewardDiscount, mpRewardSpent;
    if (priceData && priceData.length > 1) {
        mpRewardDiscount = priceData[0];
        mpRewardSpent = priceData[1];
        mpRewardEarn = priceData[2];
    } else if (priceData && priceData.length == 1) {
        mpRewardEarn = priceData[0];
    }
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

    const header = subtotal ? (
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
                {mpRewardEarn ? (
                    <span className={classes.labelSubtotal}>
                        <FormattedMessage
                            id={'priceSummary.rewardEarnTitle'}
                            defaultMessage={`${mpRewardEarn.title}`}
                        />
                    </span>
                ) : null}
                {mpRewardEarn ? (
                    <span className={classes.priceSubtotal}>
                        <FormattedMessage
                            id={'priceSummary.rewardEarnValue'}
                            defaultMessage={`${mpRewardEarn.value} points`}
                        />
                    </span>
                ) : null}
                {mpRewardSpent ? (
                    <span className={classes.labelSubtotal}>
                        <FormattedMessage
                            id={'priceSummary.rewardSpentTitle'}
                            defaultMessage={`${mpRewardSpent.title}`}
                        />
                    </span>
                ) : null}
                {mpRewardSpent ? (
                    <span className={classes.priceSubtotal}>
                        <FormattedMessage
                            id={'priceSummary.rewardSpentValue'}
                            defaultMessage={`${mpRewardSpent.value} points`}
                        />
                    </span>
                ) : null}
                <span className={classes.labelSubtotal}>
                    <FormattedMessage
                        id={'miniCart.subtotal'}
                        defaultMessage={'Subtotal'}
                    />
                </span>
                <span className={classes.priceSubtotal}>
                    <Price
                        currencyCode={subtotal.currency}
                        value={subtotal.value}
                    />
                </span>
                {mpRewardDiscount ? (
                    <span className={classes.labelSubtotal}>
                        <FormattedMessage
                            id={'priceSummary.rewardDiscountTitle'}
                            defaultMessage={`${mpRewardDiscount.title}`}
                        />
                    </span>
                ) : null}
                {mpRewardDiscount ? (
                    <span className={classes.priceSubtotal}>
                        <Price
                            currencyCode={subtotal.currency}
                            value={mpRewardDiscount.value}
                        />
                    </span>
                ) : null}
                <span className={classes.labelSubtotal}>
                    <FormattedMessage
                        id={'miniCart.discountApplied'}
                        defaultMessage={'Discounts applied'}
                    />
                </span>
                <span className={classes.priceSubtotal}>
                    <Price
                        currencyCode={discounts.amount.currency}
                        value={discounts.amount.value}
                    />
                </span>
                <GiftCardSummary
                    classes={{
                        lineItemLabel: classes.labelSubtotal,
                        price: classes.priceSubtotal
                    }}
                    data={giftCards}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.labelSubtotal,
                        price: classes.priceSubtotal
                    }}
                    data={taxes}
                    isCheckout={isCheckout}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.labelSubtotal,
                        price: classes.priceSubtotal
                    }}
                    data={shipping}
                    isCheckout={isCheckout}
                />
                <span className={classes.labelGrandTotal}>
                    <FormattedMessage
                        id={'miniCart.grandTotal'}
                        defaultMessage={'Grand Total'}
                    />
                </span>
                <span className={classes.priceGrandTotal}>
                    <Price currencyCode={total.currency} value={total.value} />
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
