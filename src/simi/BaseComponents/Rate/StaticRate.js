import React from 'react';
import FiveStars from 'src/simi/BaseComponents/Icon/FiveStars'
import { configColor } from 'src/simi/Config';;
import PropTypes from 'prop-types';
import Identify from 'src/simi/Helper/Identify';

const StaticRate = props => {
    const { classes, size, rate, fillColor, backgroundColor } = props
    const height = size
    const width = 5 * height
    // const rateWidth = width * rate / 5
    const activeStyle = Identify.isRtl() ? { height: size, width: rate + '%', overflow: 'hidden', position: 'absolute', top: 0 } : { height: size, width: rate + '%', overflow: 'hidden', position: 'absolute', top: 0, left: 0 };

    return (
        <div className={`${classes["static-rate"]} static-rate`} style={{ width: width, height: height, position: 'relative' }}>
            <FiveStars style={{ width: width, height: height, fill: fillColor ? fillColor : '#e0e0e0' }} />
            <div className={`${classes["static-rate-active"]} static-rate-active`} style={activeStyle}>
                <FiveStars style={{ width: width, height: height, fill: backgroundColor ? backgroundColor : configColor.button_background }} />
            </div>
        </div>
    )
}
StaticRate.defaultProps = {
    rate: 0,
    size: 15,
    classes: {},
};
StaticRate.propTypes = {
    rate: PropTypes.number,
    size: PropTypes.number,
    classes: PropTypes.object,
};
export default StaticRate;
