import React from 'react';
import Star from 'src/simi/BaseComponents/Icon/Star';
import { configColor } from 'src/simi/Config';
import PropTypes from 'prop-types';

const SwipeableRate = props => {
    const { size, onChange, classes } = props;
    let rate = props.rate;
    rate = Math.round(rate, 10);

    const handleChangeRate = val => {
        onChange(val);
    };

    const rate_point = 'rate-point ' + classes['rate-point'];
    const select = 'select-star ' + classes['select-star'];
    const star = [];
    let id = '';
    for (let i = 0; i < 5; i++) {
        id = 'rateitem-' + i;
        if (i <= rate) {
            star.push(
                <span
                    role="presentation"
                    key={i}
                    id={id}
                    className={rate_point + ' rate-star ' + select}
                    onClick={() => handleChangeRate(i)}
                >
                    <Star
                        style={{
                            height: size + 'px',
                            width: size + 'px',
                            fill: configColor.content_color
                        }}
                    />
                </span>
            );
        } else {
            star.push(
                <span
                    role="presentation"
                    key={i}
                    id={id}
                    className={rate_point + ' rate-star '}
                    onClick={() => handleChangeRate(i)}
                >
                    <Star
                        style={{
                            fill: '#e0e0e0',
                            height: size + 'px',
                            width: size + 'px'
                        }}
                    />
                </span>
            );
        }
    }
    return <div className={classes['rate-review']}>{star}</div>;
};

SwipeableRate.defaultProps = {
    rate: 0,
    size: 15,
    classes: {}
};
SwipeableRate.propTypes = {
    rate: PropTypes.number,
    size: PropTypes.number,
    classes: PropTypes.object
};
export default SwipeableRate;
