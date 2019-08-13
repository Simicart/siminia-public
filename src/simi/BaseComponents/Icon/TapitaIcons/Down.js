import React from 'react';
import Abstract from './Abstract'

class DownIcon extends Abstract {
    render() {
        return (
            <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 className={this.className}
                 viewBox="0 0 232 136.5" style={this.style}>
                <g>
                    <g>
                        <path d="M224.1,32.5l-95.6,95.6c-3.2,2.1-7.6,4.3-11.9,4.3s-8.7-1.1-11.9-4.3L8,31.4C1.5,24.9,1.5,15.1,8,8.6
			s16.3-6.5,22.8,0l85.8,85.8l85.9-85.8c6.5-6.5,16.3-6.5,22.8,0c3.2,3.2,4.3,7.6,4.3,11.9S227.5,29.2,224.1,32.5z"/>
                    </g>
                </g>
            </svg>
        )
    }
}

export default DownIcon;

