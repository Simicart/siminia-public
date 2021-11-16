import React from "react"
import {defaultStyle} from './Consts'

const Facebook = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 50 50"
            style={style}
            className={props.className}
        >
            <title>icon/social/facebook</title>
            
            <rect id="Rectangle-2" className="st0" width="50" height="50" />
            <g id="Shape">
                <path
                    id="path-1_1_"
                    className="st1"
                    d="M25,10c-8.3,0-15,6.7-15,15s6.7,15,15,15s15-6.7,15-15S33.2,10,25,10z M29,24.9h-2.6   c0,4.1,0,9.3,0,9.3h-3.8c0,0,0-5.1,0-9.3h-1.8v-3.3h1.8v-2.1c0-1.5,0.7-3.9,3.9-3.9h2.9v3.2c0,0-1.7,0-2.1,0   c-0.4,0-0.8,0.2-0.8,0.9v2h2.9L29,24.9z"
                />
            </g>
            <g>
                <path
                    id="path-1_2_"
                    className="st2"
                    d="M25,10c-8.3,0-15,6.7-15,15s6.7,15,15,15s15-6.7,15-15S33.2,10,25,10z M29,24.9h-2.6   c0,4.1,0,9.3,0,9.3h-3.8c0,0,0-5.1,0-9.3h-1.8v-3.3h1.8v-2.1c0-1.5,0.7-3.9,3.9-3.9h2.9v3.2c0,0-1.7,0-2.1,0   c-0.4,0-0.8,0.2-0.8,0.9v2h2.9L29,24.9z"
                />
            </g>
        </svg>
    );
}

export default Facebook;