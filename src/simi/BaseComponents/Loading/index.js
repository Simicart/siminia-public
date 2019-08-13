import React from  'react';
import PropTypes from 'prop-types';
import Abstract from './Abstract';
class LoadingDefault extends Abstract {
    render(){
        return this.renderLoading(
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 100 100"
                 preserveAspectRatio="xMidYMid"
                 style={this.style}>
                <circle
                    xmlns="http://www.w3.org/2000/svg"
                    cx="50" cy="50"
                    stroke={'#aeaeae'}
                    strokeWidth="10"
                    fill="none"
                    r="35"
                    strokeDasharray="164.93361431346415 56.97787143782138"
                    transform="rotate(103.951 50 50)">
                    <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/>
                </circle>
            </svg>
        )
    }
}
LoadingDefault.propTypes = {
    divStyle  : PropTypes.object,
    loadingStyle :PropTypes.object,
}
LoadingDefault.defaultProps = {
    divStyle : {},
    loadingStyle : {width : 50, height : 50},
    className : '',
    id : ''
}
export default LoadingDefault;
export const Loading = (props) => {
    return <LoadingDefault {...props}/>
}