import React, { useState, useEffect, createContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Check } from 'react-feather';
import { useCartPage } from 'src/simi/App/nativeInner/talons/CartPage/useCartPage.js';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useToasts } from '@magento/peregrine';

import Icon from '@magento/venia-ui/lib/components/Icon';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';
import PriceAdjustments from './PriceAdjustments';
import PriceSummary from './PriceSummary';
import ProductListing from './ProductListing';
import defaultClasses from './cartPage.module.css';

export const GiftCodeCartContext = createContext({});

const CheckIcon = <Icon size={20} src={Check} />;

/**
 * Structural page component for the shopping cart.
 * This is the main component used in the `/cart` route in Venia.
 * It uses child components to render the different pieces of the cart page.
 *
 * @see {@link https://venia.magento.com/cart}
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides for the component.
 * See [cartPage.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CartPage from "@magento/venia-ui/lib/components/CartPage";
 */
const CartPage = props => {
    const talonProps = useCartPage();
    const { history } = props;
    const {
        giftCardConfig,
        cartItems,
        priceSummaryData,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        refetchCartPage,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        wishlistSuccessProps,
    } = talonProps;

    const [giftCodeData, setGiftCodeData] = useState([])
   
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (wishlistSuccessProps) {
            addToast({ ...wishlistSuccessProps, icon: CheckIcon });
        }
    }, [addToast, wishlistSuccessProps]);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    const productListing = hasItems ? (
        <ProductListing
            onAddToWishlistSuccess={onAddToWishlistSuccess}
            setIsCartUpdating={setIsCartUpdating}
            fetchCartDetails={fetchCartDetails}
            history={history}
        />
    ) : (
        <h3>
            <FormattedMessage
                id={'There are no items in your cart.'}
                defaultMessage={'There are no items in your cart.'}
            />
        </h3>
    );

    const priceAdjustments = hasItems ? (
        <PriceAdjustments setIsCartUpdating={setIsCartUpdating} giftCardConfig={giftCardConfig} priceSummaryData={priceSummaryData} refetchCartPage={refetchCartPage} location='cart'/>
    ) : null;

    const priceSummary = hasItems ? (
        <PriceSummary isUpdating={isCartUpdating} location = 'cart' />
    ) : null;

    const totalQuantity = cartItems.length ? (
        <span> {cartItems.reduce((total,item) => { return total += item.quantity},0)}  
            <FormattedMessage
            id={'Item(s)'}
            defaultMessage={'Item(s)'}
            /> 
        </span>
    ) : null;    
    return (
        <GiftCodeCartContext.Provider value={{giftCodeData, setGiftCodeData}}>

        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'cartPage.title',
                    defaultMessage: 'Cart'
                })}
            </StoreTitle>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>
                    <FormattedMessage
                        id={'SHOPPING CART'}
                        defaultMessage={'Shopping Cart'}
                    />
                </h1>
                <h1 className={classes.items_count}>
                    {totalQuantity} 
                </h1>
                <div className={classes.stockStatusMessageContainer}>
                    <StockStatusMessage cartItems={cartItems} />
                </div>
            </div>
            <div className={classes.body}>
                <div className={classes.items_container}>{productListing}</div>
                <div className={classes.price_adjustments_container}>
                    {priceAdjustments}
                </div>
                <div className={classes.summary_container}>
                    <div className={classes.summary_contents}>
                        {priceSummary}
                    </div>
                </div>
            </div>
        </div>
    </GiftCodeCartContext.Provider>
    );
};

export default CartPage;
