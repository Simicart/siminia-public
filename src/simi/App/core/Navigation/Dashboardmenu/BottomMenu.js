import React from 'react' 
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {configColor} from 'src/simi/Config';
import Identify from 'src/simi/Helper/Identify';
import {itemTypes} from './Consts'
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent/'
import { connect } from 'src/drivers'

class BottomMenu extends React.Component{
    constructor(props) {
        super(props)
        this.parent = props.parent
    }

    renderCartIcon(item, icon, itemStyle) {
        const {
            classes,
            cart: { details }
        } = this.props;
        const cartQty = (details && details.items_qty !== 0) ? details.items_qty : "0";
        return (
            <BottomNavigationAction
                key={`cart-ic-${item.entity_id}`}
                className={`${classes['app-bar-menu']} ${classes['menu-item']}`}
                style={itemStyle}
                label={Identify.__(item.name)}
                onClick={() => this.parent.handleClickMenuItem(item)}
                icon={
                    <div style={{position: 'relative', marginBottom: '-4px'}}>
                        {icon}
                        <div style={{
                            position: 'absolute',
                            background: configColor.top_menu_icon_color,
                            color: configColor.key_color,
                            right: -10,
                            textAlign: 'center',
                            top: -10,
                            display: cartQty === '0' ? 'none' : 'unset',
                            padding: '0 5px',
                            borderRadius: '50%',
                            minWidth: 15,
                            fontSize: '12px'
                        }}
                                className={classes["cart-number"]}>{cartQty}</div>
                    </div>}>
            </BottomNavigationAction>
        )
    }
    
    renderBottomMenuItems(itemStyle, iconStyle) {
        const {classes, isSignedIn} = this.props
        const iconProps = {
            style: iconStyle,
            color: configColor.top_menu_icon_color
        }
        const items = []
        this.props.bottomMenuItems.map((item, index) => {
            if (item.type) {
                const itemTypeIndex = parseInt(item.type, 10) - 1
                if (itemTypes[itemTypeIndex]) {
                    const itemType = itemTypes[itemTypeIndex]
                    if (itemType['disabled'])
                        return null
                    if (isSignedIn) {
                        if (itemType['required_logged_out'])
                            return null
                    } else if (itemType['required_logged_in'])
                        return null
                        
                    let icon = itemType.svg_icon?itemType.svg_icon:''
                    if (item.icon)
                        icon = <img src={item.icon} alt={item.name} style={{maxWidth: 20, maxHeight: 17}}/>
                    else if (itemType.svg_icon) {
                        icon = (
                            <LazyComponent 
                                component={()=>import(`src/simi/BaseComponents/Icon/TapitaIcons/${itemType.svg_icon}`)}
                                {...iconProps}
                            />
                        )
                    }
                    if (parseInt(item.type, 10) === 2)
                        items.push(this.renderCartIcon(item, icon, itemStyle))
                    else
                        items.push (
                            <BottomNavigationAction
                                key={index}
                                className={`${classes['app-bar-menu']} ${classes['menu-item']}`}
                                label={Identify.__(item.name)}
                                style={itemStyle}
                                onClick={() => this.parent.handleClickMenuItem(item)}
                                icon={icon}
                                />
                        )
                }
            }
            return null
        }, this)
        return items
    }

    render() {
        const {classes} = this.props
        const iconStyle = {
            width: 20, height: 17
        }
        const itemStyle = {
            color: configColor.top_menu_icon_color,
            maxWidth: 'unset',
            minWidth: 'unset'
        }
        const bottomNavi =  {
            width: '100%',
            marginRight: 0,
            backgroundColor: configColor.key_color,
            height: 55,
            position: 'fixed',
            display: 'inline-flex',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            /*
            WebkitBoxShadow: '0px -3px 6px 0px rgba(0,0,0,0.2)',
            boxShadow: '0px -3px 6px 0px rgba(0,0,0,0.2)',
            */
            transition: 'height 0.4s ease',
            borderTop: 'solid #eaeaea 1px',
        }
        return (
            <BottomNavigation
                className={classes['ashboard-menu-bottom-item']}
                showLabels
                style={bottomNavi}
            >
                {this.renderBottomMenuItems(itemStyle, iconStyle)}
            </BottomNavigation>
        );
    }
}

const mapStateToProps = ({ cart, user }) => { 
    const { isSignedIn } = user;
    return {
        isSignedIn,
        cart
    }; 
};

export default connect(
    mapStateToProps
)(BottomMenu);