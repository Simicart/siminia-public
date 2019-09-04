import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Identify from '../../Helper/Identify'
import PropTypes from 'prop-types';
import defaultClasses from './style.css';

const styles = {
    container: {
        padding: 15
    },
    header: {
        padding: 0,
        cursor: 'pointer'
    },
    content: {
        paddingTop: 20
    },
    icon: {
        fill: '#333',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    }
}
const $ = window.$
class Panel extends React.Component {

    handleToggleOpen = (id) => {
        if (this.props.isToggle) {
            const panel = $('#' + id);
            panel.find('.panel-icon svg').toggleClass(defaultClasses['rotate-180'])
            panel.find('.panel-content').slideToggle()
        }
    };

    render() {
        const id = 'panel-' + Identify.randomString()
        const { headerStyle, isBox, expanded, className, title, titleSecondary, isToggle, renderContent, containerStyle } = this.props;
        styles.header = { ...styles.header, ...headerStyle, }
        if (isBox) {
            styles.container = {
                ...styles.container,
                ...containerStyle
            }
        }
        styles.content = {
            ...styles.content,
            ...{
                display: expanded ? 'block' : 'none'
            }
        }

        return (
            <div className={`panel-container ${className}`} id={id} style={styles.container}>
                <div role="presentation" className="panel-header flex" style={styles.header} onClick={(e) => this.handleToggleOpen(id)}>
                    <div className={`panel-title`}>{title}</div>
                    <div className={`panel-secondary-title`}>{titleSecondary}</div>
                    {isToggle && (
                        <div className={`panel-icon ${expanded ? defaultClasses['rotate-180'] : ''}`} style={{ marginLeft: 'auto' }}>
                            <IconButton>
                                <ExpandMoreIcon style={styles.icon} />
                            </IconButton>
                        </div>
                    )}
                </div>
                <div className={`panel-content`} style={styles.content}>
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
    isBox: true,
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
    isBox: PropTypes.bool,
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
