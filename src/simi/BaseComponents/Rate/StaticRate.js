import React from  'react';
import FiveStars from 'src/simi/BaseComponents/Icon/FiveStars'
import {configColor} from 'src/simi/Config';;
import PropTypes from 'prop-types';

const StaticRate = props => {
    const {classes, size, rate} = props
    const height = size
    const width = 5 * height
    const rateWidth = width * rate / 5
    
    return (
        <div className={classes["static-rate"]} style={{width: width, height: height, position:'relative'}}>
            <FiveStars style={{width: width, height: height, fill:'#e0e0e0'}}/>
            <div className={classes["static-rate-active"]} style={{height: size, width: rateWidth, overflow: 'hidden', position: 'absolute', left: 0, top: 0}}>
                <FiveStars style={{width: width, height: height, fill:configColor.button_background}}/>
            </div>
        </div>
    )
}
StaticRate.defaultProps = {
    rate : 0,
    size : 15,
    classes: {},
};
StaticRate.propTypes = {
    rate : PropTypes.number,
    size : PropTypes.number,
    classes : PropTypes.object,
};
export default StaticRate;