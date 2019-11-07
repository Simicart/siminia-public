import React from 'react'
import Identify from "src/simi/Helper/Identify"
import HeaderNavMegaitem from './HeaderNavMegaitem'
import { Link } from 'src/drivers';
import NavTrigger from './navTrigger'
import MenuIcon from 'src/simi/BaseComponents/Icon/Menu'
import {cateUrlSuffix} from 'src/simi/Helper/Url'


class Navigation extends React.Component{
    toggleMegaItemContainer() {
        const { classes } = this.props
        $(`.${classes['main-nav']}`).find(`.${classes['nav-item-container']}`).each(function() {
            $(this).removeClass(classes['active'])
        });
    }

    render() {
        const { classes } = this.props
        let menuItems = []
        const showMenuTrigger = false
        if (window.DESKTOP_MENU) {
            const menuItemsData = window.DESKTOP_MENU
            menuItems = menuItemsData.map((item, index) => {
                if (item.children && item.children.length > 0) {
                    let title = item.name
                    if (item.link) {
                        const location = {
                            pathname: item.link,
                            state: {}
                        }
                        title = (
                            <Link 
                            className={classes["nav-item"]}
                            to={location}
                            >
                                {Identify.__(item.name)}
                            </Link>
                        )
                    }

                    const navItemContainerId = `nav-item-container-${item.menu_item_id}`
                    return (
                        <div
                            key={index} 
                            id={navItemContainerId}
                            className={classes['nav-item-container']}
                            onFocus={() => {
                                $(`#${navItemContainerId}`).addClass(classes['active'])
                            }}
                            onMouseOver={() => {
                                $(`#${navItemContainerId}`).addClass(classes['active'])
                            }}
                            onBlur={() => {
                                $(`#${navItemContainerId}`).removeClass(classes['active'])
                            }}
                            onMouseOut={() => {
                                $(`#${navItemContainerId}`).removeClass(classes['active'])
                            }}>
                            {title}
                            <HeaderNavMegaitem 
                                classes={classes}
                                data={item} 
                                itemAndChild={item}
                                toggleMegaItemContainer={()=>this.toggleMegaItemContainer()}
                            />
                        </div>
                    )
                }
                else {
                    if (item.link && item.link.includes('http'))
                        return (
                            <a 
                                className={classes["nav-item"]}
                                key={index} 
                                href={item.link?item.link:'/'}
                                style={{color: 'white', textDecoration: 'none'}}
                            >
                                {Identify.__(item.name)}
                            </a>
                        )
                    return (
                        <Link 
                            className={classes["nav-item"]}
                            key={index} 
                            to={item.link?`${item.link}`:'/'}
                            style={{color: 'white', textDecoration: 'none'}}
                        >
                            {Identify.__(item.name)}
                        </Link>
                    )
                }
            })
        } else {
            const storeConfig = Identify.getStoreConfig();
            if (storeConfig && storeConfig.simiRootCate && storeConfig.simiRootCate.children) {
                const rootCateChildren  = storeConfig.simiRootCate.children
                rootCateChildren.sort((a, b)=> a.position - b.position)
                menuItems = rootCateChildren.map((item, index) => {
                    if (!item.name || !item.include_in_menu)
                        return ''
                    if (item.children && item.children.length > 0) {
                        const location = {
                            pathname: '/' + item.url_path + cateUrlSuffix(),
                            state: {}
                        }
                        const title = (
                            <Link 
                            className={classes["nav-item"]}
                            to={location}
                            >
                                {Identify.__(item.name)}
                            </Link>
                        )
    
                        const navItemContainerId = `nav-item-container-${item.id}`
                        return (
                            <div
                                key={index} 
                                id={navItemContainerId}
                                className={classes['nav-item-container']}
                                onFocus={() => {
                                    $(`#${navItemContainerId}`).addClass(classes['active'])
                                }}
                                onMouseOver={() => {
                                    $(`#${navItemContainerId}`).addClass(classes['active'])
                                }}
                                onBlur={() => {
                                    $(`#${navItemContainerId}`).removeClass(classes['active'])
                                }}
                                onMouseOut={() => {
                                    $(`#${navItemContainerId}`).removeClass(classes['active'])
                                }}>
                                {title}
                                <HeaderNavMegaitem 
                                    classes={classes}
                                    data={item} 
                                    itemAndChild={item}
                                    toggleMegaItemContainer={()=>this.toggleMegaItemContainer()}
                                />
                            </div>
                        )
                    }
                    else {
                        return (
                            <Link 
                                className={classes["nav-item"]}
                                key={index} 
                                to={'/' + item.url_path + cateUrlSuffix()}
                                style={{color: 'white', textDecoration: 'none'}}
                            >
                                {Identify.__(item.name)}
                            </Link>
                        )
                    }
                })
            }
        }
        return (
            <div className={classes["app-nav"]}>
                <div className="container">
                    <div className={classes["main-nav"]}>
                        {
                            showMenuTrigger && 
                            <NavTrigger>
                                <MenuIcon color="white" style={{width:30,height:30}}/>
                            </NavTrigger>
                        }
                        {menuItems}
                    </div>
                </div>
            </div>
        );
    }
}
export default Navigation