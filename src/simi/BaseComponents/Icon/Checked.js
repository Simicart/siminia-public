import React from "react"
import { defaultStyle } from './Consts'

const Checked = props => {
    const color = props.color ? { fill: props.color } : {};
    const style = { ...defaultStyle, ...props.style, ...color, ...{ enableBackground: 'new 0 0 26 26' } }

    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;"
            style={style}
            className={props.className}
        >
            <g id="_x2D_">
                <g id="v" transform="translate(-608.000000, -723.000000)">
                    <g className="st0">
                        <path className="st1" d="M631.5,723.5c0.4,0.4,0.5,0.8,0.5,1.4v20.2c0,0.5-0.2,1-0.5,1.4c-0.3,0.4-0.8,0.5-1.4,0.5h-20.2
                   c-0.5,0-1-0.2-1.4-0.5c-0.4-0.3-0.5-0.8-0.5-1.4v-20.2c0-0.5,0.2-1,0.5-1.4c0.3-0.4,0.8-0.5,1.4-0.5h20.2
                   C630.6,723,631,723.2,631.5,723.5z M627.2,730.2c0-0.3-0.1-0.5-0.3-0.6c-0.2-0.1-0.4-0.3-0.6-0.3s-0.5,0.1-0.7,0.3l-8.8,8.8
                   l-2.3-4c-0.1-0.2-0.3-0.4-0.5-0.4c-0.2-0.1-0.5,0-0.7,0.1c-0.2,0.1-0.4,0.3-0.4,0.5c-0.1,0.2,0,0.5,0.1,0.7l3,5.1
                   c0.2,0.3,0.4,0.5,0.8,0.5c0.2,0,0.3,0,0.5-0.1c0.1-0.1,0.2-0.1,0.2-0.2l0,0l9.6-9.6C627.1,730.6,627.2,730.4,627.2,730.2z"/>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export default Checked