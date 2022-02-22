import React, { Component } from 'react';
import classify from 'src/classify';
import PropTypes from 'prop-types';
import Identify from 'src/simi/Helper/Identify';

import defaultClasses from './cartCounter.module.css';

class CartCounter extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        counter: PropTypes.number.isRequired
    };

    render() {
        const { counter, classes } = this.props;
        return counter > 0 ? (
            <span
                className={classes.root}
                style={Identify.isRtl() ? { left: 18 } : { right: 18 }}
            >
                {counter}
            </span>
        ) : null;
    }
}

export default classify(defaultClasses)(CartCounter);
