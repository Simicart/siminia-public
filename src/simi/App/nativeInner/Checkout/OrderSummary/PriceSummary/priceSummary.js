import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
// import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './priceSummary.module.css';
import DiscountSummary from 'src/simi/App/core/Cart/PriceSummary/discountSummary';
import GiftCardSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/giftCardSummary';
import ShippingSummary from 'src/simi/App/core/Cart/PriceSummary/shippingSummary';
import TaxSummary from 'src/simi/App/core/Cart/PriceSummary/taxSummary';
import { usePriceSummary } from 'src/simi/talons/Cart/usePriceSummary';
import { useWindowSize } from '@magento/peregrine';
import { GiftCodeCheckoutContext } from '../../checkoutPage';

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
const PriceSummary = props => {
    const { isUpdating } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = usePriceSummary();
    
    const { giftCodeData, setGiftCodeData } = useContext(GiftCodeCheckoutContext)

    const {
        handleProceedToCheckout,
        hasError,
        hasItems,
        isCheckout,
        isLoading,
        flatData
    } = talonProps;

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 450;

    const { formatMessage } = useIntl();
    let mpRewardEarn, mpRewardDiscount, mpRewardSpent;

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
        priceData
    } = flatData;

    if (priceData && priceData.length > 1) {
        mpRewardDiscount = priceData[0];
        mpRewardSpent = priceData[1];
        mpRewardEarn = priceData[2];
    } else mpRewardEarn = priceData ? priceData[0] : 0;

    const isPriceUpdating = isUpdating || isLoading;
    const priceClass = isPriceUpdating ? classes.priceUpdating : classes.price;
    const totalPriceClass = isPriceUpdating
        ? classes.priceUpdating
        : classes.totalPrice;

    const totalPriceLabel = isCheckout
        ? (isMobile ? formatMessage({
            id: 'priceSummary.grandTotal',
            defaultMessage: 'Grand Total'
        }) : formatMessage({
            id: 'priceSummary.total',
            defaultMessage: 'Total'
        })) 
        : formatMessage({
              id: 'priceSummary.estimatedTotal',
              defaultMessage: 'Estimated Total'
          });

    const proceedToCheckoutButton = !isCheckout ? (
        <div className={classes.checkoutButton_container}>
            <Button
                disabled={isPriceUpdating}
                priority={'high'}
                onClick={handleProceedToCheckout}
            >
                <FormattedMessage
                    id={'priceSummary.checkoutButton'}
                    defaultMessage={'Proceed to Checkout'}
                />
            </Button>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <span className={classes.title}>
                <FormattedMessage
                    id={'SUMMARY'}
                    defaultMessage={'Summary'}
                />
            </span>
            <div className={classes.lineItems}>
                {mpRewardEarn ? (
                    <span className={classes.lineItemLabel}>
                        <FormattedMessage
                            id={'You will earn'}
                            defaultMessage={`${mpRewardEarn.title}`}
                        />
                    </span>
                ) : null}
                {mpRewardEarn ? (
                    <span className={priceClass}>
                        <FormattedMessage
                            id={'priceSummary.rewardEarnValue'}
                            defaultMessage={`${mpRewardEarn.value}`}
                        />
                        <>
                            {formatMessage({
                                id: 'points',
                                defaultMessage: 'points'
                            })}
                        </>
                    </span>
                ) : null}
                {mpRewardSpent ? (
                    <span className={classes.lineItemLabel}>
                        <FormattedMessage
                            id={'You will spend'}
                            defaultMessage={`${mpRewardSpent.title}`}
                        />
                    </span>
                ) : null}
                {mpRewardSpent ? (
                    <span className={priceClass}>
                        <FormattedMessage
                            id={'priceSummary.rewardSpentValue'}
                            defaultMessage={`${mpRewardSpent.value} `}
                        />
                          <>
                            {formatMessage({
                                id: 'points',
                                defaultMessage: 'points'
                            })}
                        </>
                    </span>
                ) : null}
                <span className={classes.lineItemLabel}>
                    <FormattedMessage
                        id={'priceSummary.lineItemLabel'}
                        defaultMessage={'Subtotal'}
                    />
                </span>
                <span className={priceClass}>
                    <Price
                        value={subtotal.value}
                        currencyCode={subtotal.currency}
                    />
                </span>
                {mpRewardDiscount ? (
                    <span className={classes.lineItemLabel}>
                        <FormattedMessage
                           id={'Reward Points'}
                            defaultMessage={`${mpRewardDiscount.title}`}
                        />
                    </span>
                ) : null}
                {mpRewardDiscount ? (
                    <span className={priceClass}>
                        <Price
                            value={mpRewardDiscount.value}
                            currencyCode={subtotal.currency}
                        />
                    </span>
                ) : null}
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
                {giftCodeData && (<>
                    <span style={{maxWidth: 80}}>{giftCodeData.code}</span>
                    <span style={{textAlign: 'right'}}>{`-$${giftCodeData.value}.00`}</span>
                </>)}
                <span className={classes.totalLabel}>{totalPriceLabel}</span>
                <span className={totalPriceClass}>
                    <Price value={giftCodeData ? total.value - giftCodeData.value : total.value} currencyCode={total.currency} />
                </span>
            </div>
            {proceedToCheckoutButton}
        </div>
    );
};

export default PriceSummary;
