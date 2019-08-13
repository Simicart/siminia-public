import React from "react"
import {defaultStyle} from './Consts'

const Error = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg    xmlns="http://www.w3.org/2000/svg"
                className={props.className}
                version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 50 50"
                style={style}>
            <title>Error</title>
            <desc>Created with Sketch.</desc>
            <g id="Shape">
                <path id="path-1_1_" className="st0" d="M41.6,35.9c1.1,1.8-0.3,4.1-2.5,4.1H10.8c-2.2,0-3.5-2.3-2.5-4.1l14.2-23.6   c1.1-1.8,3.8-1.8,4.9,0L41.6,35.9z M25.5,32c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S26.9,32,25.5,32z M23,21.6   l0.4,6.8c0,0.3,0.3,0.6,0.7,0.6h2.8c0.4,0,0.7-0.2,0.7-0.6l0.4-6.8c0-0.3-0.3-0.6-0.7-0.6h-3.6C23.3,21,23,21.3,23,21.6z"/>
            </g>
            <g>
                <path id="path-1_2_" className="st0" d="M41.6,35.9c1.1,1.8-0.3,4.1-2.5,4.1H10.8c-2.2,0-3.5-2.3-2.5-4.1l14.2-23.6   c1.1-1.8,3.8-1.8,4.9,0L41.6,35.9z M25.5,32c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S26.9,32,25.5,32z M23,21.6   l0.4,6.8c0,0.3,0.3,0.6,0.7,0.6h2.8c0.4,0,0.7-0.2,0.7-0.6l0.4-6.8c0-0.3-0.3-0.6-0.7-0.6h-3.6C23.3,21,23,21.3,23,21.6z"/>
            </g>
        </svg>
    )
}

export default Error