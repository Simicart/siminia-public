import React from 'react'
import Abstract from './Abstract';

class Icon extends Abstract {

    render() {
        return (
            <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 className={this.className}
                 viewBox="0 0 131.8 227.3" style={this.style}>
                <g>
                    <g>
                        <path style={{fill: this.props.color !== undefined ? this.props.color : '#231F20'}} d="M30.8,5.8l95.6,95.6c2.1,3.2,4.3,7.6,4.3,11.9c0,4.3-1.1,8.7-4.3,11.9l-96.7,96.7c-6.5,6.5-16.3,6.5-22.8,0
			s-6.5-16.3,0-22.8l85.8-85.8L6.9,27.4c-6.5-6.5-6.5-16.3,0-22.8c3.2-3.2,7.6-4.3,11.9-4.3S27.5,2.4,30.8,5.8z"/>
                    </g>
                </g>
            </svg>
        )
    }
}

export default Icon;

