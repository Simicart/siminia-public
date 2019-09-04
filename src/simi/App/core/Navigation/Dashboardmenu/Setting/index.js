import React from 'react'
import Identify from "src/simi/Helper/Identify";
import {configColor} from "src/simi/Config";
import ListItemNested from "src/simi/BaseComponents/MuiListItem/Nested";
import Storeview from "src/simi/BaseComponents/Settings/Storeview";
import Currency from "src/simi/BaseComponents/Settings//Currency";
import SettingIcon from 'src/simi/BaseComponents/Icon/Settings'
const Setting  = (props) => {
    const merchantConfigs = Identify.getStoreConfig()
    const {classes, style} = props
    if (!merchantConfigs || !merchantConfigs.simiStoreConfig)
        return ''
    try {
        const currencies = merchantConfigs.simiStoreConfig.config.base.currencies
        const storeList = merchantConfigs.simiStoreConfig.config.stores.stores
        if (currencies.length > 1 || storeList.length > 1) {
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