import React from 'react';
import { FormattedMessage } from 'react-intl';

const Grouped = props => {
    const { classes, type, prices, formatPrice } = props;
    let product_from_label = <div />;
    let from_price_excluding_tax = <div />;
    let from_price_including_tax = <div />;

    if (prices.show_ex_in_price && prices.show_ex_in_price === 1) {
        product_from_label = (
            <div>
                <FormattedMessage id={'From'} /> {' : '}
            </div>
        );
        from_price_excluding_tax = (
            <div>
                <FormattedMessage id={'Excl. Tax'} />
                {' : '}
                {formatPrice(prices.minimalPrice.excl_tax_amount.value)}
            </div>
        );
        from_price_including_tax = (
            <div>
                <FormattedMessage id={'Incl. Tax'} />
                {' : '}
                {formatPrice(prices.minimalPrice.amount.value)}
            </div>
        );
    } else {
        product_from_label = (
            <div>
                <FormattedMessage id={'From'} />
                {' : '}
                {formatPrice(prices.minimalPrice.amount.value)}
            </div>
        );
    }

    return (
        <div className={`${classes['product-prices']} small`}>
            {product_from_label}
            {from_price_excluding_tax}
            {from_price_including_tax}
        </div>
    );
};
export default Grouped;
