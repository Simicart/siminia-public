import React from 'react'
import {defaultStyle} from './Consts'

const Trash = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 50 50"
                className={props.className}
                style={style}>
                {/* <title>Delete</title> */}
                
                <g id="Shape">
                    <path id="path-1_1_" d="M23.1,21v12.7c0,0.4-0.3,0.7-0.7,0.7H21c-0.4,0-0.7-0.3-0.7-0.7V21c0-0.4,0.3-0.7,0.7-0.7h1.4
                        C22.8,20.3,23.1,20.6,23.1,21z M28.9,20.3h-1.4c-0.4,0-0.7,0.3-0.7,0.7v12.7c0,0.4,0.3,0.7,0.7,0.7h1.4c0.4,0,0.7-0.3,0.7-0.7V21
                        C29.6,20.6,29.3,20.3,28.9,20.3z M36.6,14.7c0.8,0,1.4,0.6,1.4,1.4v0.7c0,0.4-0.3,0.7-0.7,0.7h-1.2v19.7c0,1.6-1.2,2.8-2.8,2.8
                        H16.6c-1.5,0-2.8-1.3-2.8-2.8V17.5h-1.2c-0.4,0-0.7-0.3-0.7-0.7v-0.7c0-0.8,0.6-1.4,1.4-1.4h4.3l2-3.3C20.1,10.6,21,10,22,10h5.9
                        c1,0,1.9,0.5,2.4,1.4l2,3.3C32.3,14.7,36.6,14.7,36.6,14.7z M21,14.7h8L28,13c-0.1-0.1-0.2-0.2-0.3-0.2h-5.5
                        c-0.1,0-0.2,0.1-0.3,0.2L21,14.7z M33.4,17.5H16.6v19.3c0,0.2,0.2,0.4,0.3,0.4h16c0.2,0,0.3-0.2,0.3-0.4V17.5H33.4z"/>
                </g>
                <path id="path-1_2_" className="st0" d="M23.1,21v12.7c0,0.4-0.3,0.7-0.7,0.7H21c-0.4,0-0.7-0.3-0.7-0.7V21c0-0.4,0.3-0.7,0.7-0.7h1.4
                    C22.8,20.3,23.1,20.6,23.1,21z M28.9,20.3h-1.4c-0.4,0-0.7,0.3-0.7,0.7v12.7c0,0.4,0.3,0.7,0.7,0.7h1.4c0.4,0,0.7-0.3,0.7-0.7V21
                    C29.6,20.6,29.3,20.3,28.9,20.3z M36.6,14.7c0.8,0,1.4,0.6,1.4,1.4v0.7c0,0.4-0.3,0.7-0.7,0.7h-1.2v19.7c0,1.6-1.2,2.8-2.8,2.8H16.6
                    c-1.5,0-2.8-1.3-2.8-2.8V17.5h-1.2c-0.4,0-0.7-0.3-0.7-0.7v-0.7c0-0.8,0.6-1.4,1.4-1.4h4.3l2-3.3C20.1,10.6,21,10,22,10h5.9
                    c1,0,1.9,0.5,2.4,1.4l2,3.3C32.3,14.7,36.6,14.7,36.6,14.7z M21,14.7h8L28,13c-0.1-0.1-0.2-0.2-0.3-0.2h-5.5c-0.1,0-0.2,0.1-0.3,0.2
                    L21,14.7z M33.4,17.5H16.6v19.3c0,0.2,0.2,0.4,0.3,0.4h16c0.2,0,0.3-0.2,0.3-0.4V17.5H33.4z"/>
            </svg>
    )
}
export default Trash