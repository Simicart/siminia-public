import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'src/drivers';
import classes from './mask.css';

const Mask = props => {
    const { drawer } = props;
    const isActive = drawer === 'nav';
    const { dismiss } = props;
    const className = isActive ? classes.root_active : classes.root;
    return <button className={className} onClick={dismiss} />;
}


Mask.propTypes = {
    dismiss: PropTypes.func,
    isActive: PropTypes.bool
};

const mapStateToProps = ({ app }) => {
    const { drawer } = app
    return {
        drawer
    }
}

export default connect(
    mapStateToProps
)(Mask);

