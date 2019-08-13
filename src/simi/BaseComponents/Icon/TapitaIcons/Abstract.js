import React from 'react';
import PropTypes from 'prop-types';

class Abstract extends React.PureComponent {
    constructor(props) {
        super(props);
        const style = {
            display: 'inline-block',
            color: 'rgba(0, 0, 0, 0.87)',
            fill: 'rgb(0, 0, 0, 0.87)',
            height: 25,
            width: 25,
            userSelect: 'none',
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        }
        const color = props.color ? {fill: props.color} : {};
        this.style = {...style, ...props.style, ...color}
        this.className = this.props.className;
    }

    renderSvg = (viewBox,icon) =>{
        return (
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 className={this.className}
                 viewBox={viewBox} style={this.style}>
                {icon}
            </svg>
        )
    }
}

Abstract.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
}

Abstract.defaultProps = {
    color: null,
    style: {},
    className: ''
}
export default Abstract;