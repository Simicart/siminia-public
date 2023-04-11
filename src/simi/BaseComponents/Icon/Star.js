import React from 'react';
import { defaultStyle } from './Consts';

const Star = props => {
    const color = props.color ? { fill: props.color } : {};
    const style = { ...defaultStyle, ...props.style, ...color };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            style={style}
            className={props.className}
            viewBox="0 0 58 49.733"
        >
            {/* <title>5stars</title> */}
            <polygon points="26.146 38.489 9.987 49.733 15.688 30.89 0 18.996 19.683 18.595 26.146 0 32.61 18.595 52.293 18.996 36.605 30.89 42.306 49.733 26.146 38.489" />
        </svg>
    );
};
export default Star;
