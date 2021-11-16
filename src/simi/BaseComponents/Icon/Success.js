import React from "react"
import {defaultStyle} from './Consts'

const Success = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
                version="1.1" id="Layer_1" x="0px" y="0px"
                viewBox="0 0 50 50" style={style} className={props.className}>
            <title>Success</title>
            
            <path className="st0" d="M25,10c-8.3,0-15,6.7-15,15c0,8.3,6.7,15,15,15c8.3,0,15-6.7,15-15C40,16.7,33.3,10,25,10z M32.5,21l-9.4,9.4  c-0.5,0.5-1,0.5-1.4,0.1c-0.6-0.6-3.6-4-3.8-4.1s-0.2-0.8,0.2-1.1c0.7-0.6,1.1-0.1,1.2,0c0.1,0.1,1.1,1.2,3,3.3l8.9-8.8  c0.5-0.5,1-0.6,1.4-0.2S33,20.4,32.5,21z"/>
        </svg>
    )
}

export default Success