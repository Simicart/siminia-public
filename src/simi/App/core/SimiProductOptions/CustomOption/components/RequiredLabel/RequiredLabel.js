import React from 'react';

// this might be shared between options
const defaultStyle = {marginLeft: '5px', color: '#ff0000'}

export const RequiredLabel = (props) => {
    return (
        <span className="required-label" style={defaultStyle}>*</span>
    );
};

