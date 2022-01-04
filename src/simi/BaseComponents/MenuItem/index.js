/**
 * Created by codynguyen on 7/10/18.
 */
import React, {Component} from 'react';
import {configColor} from "src/simi/Config";
import PropTypes from 'prop-types';
import defaultClasses from './menuitem.module.css'
import { mergeClasses } from 'src/classify'

class MenuItem extends Component {
    render() {
        const {title,icon,divider,menuStyle,iconStyle,titleStyle,classes} = this.props;
        const mergedClasses = mergeClasses(classes, defaultClasses)
        return (
            <div className={`${mergedClasses["menu-item-wrap"]} ${divider?mergedClasses['divider']:''}`} style={{borderColor: configColor.menu_line_color}}>
                <div role="presentation" style={menuStyle} onClick={this.props.onClick}>
                    <div className={mergedClasses["menu-content"]}>
                        <div className={mergedClasses["icon-menu"]} style={iconStyle}>
                            {icon}
                        </div>
                        <div className={mergedClasses["menu-title"]} style={titleStyle}>
                            {title}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
MenuItem.defaultProps = {
    title : '',
    icon : '',
    divider : true,
    menuStyle : {},
    titleStyle : {},
    iconStyle : {},
    onClick : function () {}
}
MenuItem.propsTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.node,
        PropTypes.string,
    ]),
    icon: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.node,
        PropTypes.string,
    ]),
    divider: PropTypes.bool,
    menuStyle : PropTypes.object,
    titleStyle : PropTypes.object,
    iconStyle : PropTypes.object,
    onClick : PropTypes.func
}
export default MenuItem;