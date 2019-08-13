import React from "react"
import {defaultStyle} from './Consts'

const Warning = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
                 version="1.1" id="Layer_1" x="0px" y="0px"
                 viewBox="0 0 50 50"
                 style={style} className={props.className}>
            <title>Warning</title>
            <desc>Created with Sketch.</desc>
            <g id="Shape">
                <path id="path-1_1_" d="M25,10c-8.3,0-15,6.7-15,15c0,8.3,6.7,15,15,15s15-6.7,15-15C40,16.7,33.3,10,25,10z M25,16.7   c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5s-2.5-1.1-2.5-2.5S23.6,16.7,25,16.7z M28.4,32c0,0.4-0.3,0.7-0.7,0.7h-5.3   c-0.4,0-0.7-0.3-0.7-0.7v-1.5c0-0.4,0.3-0.7,0.7-0.7h0.7V26h-0.7c-0.4,0-0.7-0.3-0.7-0.7v-1.5c0-0.4,0.3-0.7,0.7-0.7h3.9   c0.4,0,0.7,0.3,0.7,0.7v6h0.7c0.4,0,0.7,0.3,0.7,0.7V32z"/>
            </g>
            <g>
                <path id="path-1_2_" className="st0" d="M25,10c-8.3,0-15,6.7-15,15c0,8.3,6.7,15,15,15s15-6.7,15-15C40,16.7,33.3,10,25,10z M25,16.7   c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5s-2.5-1.1-2.5-2.5S23.6,16.7,25,16.7z M28.4,32c0,0.4-0.3,0.7-0.7,0.7h-5.3   c-0.4,0-0.7-0.3-0.7-0.7v-1.5c0-0.4,0.3-0.7,0.7-0.7h0.7V26h-0.7c-0.4,0-0.7-0.3-0.7-0.7v-1.5c0-0.4,0.3-0.7,0.7-0.7h3.9   c0.4,0,0.7,0.3,0.7,0.7v6h0.7c0.4,0,0.7,0.3,0.7,0.7V32z"/>
            </g>
        </svg>
    )
}

export default Warning