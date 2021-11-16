import React from 'react';
import Identify from '../../Helper/Identify'
import PropTypes from 'prop-types';

const $ = window.$
class Panel extends React.Component {

    handleToggleOpen = (id) => {
        if (this.props.isToggle) {
            const panel = $('#' + id);
            panel.find('.panel-icon').toggleClass('rotate-180')
            panel.find('.panel-content').slideToggle()
        }
    };

    render() {
        const id = 'panel-' + Identify.randomString()
        const { headerStyle, expanded, className, title, titleSecondary, isToggle, renderContent, containerStyle } = this.props;

        return (
            <div className={`panel-container ${className}`} id={id} style={containerStyle}>
                <div role="presentation" className="panel-header flex" style={headerStyle} onClick={(e) => this.handleToggleOpen(id)}>
                    <div className={`panel-title`}>{title}</div>
                    <div className={`panel-secondary-title`}>{titleSecondary}</div>
                    {isToggle && (
                        <div className={`panel-icon ${expanded ? 'rotate-180' : ''}`}
                            style={Identify.isRtl() ? { marginRight: 'auto' } : {marginLeft: 'auto' }}>
                            <i className="icon-chevron-down"></i>
                        </div>
                    )}
                </div>
                <div className={`panel-content`} style={{ display: expanded ? 'block' : 'none' }}>
                    {renderContent}
                </div>
            </div>
        )
    }
}
Panel.defaultProps = {
    className: '',
    containerStyle: {},
    headerStyle: {},
    contentStyle: {},
    isToggle: true,
    title: null,
    titleSecondary: null,
    renderContent: null,
    expanded: true,
}
Panel.propTypes = {
    expanded: PropTypes.bool,
    className: PropTypes.string,
    containerStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    contentStyle: PropTypes.object,
    isToggle: PropTypes.bool,
    title: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
        PropTypes.node,
        PropTypes.string,
    ]),
    titleSecondary: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
        PropTypes.node,
        PropTypes.string,
    ]),
    renderContent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
        PropTypes.node,
        PropTypes.string,
    ])

}
export default Panel
