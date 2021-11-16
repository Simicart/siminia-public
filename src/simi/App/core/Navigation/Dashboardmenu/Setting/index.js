import React from 'react'
import Identify from "src/simi/Helper/Identify";
import {configColor} from "src/simi/Config";
import ListItemNested from "src/simi/BaseComponents/MuiListItem/Nested";
import Storeview from "src/simi/BaseComponents/Settings/Storeview/index";
import Currency from "src/simi/BaseComponents/Settings/Currency/index";
import SettingIcon from 'src/simi/BaseComponents/Icon/Settings'
const Setting  = (props) => {
    const merchantConfigs = Identify.getStoreConfig();
    const {classes, style} = props
    if (!merchantConfigs || !merchantConfigs.simiStoreConfig)
        return ''
    try {
        const hasCurrencyConfig = merchantConfigs.simiStoreConfig.config.base.currencies.length > 1
        let hasStoreViewOptions = false
        
        if (merchantConfigs && merchantConfigs.availableStores && (merchantConfigs.availableStores.length > 1)) {
            hasStoreViewOptions = true
        }
        if (hasCurrencyConfig || hasStoreViewOptions) {
            const primarytext = <div className={classes["menu-content"]}>
                                <div className={classes["icon-menu"]}>
                                    <SettingIcon style={style.iconMenu}/>
                                </div>
                                <div className={classes["menu-title"]} style={style.menu}>
                                    {Identify.__('Settings')}
                                </div>
                            </div>
            return (
                <div key={Identify.randomString(5)} style={{color: configColor.menu_text_color}}>
                    <ListItemNested
                        primarytext={primarytext}
                    >
                        <Storeview classes={classes} />
                        <Currency classes={classes} />
                    </ListItemNested>
                </div>
            )
        }
    } catch(err) {
        console.log(err)
    }
    return ''
}
export default Setting