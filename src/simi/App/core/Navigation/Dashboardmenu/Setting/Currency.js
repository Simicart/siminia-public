import React from 'react';
import StoreView from './Storeview';
import Identify from 'src/simi/Helper/Identify';
import CacheHelper from 'src/simi/Helper/CacheHelper';
import Check from 'src/simi/BaseComponents/Icon/TapitaIcons/SingleSelect';
import ListItemNested from 'src/simi/BaseComponents/MuiListItem/Nested';
import {configColor} from 'src/simi/Config';
import MenuItem from "src/simi/BaseComponents/MenuItem";
import {showFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'

class Currency extends StoreView {

    constructor(props){
        super(props);
        this.checkCurrency = false;
    }
    
    chosedCurrency(currency) {
        showFogLoading()
        let appSettings = Identify.getAppSettings()
        appSettings = appSettings?appSettings:{}
        CacheHelper.clearCaches()
        appSettings.currency = currency;
        Identify.storeAppSettings(appSettings);
        window.location.reload()
    }

    getSelectedCurrency() {
        if (!this.selectedCurrency) {
            const merchantConfigs = Identify.getStoreConfig();
            this.selectedCurrency = merchantConfigs.storeConfig.default_display_currency_code
        }
        return this.selectedCurrency
    }

    renderItem() {
        const {classes} = this.props
        if (typeof(Storage) !== "undefined") {
            const merchantConfigs = Identify.getStoreConfig();
            const currencies = merchantConfigs.simiStoreConfig.config.base.currencies;
            
            if(currencies.length > 1) {
                this.checkCurrency = true;
                return(
                    <div style={{marginLeft: 15}}>
                        <ListItemNested
                            primarytext={<div className={classes["menu-title"]} style={{color:configColor.menu_text_color}}>{Identify.__('Currency')}</div>}
                            className={this.props.className}
                        >
                            {this.renderSubItem()}
                        </ListItemNested>
                    </div>
                )
            }
        }
        return null;
    }

    renderSubItem(){
        if(!this.checkCurrency) return;
        const {classes} = this.props
        let storesRender = [];
        const merchantConfigs = Identify.getStoreConfig();
        const currencyList = merchantConfigs.simiStoreConfig.config.base.currencies || null

        
        if (currencyList !== null) {
            storesRender = currencyList.map((currency) => {
                const isSelected = currency.value === this.getSelectedCurrency() ? 
                    <Check color={configColor.button_background} style={{width: 18, height: 18}} /> : 
                    <span className={classes["not-selected"]} style={{borderColor : configColor.menu_text_color, width: 18, height: 18}}></span>;
                    const currencyItem =<span className={classes["store-item"]} style={{display: 'flex'}}>
                                    <div className={classes["selected"]}>
                                        {isSelected}
                                    </div>
                                    <div className={classes["store-name"]}>
                                        {currency.title}
                                    </div>
                                </span>
                return (
                <div 
                    role="presentation"
                    key={Identify.randomString(5)}
                    style={{marginLeft: 5,marginRight:5}}
                    onClick={() => this.chosedCurrency(currency.value)}>
                    <MenuItem title={currencyItem}
                              className={this.props.className}
                    />
                </div>
                );
            });
            return storesRender;
        }
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
export default Currency;