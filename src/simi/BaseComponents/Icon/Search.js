import React from "react"
import {defaultStyle} from './Consts'

const Search = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            style={style}
            className={props.className}
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 50 50"
        >
            <title>icon/action/search</title>
            <g id="Combined-Shape-search">
                <path
                    id="path-1_1_search"
                    className="st0"
                    d="M30.7,27.8l8.7,8.7c0.9,0.9,0.9,1.8-0.1,2.8s-1.9,1-2.8,0.1l-8.7-8.7c-1.8,1.2-4,2-6.4,2   c-6.3,0-11.3-5.1-11.3-11.3S15.1,10,21.3,10s11.3,5.1,11.3,11.3C32.7,23.7,31.9,25.9,30.7,27.8z M21.3,28.5c4,0,7.2-3.2,7.2-7.2   s-3.2-7.2-7.2-7.2s-7.2,3.2-7.2,7.2S17.4,28.5,21.3,28.5z"
                />
            </g>
        </svg>
    )
}
export default Search