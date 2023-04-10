import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../../../core/Cart/PriceSummary/priceSummary.module.css';
import defaultClasses_1 from './priceSummary.module.css';
import DiscountSummary from '../../../core/Cart/PriceSummary/discountSummary';
import GiftCardSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/giftCardSummary';
import ShippingSummary from '../../../core/Cart/PriceSummary/shippingSummary';
import TaxSummary from '../../../core/Cart/PriceSummary/taxSummary';
import { usePriceSummary } from '../../../../talons/Cart/usePriceSummary';
import { RedButton } from "../RedButton";
import { PriceWithColor } from "../PriceWithColor";
import { getBottomInsets } from 'src/simi/App/nativeInner/Helper/Native'
import { useWindowSize } from '@magento/peregrine';
import RewardPointPriceSummary from 'src/simi/BaseComponents/RewardPoint/components/Cart/priceSummary'

/**
 * A child component of the CartPage component.
 * This component fetches and renders cart data, such as subtotal, discounts applied,
 * gift cards applied, tax, shipping, and cart total.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [priceSummary.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary";
 */
export const PriceSummary = props => {
    const { isUpdating } = props;
    const classes = useStyle(defaultClasses, defaultClasses_1, props.classes);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 450;

    const talonProps = usePriceSummary();

    const {
        handleProceedToCheckout,
        hasError,
        hasItems,
        isCheckout,
        isLoading,
        flatData
    } = talonProps;

    const { formatMessage } = useIntl();

    if (hasError) {
        return (
            <div className={classes.root}>
                <span className={classes.errorText}>
                    <FormattedMessage
                        id={'priceSummary.errorText'}
                        defaultMessage={
                            'Something went wrong. Please refresh and try again.'
                        }
                    />
                </span>
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    const {
        subtotal,
        total,
        discounts,
        giftCards,
        taxes,
        shipping,
        rewardPoint
    } = flatData;

    const isPriceUpdating = isUpdating || isLoading;
    const priceClass = isPriceUpdating ? classes.priceUpdating : classes.price;
    const totalPriceClass = isPriceUpdating
        ? classes.priceUpdating
        : classes.totalPrice;


    const totalPriceLabel = isCheckout
        ? formatMessage({
            id: 'Total',
            defaultMessage: 'Total'
        })
        : formatMessage({
            id: 'Grand Total',
            defaultMessage: 'Grand Total'
        });

    const bottomInsets = getBottomInsets()

    const proceedToCheckoutButton = !isCheckout ? (
        <div className={classes.checkoutButton_container} style={{ bottom: bottomInsets }}>
            {!isMobile && <span className={classes.totalPricePiece}>
                <FormattedMessage
                    id={'Total'}
                    defaultMessage={'Total'}
                />
                <span>: </span>
                {!isPriceUpdating ? (
                    <PriceWithColor value={total.value} currencyCode={total.currency} />
                ) :
                    <span className={classes.pricePlaceholder} />
                }
            </span>}
            <RedButton
                disabled={isPriceUpdating}
                onClick={handleProceedToCheckout}
            >
                <span>
                    <span>
                        <img src={require('../../../../../../static/icons/lock-closed.svg')}
                            alt={''}
                            width={14}
                            height={14}
                            className={classes.checkoutLockIcon}
                        />
                    </span>
                    <span><FormattedMessage
                        id={'CHECKOUT'}
                        defaultMessage={'Checkout'}
                    /></span>
                </span>
            </RedButton>
        </div>
    ) : null;

    return (
        <React.Fragment>
            <div className={classes.root}>
                <div className={classes.lineItems}>
                    <span className={classes.lineItemLabel}>
                        <FormattedMessage
                            id={'Subtotal'}
                            defaultMessage={'Subtotal'}
                        />
                    </span>
                    <span className={priceClass}>
                        <PriceWithColor
                            value={subtotal.value}
                            currencyCode={subtotal.currency}
                        />
                    </span>
                    <DiscountSummary
                        classes={{
                            lineItemLabel: classes.lineItemLabel,
                            price: priceClass
                        }}
                        data={discounts}
                    />
                    <GiftCardSummary
                        classes={{
                            lineItemLabel: classes.lineItemLabel,
                            price: priceClass
                        }}
                        data={giftCards}
                    />
                    <TaxSummary
                        classes={{
                            lineItemLabel: classes.lineItemLabel,
                            price: priceClass
                        }}
                        data={taxes}
                        isCheckout={isCheckout}
                    />
                    <ShippingSummary
                        classes={{
                            lineItemLabel: classes.lineItemLabel,
                            price: priceClass
                        }}
                        data={shipping}
                        isCheckout={isCheckout}
                    />
                    <RewardPointPriceSummary
                        classes={{
                            lineItemLabel: classes.lineItemLabel,
                            price: priceClass
                        }}
                        currencyCode={total.currency}
                        data={rewardPoint}
                    />
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', margin: 10}}>
                    <span className={classes.totalLabel}>{totalPriceLabel}</span>
                    <span className={totalPriceClass}>
                        <PriceWithColor value={total.value} currencyCode={total.currency} color='#4C525C'/>
                    </span>
                </div>
                
                {/*proceedToCheckoutButton*/}
            </div>
        </React.Fragment>

    );
};

