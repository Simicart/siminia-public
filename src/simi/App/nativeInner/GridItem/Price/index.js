import React from 'react';
import PropTypes from 'prop-types';
import BundlePrice from './Bundle';
import Simple from './Simple';
import Grouped from './Grouped';

import { configColor } from 'src/simi/Config';
import { formatPrice as helperFormatPrice } from 'src/simi/Helper/Pricing';

require('./price.scss');

const style = {
    price: {
        color: configColor.price_color
    },
    specialPrice: {
        color: configColor.special_price_color
    }
};

const PriceComponent = props => {
    const { type, prices } = props;
    const classes = props.classes ? props.classes : {};

    const formatPrice = (price, currency = null, special = true) => {
        if (!price) return;
        style.price = { ...style.price, ...props.stylePrice };
        style.specialPrice = {
            ...style.specialPrice,
            ...props.styleSpecialPrice
        };
        if (special) {
            return (
                <span
                    className={`${classes['price']} price`}
                    style={style.price}
                >
                    {helperFormatPrice(price, currency)}
                </span>
            );
        } else {
            return (
                <span
                    className={`${classes['price']} ${
                        classes['old']
                    } price old`}
                    style={style.specialPrice}
                >
                    {helperFormatPrice(price, currency)}
                </span>
            );
        }
    };

    const priceProps = {
        style,
        prices,
        classes,
        formatPrice
    };

    const renderView = () => {
        if (type === 'bundle') {
            return <BundlePrice {...priceProps} />;
        } else if (type === 'grouped') {
            // for list page group product
            return <Grouped {...priceProps} />;
        } else {
            ////simple, configurable ....
            return <Simple {...priceProps} />;
        }
    };
    return (
        <div
            className={`price-${type} 
                ${classes[`price-${type}`] || ''} 
                griditem-price-ctn`}
        >
            {renderView()}
        </div>
    );
};
PriceComponent.defaultProps = {
    prices: 0,
    type: 'simple',
    stylePrice: {},
    styleSpecialPrice: {},
    classes: {}
};
PriceComponent.propTypes = {
    type: PropTypes.string,
    stylePrice: PropTypes.object,
    styleSpecialPrice: PropTypes.object,
    classes: PropTypes.object
};
export default PriceComponent;
