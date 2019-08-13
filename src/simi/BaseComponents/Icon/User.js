
import React from 'react'
import {defaultStyle} from './Consts'

const User = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
                version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 50 50"
                style={style} className={props.className}>
            <title>user</title>
            <desc>Created with Sketch.</desc>
            <g id="Shape">
                <path id="path-1_1_" className="st0" d="M29.9,28c-1.7,0-2.6,0.9-5.4,0.9S20.8,28,19.1,28c-4.5,0-8.1,3.5-8.1,7.8v1.5   c0,1.5,1.3,2.8,2.9,2.8h21.2c1.6,0,2.9-1.2,2.9-2.8v-1.5C38,31.5,34.4,28,29.9,28z M35,37H14v-1.4c0-2.5,2.3-4.6,5.2-4.6   c0.9,0,2.3,0.9,5.3,0.9c3.1,0,4.5-0.9,5.3-0.9c2.8,0,5.2,2.1,5.2,4.6V37z M24.5,27c4.7,0,8.5-3.8,8.5-8.5S29.2,10,24.5,10   S16,13.8,16,18.5S19.8,27,24.5,27z M24.5,13c3,0,5.5,2.5,5.5,5.5S27.5,24,24.5,24S19,21.5,19,18.5S21.5,13,24.5,13z"/>
            </g>
        </svg>
    )
}

export default User;

