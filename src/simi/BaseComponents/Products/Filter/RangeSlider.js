import React, { useState } from 'react';
import InputRange from 'react-input-range';
import Identify from 'src/simi/Helper/Identify';
import { formatPrice } from 'src/simi/Helper/Pricing';
require('./rangeslider.scss');

const RangeSlider = props => {
    const { priceSeparator, clickedFilter } = props;
    const [slide, setSlide] = useState({
        min: props.leftPrice,
        max: props.rightPrice
    });

    const handleChangeSlide = val => {
        setSlide(val);
    };

    const handleCompleted = value => {
        const objVal = Object.values(value);
        const strVal = objVal.join(priceSeparator);
        clickedFilter('price', strVal);
    };

    return (
        <div
            className={`filter-price-range ${
                Identify.isRtl() ? 'price-range-rtl' : ''
            }`}
        >
            <InputRange
                draggableTrack
                formatLabel={value => formatPrice(value)}
                maxValue={props.priceTo}
                minValue={props.priceFrom}
                onChange={value => handleChangeSlide(value)}
                onChangeComplete={value => handleCompleted(value)}
                value={slide}
            />
        </div>
    );
};

export default RangeSlider;
