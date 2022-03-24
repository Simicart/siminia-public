import React from 'react';
import {configColor} from '../../../../simi/Config'
require('./styles.scss')

const Loader = prop => {
    return (
        <div className="loader-container">
            <div className="loader" style={{borderTop: ` 4px solid ${configColor.loading_color}`}} />
            <div className="modal-loader" />
        </div>
    );
};

export default Loader;
