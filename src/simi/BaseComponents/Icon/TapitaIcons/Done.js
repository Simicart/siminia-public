import React from 'react'
import Abstract from './Abstract'

class Icon extends Abstract {
    render() {
        return (
            <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 className={this.className}
                 viewBox="0 0 96 96" style={this.style}>
                <g>
                    <path style={{fillRule: 'evenodd', clipRule: 'evenodd'}} d="M94.5,14.1c-2.1-2-5.4-2-7.5,0L32.2,68.4L9,45.5c-2.1-2-5.4-2-7.5,0c-2.1,2-2.1,5.4,0,7.4l30.6,30.3l62.3-61.7
	C96.5,19.4,96.5,16.1,94.5,14.1z"/>
                </g>
            </svg>
        )
    }
}

export default Icon;

