import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import CacheHelper from 'src/simi/Helper/CacheHelper';
import Check from 'src/simi/BaseComponents/Icon/TapitaIcons/SingleSelect';
import {configColor} from 'src/simi/Config';
import ListItemNested from 'src/simi/BaseComponents/MuiListItem/Nested';
import MenuItem from 'src/simi/BaseComponents/MenuItem'
import {showFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

class Storeview extends React.Component {

    constructor(props) {
        super(props);
        this.checkStore = false;
        this.selectedStoreId = false
        this.selectedGroupId = false
    }

    selectedStore(store) {
        showFogLoading()
        let appSettings = Identify.getAppSettings()
        const cartId = storage.getItem('cartId')
        const signin_token = storage.getItem('signin_token')
        appSettings = appSettings?appSettings:{}
        CacheHelper.clearCaches()
        appSettings.store_id = parseInt(store.store_id, 10);
        if (cartId)
            storage.setItem('cartId', cartId)
        if (signin_token)
            storage.setItem('signin_token', signin_token)
        Identify.storeAppSettings(appSettings);
        window.location.reload()
    }

    getSelectedStoreId() {
        if (!this.selectedStoreId) {
            const merchantConfigs = Identify.getStoreConfig();
            if (merchantConfigs && merchantConfigs.storeConfig)
                this.selectedStoreId = parseInt(merchantConfigs.storeConfig.id, 10)
        }
        return this.selectedStoreId
    }

    getSelectedGroupId() {
        if (!this.selectedGroupId) {
            const merchantConfigs = Identify.getStoreConfig();
            if (merchantConfigs && merchantConfigs.simiStoreConfig)
                this.selectedGroupId = merchantConfigs.simiStoreConfig.config.base.group_id
        }
        return this.selectedGroupId
    }

    renderItem() {
        const {classes} = this.props
        if (typeof(Storage) !== "undefined") {
            const merchantConfigs = Identify.getStoreConfig();
            const storeList = merchantConfigs.simiStoreConfig.config.stores.stores;
            const selectedStore = storeList.filter((item) => {
                return item.group_id === this.getSelectedGroupId()
            })[0];
            const storeViews = selectedStore.storeviews.storeviews;
            if (storeViews.length > 1) {
                this.checkStore = true;
                return(
                    <div
                        className={this.props.className}
                    >
                        <ListItemNested
                            primarytext={<div className={`${classes["menu-title"]} menu-title`} style={{color:configColor.menu_text_color}}>{Identify.__('Language')}</div>}
                            className={this.props.className}
                        >
                            {this.renderSubItem(storeViews)}
                        </ListItemNested>
                    </div>
                )
            }
        }
        return false;
    }

    renderSubItem(storeViews) {
        const {classes} = this.props
        if(!this.checkStore) return;
        let storesRender = [];
        
        storesRender = storeViews.map((store) => {
            if(parseInt(store.is_active,10) !== 1 ) return null;
            const isSelected = parseInt(store.store_id, 10) === this.getSelectedStoreId() ? 
                <Check color={configColor.button_background} style={{width: 18, height: 18}}/> : 
                <span className={`${classes["not-selected"]} not-selected`} style={{borderColor : configColor.menu_text_color, width: 18, height: 18}}></span>;
            const storeItem =  (
                <div className={`${classes["store-item"]} store-item`} style={{display: 'flex'}}>
                    <div className={`${classes["selected"]} selected`}>
                        {isSelected}
                    </div>
                    <div className={`${classes["store-name"]} store-name`}>
                        {store.name}
                    </div>
                </div>
            )
            return (
                <div 
                    role="presentation"
                    key={Identify.randomString(5)}
                    style={{marginLeft: 5,marginRight:5}}
                    onClick={() => this.selectedStore(store)}>
                    <MenuItem title={storeItem}
                                className={this.props.className}
                    />
                </div>
            );
        }, this);

        return storesRender;
    }

    render(){
        try {
            const item = this.renderItem()
            return item
        } catch(err) {
            console.log(err)
        }
        return ''
    }
}
export default Storeview