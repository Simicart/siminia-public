import React from 'react';
import { FormattedMessage } from 'react-intl';

const Simple = props => {
    const { classes, prices, type, formatPrice } = props;
    ////simple, configurable ....
    let price_label = <div />;
    let special_price_label = <div />;
    let price_excluding_tax = <div />;
    let price_including_tax = <div />;
    let price = <div />;

    if (prices.has_special_price) {
        if (prices.show_ex_in_price !== null && prices.show_ex_in_price === 1) {
            special_price_label = (
                <div className="speical-price-value">
                    {prices.special_price_label}
                </div>
            );
            price_excluding_tax = (
                <div className="excl-price">
                    <span className="excl-price-label">
                        <FormattedMessage id={'Excl. Tax'} />
                        {' : '}
                    </span>
                    <span className="excl-price-value">
                        {formatPrice(
                            prices.minimalPrice.excl_tax_amount.value,
                            prices.minimalPrice.amount.currency
                        )}
                    </span>
                </div>
            );
            price_including_tax = (
                <div className="incl-price">
                    <span className="incl-price-label">
                        <FormattedMessage id={'Incl. Tax'} />
                        {' : '}
                    </span>
                    <span className="incl-price-value">
                        {formatPrice(
                            prices.minimalPrice.amount.value,
                            prices.minimalPrice.amount.currency
                        )}
                    </span>
                </div>
            );
        } else {
            price = (
                <div className="price-value">
                    {formatPrice(
                        prices.minimalPrice.amount.value,
                        prices.minimalPrice.amount.currency
                    )}
                </div>
            );
        }

        price_label = (
            <div className="regular-price">
                <span className="regular-price-label">
                    <FormattedMessage id={'Regular Price'} /> {' : '}
                </span>
                <span className="regular-price-value">
                    {formatPrice(
                        prices.regularPrice.amount.value,
                        prices.regularPrice.amount.currency,
                        false
                    )}{' '}
                </span>
                <span className={`${classes['sale_off']} sale_off`}>
                    -{prices.discount_percent}%
                </span>
            </div>
        );
    } else {
        if (prices.show_ex_in_price !== null && prices.show_ex_in_price === 1) {
            price_excluding_tax = (
                <div className="excl-price">
                    <span className="excl-price-label">
                        <FormattedMessage id={'Excl. Tax'} />
                        {' : '}
                    </span>
                    <span className="excl-price-value">
                        {formatPrice(
                            prices.minimalPrice.excl_tax_amount.value,
                            prices.minimalPrice.amount.currency
                        )}
                    </span>
                </div>
            );
            price_including_tax = (
                <div className="incl-price">
                    <span className="incl-price-label">
                        <FormattedMessage id={'Incl. Tax'} />
                        {' : '}
                    </span>
                    <span className="incl-price-value">
                        {formatPrice(
                            prices.minimalPrice.amount.value,
                            prices.minimalPrice.amount.currency
                        )}
                    </span>
                </div>
            );
        } else {
            price = (
                <div className="price-value">
                    {formatPrice(
                        prices.minimalPrice.amount.value,
                        prices.minimalPrice.amount.currency
                    )}
                </div>
            );
        }
    }
    return (
        <div className={`${classes['product-prices']} product-prices`}>
            {price_label}
            {price}
            {special_price_label}
            {price_excluding_tax}
            {price_including_tax}
        </div>
    );
};
export default Simple;
