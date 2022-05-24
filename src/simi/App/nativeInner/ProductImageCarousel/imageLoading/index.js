import React from 'react';
require('./styles.scss');

const ImageLoading = props => {
    return (
        <div className="main-item">
            <div
                style={{
                    height: props.height,
                    width: props.width ? props.width : 'auto'
                }}
                className="animated-background"
            >
                <div className="background-masker" />
            </div>
        </div>
    );
};

export default ImageLoading;
