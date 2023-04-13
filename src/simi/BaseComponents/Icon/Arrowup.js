import React from "react"
import {defaultStyle} from './Consts'

const Arrowup = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 50 50"
            id={props.id?props.id:''}
                className={props.className}
            style={style}>
            {/* <title>icon/arrow/arrow-up</title> */}
            
            <g id="Mask">
            </g>
            <g>
                <path id="path-1_1_" className="st0" d="M13.3,32.5c-0.8,0.7-2,0.7-2.8,0s-0.8-1.9,0-2.6l13-12.3c0.8-0.7,2-0.7,2.8,0l13,12.3
                    c0.8,0.7,0.8,1.9,0,2.6c-0.8,0.7-2,0.7-2.8,0L25,21.5L13.3,32.5z"/>
            </g>
        </svg>
    )
}

export default Arrowup