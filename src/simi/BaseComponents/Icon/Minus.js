import React from "react"
import {defaultStyle} from './Consts'

const Minus = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 50 50"
            style={style}
            className={props.className}
            >
            <title>icon/action/minus</title>
            
            <g id="Combined-Shape">
                <path id="path-1_1_" className="st0" d="M11.8,27c-1.2,0-1.8-0.7-1.8-2s0.6-2,1.8-2h26.3c1.2,0,1.9,0.7,1.9,2s-0.6,2-1.9,2H11.8z"/>
            </g>
            <g>
                <path id="path-1_2_" className="st1" d="M11.8,27c-1.2,0-1.8-0.7-1.8-2s0.6-2,1.8-2h26.3c1.2,0,1.9,0.7,1.9,2s-0.6,2-1.9,2H11.8z"/>
            </g>
        </svg>
    )
}

export default Minus