/*
Header and Menu items
*/
import React from 'react'
import PropTypes from 'prop-types'
import LeftMenuContent from './LeftMenuContent'
import {itemTypes} from './Consts'
import {configColor} from 'src/simi/Config';
import BottomMenu from './BottomMenu'
import { connect } from 'src/drivers';
import { toggleDrawer, closeDrawer } from 'src/actions/app';

class Dashboardmenu extends React.Component {

    getBrowserHistory = () => {
        return this.props.history
    }

    handleLink = (link) => {
        this.getBrowserHistory().push(link);
        this.handleCloseMenu()
    }

    handleShowMenu = () => {
        this.props.openNav()
    }

    handleCloseMenu = () => {
        this.props.hideNav()
    }

    handleClickMenuItem = (item) => {
        const itemTypeId = parseInt(item.type, 10)
        const typeIndex = itemTypeId - 1
        if (itemTypes[typeIndex]) {
            const itemType = itemTypes[typeIndex]
            if (itemType['url']) {
                this.handleLink(itemType['url'])
            } else {
                if (itemTypeId === 13) { //open a category page
                    if (item.category_id)
                        this.handleLink(`/products?cat=${item.category_id}`)
                } else if (itemTypeId  === 18) { //open an url
                    if (item.content) {
                        if (item.content.includes('http://') || item.content.includes('https://'))
                            window.location.href = item.content;
                        else
                            this.handleLink(item.content)
                    }
                } else if (itemTypeId  === 20) { //open menu
                    this.handleShowMenu()
                } else if (itemTypeId  === 24) { //open customization page
                    if (item.content)
                        this.handleLink('/' + item.content)
                }
            }
        }
    }
    
    renderLeftMenu = () => {
        return (
            <LeftMenuContent 
                classes={this.props.classes} 
                ref={node => this.leftMenu = node} 
                leftMenuItems={this.props.leftMenuItems} 
                isPhone={this.props.isPhone}
                handleLink={this.handleLink.bind(this)}
                parent={this}
            />
        )
    }


    renderBottomMenu = () => {
        const {props} = this
        this.bottomContains = {
            cart: false,
            menu: false,
            search: false,
        }

        if (props.bottomMenuItems) {
            props.bottomMenuItems.forEach(item=> {
                const type = parseInt(item.type, 10)
                if (type === 2)
                    this.bottomContains.cart = true
                else if (type === 22)
                    this.bottomContains.search = true
                else if (type === 20)
                    this.bottomContains.menu = true
            })
            // try {
            //     $('#siminia-main-page').css('margin-bottom', '38px')
            // } catch (err) { console.log(err)}
            return <BottomMenu parent={this} bottomMenuItems={props.bottomMenuItems} classes={props.classes} />
        }
        return <div></div>
    }

    render() {
        return (
            <React.Fragment>
                <aside className={this.props.className} style={{backgroundColor: configColor.menu_background}}>
                    {this.renderLeftMenu()}
                </aside>
                {this.renderBottomMenu()}
            </React.Fragment>
        )
    }
}

Dashboardmenu.contextTypes = {
    className: PropTypes.string,
    leftMenuItems: PropTypes.object,
    router: PropTypes.object,
    classes: PropTypes.object,
    history: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
    openNav: () => dispatch(toggleDrawer('nav')),
    hideNav: () => dispatch(closeDrawer('nav'))
});

export default connect(
    null,
    mapDispatchToProps
)(Dashboardmenu);
