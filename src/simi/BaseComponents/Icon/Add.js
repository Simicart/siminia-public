import React from "react"
import {defaultStyle} from './Consts'

const Add = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 50 50"
            style={style}
            className={props.className}>
            {/* <title>icon/action/plus</title> */}
            <g id="Combined-Shape">
                <path id="path-1_1_" className="st0" d="M27,23h11.1c1.2,0,1.9,0.7,1.9,2s-0.6,2-1.9,2H27v11.1c0,1.2-0.7,1.9-2,1.9s-2-0.6-2-1.9V27
                    H11.8c-1.2,0-1.8-0.7-1.8-2s0.6-2,1.8-2H23V11.8c0-1.2,0.7-1.8,2-1.8s2,0.6,2,1.8V23z"/>
            </g>
            <g>
                <path id="path-1_2_" className="st1" d="M27,23h11.1c1.2,0,1.9,0.7,1.9,2s-0.6,2-1.9,2H27v11.1c0,1.2-0.7,1.9-2,1.9s-2-0.6-2-1.9V27
                    H11.8c-1.2,0-1.8-0.7-1.8-2s0.6-2,1.8-2H23V11.8c0-1.2,0.7-1.8,2-1.8s2,0.6,2,1.8V23z"/>
            </g>
        </svg>
    )
}

export default Add