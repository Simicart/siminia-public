import React from 'react'
import {defaultStyle} from './Consts'

const WishList = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg xmlns="http://www.w3.org/2000/svg" style={style} className={props.className} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 50 50">
        <title>icon/header/wishlist</title>
        
        <g id="Shape">
            <path id="path-1_1_" className="st0" d="M39.4,20l-8.7-1.2L26.7,11C26,9.7,24,9.6,23.3,11l-3.9,7.8L10.6,20c-1.6,0.2-2.2,2.1-1.1,3.2   l6.3,6l-1.5,8.5c-0.3,1.5,1.4,2.7,2.8,2l7.8-4l7.8,4c1.4,0.7,3-0.4,2.8-2l-1.5-8.5l6.3-6C41.6,22.2,40.9,20.3,39.4,20z M31,28   l1.4,8L25,32.2L17.6,36l1.4-8l-6-5.6l8.3-1.2L25,14l3.7,7.2l8.3,1.2L31,28z"/>
        </g>
        <g>
            <path id="path-1_2_" className="st1" d="M39.4,20l-8.7-1.2L26.7,11C26,9.7,24,9.6,23.3,11l-3.9,7.8L10.6,20c-1.6,0.2-2.2,2.1-1.1,3.2   l6.3,6l-1.5,8.5c-0.3,1.5,1.4,2.7,2.8,2l7.8-4l7.8,4c1.4,0.7,3-0.4,2.8-2l-1.5-8.5l6.3-6C41.6,22.2,40.9,20.3,39.4,20z M31,28   l1.4,8L25,32.2L17.6,36l1.4-8l-6-5.6l8.3-1.2L25,14l3.7,7.2l8.3,1.2L31,28z"/>
        </g>
        </svg>
    )
}
export default WishList