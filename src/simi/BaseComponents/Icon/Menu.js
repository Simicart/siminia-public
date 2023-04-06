import React from 'react'
import {defaultStyle} from './Consts'

const Menu = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
                version="1.1" id="Layer_1" x="0px" y="0px"
                viewBox="0 0 50 50"
                style={style} className={props.className}>
            {/* <title>Menu</title> */}
            
            <g id="Combined-Shape">
                <path id="path-1_1_" className="st0" d="M12,15h26.1c1.3,0,1.9,0.7,1.9,2.1s-0.6,2-1.9,1.9h-26c-1.4,0.1-2.1-0.5-2.1-2   C10,15.6,10.7,14.9,12,15z M12,23h26.1c1.3,0,1.9,0.7,1.9,2.1s-0.6,2-1.9,1.9h-26c-1.4,0.1-2.1-0.5-2.1-2C10,23.6,10.7,22.9,12,23z    M12,31h26.1c1.3,0,1.9,0.7,1.9,2.1s-0.6,2-1.9,1.9h-26c-1.4,0.1-2.1-0.5-2.1-2C10,31.6,10.7,30.9,12,31z"/>
            </g>
            <g>
                <path id="path-1_2_" className="st0" d="M12,15h26.1c1.3,0,1.9,0.7,1.9,2.1s-0.6,2-1.9,1.9h-26c-1.4,0.1-2.1-0.5-2.1-2   C10,15.6,10.7,14.9,12,15z M12,23h26.1c1.3,0,1.9,0.7,1.9,2.1s-0.6,2-1.9,1.9h-26c-1.4,0.1-2.1-0.5-2.1-2C10,23.6,10.7,22.9,12,23z    M12,31h26.1c1.3,0,1.9,0.7,1.9,2.1s-0.6,2-1.9,1.9h-26c-1.4,0.1-2.1-0.5-2.1-2C10,31.6,10.7,30.9,12,31z"/>
            </g>
        </svg>
    )
}
export default Menu