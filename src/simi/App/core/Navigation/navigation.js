import React, { useState } from 'react';
import { func, string, oneOfType, number} from 'prop-types';
import classes from './navigation.css'
import Identify from 'src/simi/Helper/Identify'
import Dashboardmenu from './Dashboardmenu'
import { withRouter } from 'react-router-dom';
import * as Constants from 'src/simi/Config/Constants';

const Navigation = props => {
    const { getUserDetails, currentUser, isSignedIn, cartId } = props

    if (!cartId) {
        if (!isSignedIn)
            props.createCart() //create cart if empty
        else
            props.getCartDetails() //get cart if empty and logged int
    }

    //if not logged in or out of session, clear the old things
    const simiSessId = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID)
    if (!isSignedIn && simiSessId) {
        console.log('logged out or out of session')
        console.log(currentUser)
        Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID, null)
    }

    if (isSignedIn && (!currentUser || !currentUser.email)) //get user detail when missing (from refreshing)
        getUserDetails();

    const [isPhone, setIsPhone] = useState(window.innerWidth < 1024)

    $(window).resize(function () {
        const width = window.innerWidth;
        const newIsPhone = width < 1024;
        if(isPhone !== newIsPhone){
            setIsPhone(newIsPhone)
        }
    })

    const renderDashboardMenu = (className, jsonSimiCart) => {
        let leftMenuItems = null
        let bottomMenuItems = null
        let config = null
        if (jsonSimiCart && jsonSimiCart['app-configs'] && jsonSimiCart['app-configs'][0] && jsonSimiCart['app-configs'][0].app_settings) {
            config = jsonSimiCart['app-configs'][0]
            const app_settings = jsonSimiCart['app-configs'][0].app_settings
            if (
                config.themeitems &&
                config.api_version &&
                parseInt(config.api_version, 10)
            ) {
                if (isPhone) {
                    if (
                        app_settings.show_leftmenu_mobile &&
                        (parseInt(app_settings.show_leftmenu_mobile, 10) === 1) &&
                        config.themeitems.phone_left_menu_sections &&
                        config.themeitems.phone_left_menu_sections.length
                    ) {
                        leftMenuItems = config.themeitems.phone_left_menu_sections
                    }
                    if (
                        app_settings.show_bottommenu_mobile && 
                        (parseInt(app_settings.show_bottommenu_mobile, 10) === 1) && 
                        config.themeitems.phone_bottom_menu_items &&
                        config.themeitems.phone_bottom_menu_items.length
                    ) {
                        bottomMenuItems = config.themeitems.phone_bottom_menu_items
                    }
                    
                } else {
                    if (
                        app_settings.show_leftmenu_tablet &&
                        (parseInt(app_settings.show_leftmenu_tablet, 10) === 1) &&
                        config.themeitems.tablet_left_menu_sections &&
                        config.themeitems.tablet_left_menu_sections.length
                    ) {
                        leftMenuItems = config.themeitems.tablet_left_menu_sections
                    }
                    if (
                        app_settings.show_bottommenu_tablet && 
                        (parseInt(app_settings.show_bottommenu_tablet, 10) === 1) && 
                        config.themeitems.tablet_bottom_menu_items &&
                        config.themeitems.tablet_bottom_menu_items.length
                    ) {
                        bottomMenuItems = config.themeitems.tablet_bottom_menu_items
                    }
                }
            }
        }
        //if (leftMenuItems || bottomMenuItems) 
            return (
                <Dashboardmenu 
                    className={className} 
                    classes={classes} 
                    leftMenuItems={leftMenuItems} 
                    bottomMenuItems={bottomMenuItems} 
                    config={config} 
                    history={props.history}
                    isPhone={isPhone}
                />
            )
    }

    const {
        drawer,
    } = props;
    const isOpen = drawer === 'nav';
    const className = isOpen ? classes.root_open : classes.root;
    const simicartConfig = Identify.getAppDashboardConfigs()
    if (simicartConfig) {
        const dbMenu = renderDashboardMenu(className, simicartConfig)
        if (dbMenu)
            return dbMenu
    }
    return ''
}

Navigation.propTypes = {
    closeDrawer: func.isRequired,
    getUserDetails: func.isRequired,
    drawer: string,
    createCart: func.isRequired,
    getCartDetails: func.isRequired,
};

export default (withRouter)(Navigation);
