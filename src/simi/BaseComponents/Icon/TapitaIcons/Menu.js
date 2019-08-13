import React from 'react'
import Abstract from './Abstract';

class Icon extends Abstract {
    render() {
        return (
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 className={this.className}
                 viewBox="0 0 750 479.9" style={this.style}>
                <path d="M42,407.1c-18.5,0-37,18.5-37,36.9c0,18.5,18.5,36.9,37,36.9h666.2c18.5,0,37-18.5,37-36.9c0-18.5-18.5-36.9-37-36.9H42z
	 M42,204.1c-18.5,0-37,18.5-37,36.9c0,18.5,18.5,36.9,37,36.9h481.1c18.5,0,37-18.5,37-36.9c0-18.5-18.5-36.9-37-36.9H42z M42,1
	C23.5,1,5,19.5,5,37.9c0,18.5,18.5,36.9,37,36.9h666.2c18.5,0,37-18.5,37-36.9c0-18.5-18.5-36.9-37-36.9H42z"/>
            </svg>
        )
    }

}

export default Icon;

