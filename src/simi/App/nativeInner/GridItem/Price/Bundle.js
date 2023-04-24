import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { FormattedMessage } from 'react-intl';

const BundlePrice = props => {
    const { classes, prices, type, formatPrice } = props;
    let product_from_label = <div />;
    let from_price_excluding_tax = <div />;
    let from_price_including_tax = <div />;
    let product_to_label = <div />;
    let to_price_excluding_tax = <div />;
    let to_price_including_tax = <div />;

    const currencyRate = prices.regularPrice.amount.value / prices.minimalPrice.amount.value

    if (prices.show_ex_in_price && prices.show_ex_in_price === 1) {
        product_from_label = (
            <div className='from'>
                <FormattedMessage id={'From'} />:
            </div>
        );
        from_price_excluding_tax = (
            <div>
                <FormattedMessage id={'Excl. Tax'} />:
                {formatPrice(prices.minimalPrice.excl_tax_amount.value * currencyRate)}
            </div>
        );
        from_price_including_tax = (
            <div>
                <FormattedMessage id={'Incl. Tax'} />:{' '}
                {formatPrice(prices.minimalPrice.amount.value * currencyRate)}
            </div>
        );

        product_to_label = (
            <div className='to'>
                <FormattedMessage id={'To'} />:
            </div>
        );
        to_price_excluding_tax = (
            <div>
                <FormattedMessage id={'Excl. Tax'} />:{' '}
                {formatPrice(prices.maximalPrice.excl_tax_amount.value * currencyRate)}
            </div>
        );
        to_price_including_tax = (
            <div>
                <FormattedMessage id={'Incl. Tax'} />:{' '}
                {formatPrice(prices.maximalPrice.amount.value * currencyRate)}
            </div>
        );
    } else {
        product_from_label = (
            <div className='from'>
                <FormattedMessage id={'From'} />:{' '}
                {formatPrice(prices.minimalPrice.amount.value * currencyRate)}
            </div>
        );
        product_to_label = (
            <div className='to'>
                <FormattedMessage id={'To'} />:{' '}
                {formatPrice(prices.maximalPrice.amount.value * currencyRate)}
            </div>
        );
    }

    return (
        <div className={`${classes['product-prices']} small`}>
            {product_from_label}
            {from_price_excluding_tax}
            {from_price_including_tax}
            {product_to_label}
            {to_price_excluding_tax}
            {to_price_including_tax}
        </div>
    );
};
export default BundlePrice;
