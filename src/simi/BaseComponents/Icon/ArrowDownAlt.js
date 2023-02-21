import React from 'react';
import {defaultStyle} from './Consts'

const ArrowDownAlt = props => {
    const { width, height } = props;
    const baseStyle = {fill: 'rgba(0, 0, 0, 1)'}; // fill: rgba(0, 0, 0, 1);transform: ;msFilter:;
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...baseStyle, ...props.style, ...color}

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             x="0px"
             y="0px"
             width={width}
             height={height}
             viewBox={`0 0 ${width} ${height}`}
             id={ props.id ? props.id : '' }
             className={props.className}
             style={style}>
            <path
                d="m18.707 12.707-1.414-1.414L13 15.586V6h-2v9.586l-4.293-4.293-1.414 1.414L12 19.414z"></path>
        </svg>
    );
}
export default ArrowDownAlt;
