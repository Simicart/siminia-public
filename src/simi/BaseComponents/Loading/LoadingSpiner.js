import React from  'react';
import PropTypes from 'prop-types';
import Abstract from './Abstract';
class LoadingSpiner extends Abstract {
    render(){
        return this.renderLoading(
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 100 100"
                 preserveAspectRatio="xMidYMid"
                 style={this.style}>
                <g transform="translate(80,50)">
                    <g transform="rotate(0)">
                        <circle cx="0" cy="0" r="6"  fillOpacity="1" transform="scale(1.01114 1.01114)">
                            <animateTransform attributeName="transform" type="scale" begin="-0.9166666666666666s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                            <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.9166666666666666s"/>
                        </circle>
                    </g>
                </g><g transform="translate(75.98076211353316,65)">
                <g transform="rotate(29.999999999999996)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.9166666666666666" transform="scale(1.01947 1.01947)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.8333333333333334s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.8333333333333334s"/>
                    </circle>
                </g>
            </g><g transform="translate(65,75.98076211353316)">
                <g transform="rotate(59.99999999999999)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.8333333333333334" transform="scale(1.0278 1.0278)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.75s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.75s"/>
                    </circle>
                </g>
            </g><g transform="translate(50,80)">
                <g transform="rotate(90)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.75" transform="scale(1.03614 1.03614)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.6666666666666666s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.6666666666666666s"/>
                    </circle>
                </g>
            </g><g transform="translate(35.00000000000001,75.98076211353316)">
                <g transform="rotate(119.99999999999999)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.6666666666666666" transform="scale(1.04447 1.04447)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.5833333333333334s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.5833333333333334s"/>
                    </circle>
                </g>
            </g><g transform="translate(24.01923788646684,65)">
                <g transform="rotate(150.00000000000003)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.5833333333333334" transform="scale(1.0528 1.0528)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.5s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.5s"/>
                    </circle>
                </g>
            </g><g transform="translate(20,50.00000000000001)">
                <g transform="rotate(180)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.5" transform="scale(1.06114 1.06114)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.4166666666666667s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.4166666666666667s"/>
                    </circle>
                </g>
            </g><g transform="translate(24.019237886466836,35.00000000000001)">
                <g transform="rotate(209.99999999999997)">
                    <circle cx="0" cy="0" r="6" fillOpacity="0.4166666666666667" transform="scale(1.06947 1.06947)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.3333333333333333s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.3333333333333333s"/>
                    </circle>
                </g>
            </g><g transform="translate(34.999999999999986,24.019237886466847)">
                <g transform="rotate(239.99999999999997)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.3333333333333333" transform="scale(1.0778 1.0778)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.25s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.25s"/>
                    </circle>
                </g>
            </g><g transform="translate(49.99999999999999,20)">
                <g transform="rotate(270)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.25" transform="scale(1.08614 1.08614)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.16666666666666666s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.16666666666666666s"/>
                    </circle>
                </g>
            </g><g transform="translate(65,24.019237886466843)">
                <g transform="rotate(300.00000000000006)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.16666666666666666" transform="scale(1.09447 1.09447)">
                        <animateTransform attributeName="transform" type="scale" begin="-0.08333333333333333s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.08333333333333333s"/>
                    </circle>
                </g>
            </g><g transform="translate(75.98076211353316,34.999999999999986)">
                <g transform="rotate(329.99999999999994)">
                    <circle cx="0" cy="0" r="6"  fillOpacity="0.08333333333333333" transform="scale(1.0028 1.0028)">
                        <animateTransform attributeName="transform" type="scale" begin="0s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="0s"/>
                    </circle>
                </g>
            </g></svg>
        )
    }
}
LoadingSpiner.propTypes = {
    divStyle  : PropTypes.object,
    loadingStyle :PropTypes.object,
}
LoadingSpiner.defaultProps = {
    divStyle : {},
    loadingStyle : {},
    className : '',
    id : ''
}
export default LoadingSpiner;