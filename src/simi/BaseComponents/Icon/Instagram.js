import React from "react"
import {defaultStyle} from './Consts'

const Instagram = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 50 50"
            style={style}
            className={props.className}
        >
            <title>icon/social/instagram</title>
            <desc>Created with Sketch.</desc>
            <circle id="Oval" className="st0" cx="24.6" cy="24.9" r="2.6" />
            <path
                id="Shape"
                className="st0"
                d="M27.9,18.4h-6.6c-1,0-1.8,0.3-2.3,0.8s-0.8,1.4-0.8,2.3v6.6c0,1,0.3,1.8,0.9,2.4  c0.6,0.5,1.4,0.8,2.3,0.8h6.5c1,0,1.8-0.3,2.3-0.8c0.6-0.5,0.9-1.4,0.9-2.3v-6.6c0-1-0.3-1.7-0.8-2.3C29.7,18.7,29,18.4,27.9,18.4z   M24.6,29c-2.3,0-4.1-1.9-4.1-4.1c0-2.3,1.9-4.1,4.1-4.1s4.1,1.8,4.1,4.1S26.9,29,24.6,29z M28.9,21.6c-0.5,0-1-0.4-1-1  c0-0.5,0.4-1,1-1c0.5,0,1,0.4,1,1C29.9,21.2,29.4,21.6,28.9,21.6z"
            />
            <path
                id="Shape_1_"
                className="st0"
                d="M24.8,10c8.2,0,14.8,6.6,14.8,14.8c0,8.2-6.6,14.8-14.8,14.8S10,32.9,10,24.8S16.6,10,24.8,10z   M32.6,28.2v-6.6c0-1.4-0.4-2.5-1.3-3.4c-0.8-0.8-2-1.3-3.4-1.3h-6.6c-2.8,0-4.7,1.9-4.7,4.7v6.6c0,1.4,0.4,2.6,1.3,3.4  c0.8,0.8,2,1.3,3.4,1.3h6.5c1.3,0,2.5-0.4,3.4-1.3S32.6,29.6,32.6,28.2z"
            />
        </svg>
    );
}

export default Instagram;