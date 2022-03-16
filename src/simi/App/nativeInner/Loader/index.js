import React from 'react';
require('./styles.scss')

const Loader = prop => {
    return (
        <div className="loader-container">
            <div className="loader" />
            <div className="modal-loader" />
        </div>
    );
};

export default Loader;
