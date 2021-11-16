import React from 'react'
import MenuItem from 'src/simi/BaseComponents/MenuItem'
import {configColor} from 'src/simi/Config';
import Identify from "src/simi/Helper/Identify"
import UserIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/User'
import PropTypes from 'prop-types'
import CateTree from './CateTree'
import Setting from './Setting'
import { connect } from 'src/drivers';

const styles = {
    iconMenu : {
        fill : configColor.menu_icon_color,
        width: 18,
        height: 18
    },
    menu : {
        color : configColor.menu_text_color,
    },
    divider : {
        backgroundColor : configColor.menu_line_color
    }
}
class LeftMenuContent extends React.Component{

    constructor(props) {
        super(props);
        this.parent=this.props.parent;
    }

    handleLink = (location) => {
        this.props.handleLink(location)
    }

    handleMenuItem =(item)=>{
        if(item && item.url){
            this.handleLink(item.url)
        } else if (item && item.pathname) {
            this.handleLink(item)
        }
    }

    renderSections() {
        const {classes} = this.props
        return (
            <React.Fragment>
                <MenuItem 
                    classes={classes}
                    icon={<UserIcon style={styles.iconMenu}/>}
                    titleStyle={styles.menu}
                    title={Identify.__('My Account')}
                    onClick={()=>this.handleLink('/account.html')}
                />
                <CateTree
                    classes={classes}
                    handleMenuItem={this.handleMenuItem.bind(this)}
                    hideHeader={false}
                    defaultExpandedRoot={true}/>
                <Setting parent={this} style={styles} classes={classes}/>
            </React.Fragment>
        )
    }

    render(){
        const {classes} = this.props
        return (
            <div className={classes["list-menu-header"]} style={{maxHeight:window.innerHeight}}>
                {this.renderSections()}
            </div>
        )
    }
}

LeftMenuContent.contextTypes = {
    classes: PropTypes.object
};

const mapStateToProps = ({ user }) => { 
    const { isSignedIn } = user;
    return {
        isSignedIn
    }; 
};

export default connect(
    mapStateToProps
)(LeftMenuContent);