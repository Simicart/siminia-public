
import React from 'react'
import {defaultStyle} from './Consts'

const Basket = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 50 50"
            className={props.className}
            style={style}>
            <title>icon/header/hover/basket</title>
            
            <g id="Combined-Shape">
                <path id="path-1_1_" className="st0" d="M18.2,17c0.7-4,3.9-7,7.7-7c3.8,0,7,3,7.7,7H38c1.3,0,1.9,0.7,1.9,2v21H11V18.9
                    c0-1.3,0.7-1.9,2-1.9H18.2z M14,20v17h23V20H14z M25.9,18.2c2.7,0,4.9,0,4.9,0c0-2.9-2.2-5.2-4.9-5.2s-4.9,2.3-4.9,5.2
                    C20.9,18.1,23.1,18.2,25.9,18.2z"/>
            </g>
        </svg>
    )
}
export default Basket