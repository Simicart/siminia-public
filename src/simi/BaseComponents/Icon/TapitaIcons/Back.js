import React from 'react';
import Abstract from './Abstract'

class BackIcon extends Abstract {
    render() {
        return (
            <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 className={this.className}
                 viewBox="0 0 131.8 227.3" style={this.style}>
                <g>
                    <g>
                        <path className="st0" d="M113.9,0.3c4.3,0,8.7,1.1,11.9,4.3c6.5,6.5,6.5,16.3,0,22.8L40,113.3l85.8,85.8c6.5,6.5,6.5,16.3,0,22.8
                    c-6.5,6.5-16.3,6.5-22.8,0L6.3,125.2C3.1,122,2,117.6,2,113.3c0-4.3,2.2-8.7,4.3-11.9l95.6-95.6C105.2,2.4,109.6,0.3,113.9,0.3z"
                        />
                    </g>
                </g>
            </svg>
        )
    }
}

export default BackIcon;

