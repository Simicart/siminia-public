import React from "react"
import {defaultStyle} from './Consts'

const Twitter = props => {
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
            {/* <title>icon/social/twitter</title> */}
            
            <g id="Shape">
                <path
                    id="path-1_1_"
                    className="st0"
                    d="M24.8,10C16.6,10,10,16.6,10,24.8s6.6,14.8,14.8,14.8s14.8-6.6,14.8-14.8S32.9,10,24.8,10z    M32.3,21.8c0,0.2,0,0.3,0,0.5c0,4.9-3.7,10.6-10.6,10.6c-2.1,0-4.1-0.6-5.7-1.7c0.3,0.1,0.6,0.1,0.9,0.1c1.7,0,3.4-0.6,4.6-1.6   c-1.6-0.1-3-1.1-3.5-2.6c0.2,0.1,0.5,0.1,0.7,0.1c0.4,0,0.7-0.1,1-0.1c-1.7-0.4-3-1.9-3-3.7v-0.1c0.5,0.3,1.1,0.4,1.7,0.5   c-1-0.7-1.7-1.8-1.7-3.1c0-0.7,0.2-1.3,0.5-1.9c1.9,2.3,4.6,3.7,7.7,3.9c-0.1-0.3-0.1-0.5-0.1-0.8c0-2,1.7-3.7,3.7-3.7   c1.1,0,2,0.5,2.7,1.2c0.8-0.2,1.6-0.5,2.3-0.9c-0.3,0.9-0.8,1.6-1.6,2c0.8-0.1,1.5-0.3,2.2-0.6C33.6,20.6,33,21.2,32.3,21.8z"
                />
            </g>
            <g>
                <path
                    id="path-1_2_"
                    className="st1"
                    d="M24.8,10C16.6,10,10,16.6,10,24.8s6.6,14.8,14.8,14.8s14.8-6.6,14.8-14.8S32.9,10,24.8,10z    M32.3,21.8c0,0.2,0,0.3,0,0.5c0,4.9-3.7,10.6-10.6,10.6c-2.1,0-4.1-0.6-5.7-1.7c0.3,0.1,0.6,0.1,0.9,0.1c1.7,0,3.4-0.6,4.6-1.6   c-1.6-0.1-3-1.1-3.5-2.6c0.2,0.1,0.5,0.1,0.7,0.1c0.4,0,0.7-0.1,1-0.1c-1.7-0.4-3-1.9-3-3.7v-0.1c0.5,0.3,1.1,0.4,1.7,0.5   c-1-0.7-1.7-1.8-1.7-3.1c0-0.7,0.2-1.3,0.5-1.9c1.9,2.3,4.6,3.7,7.7,3.9c-0.1-0.3-0.1-0.5-0.1-0.8c0-2,1.7-3.7,3.7-3.7   c1.1,0,2,0.5,2.7,1.2c0.8-0.2,1.6-0.5,2.3-0.9c-0.3,0.9-0.8,1.6-1.6,2c0.8-0.1,1.5-0.3,2.2-0.6C33.6,20.6,33,21.2,32.3,21.8z"
                />
            </g>
        </svg>
    );
}

export default Twitter;