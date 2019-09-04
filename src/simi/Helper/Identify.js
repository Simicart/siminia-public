import * as Constants from 'src/simi/Config/Constants';
import CacheHelper from 'src/simi/Helper/CacheHelper';
import isObjectEmpty from 'src/util/isObjectEmpty';

class Identify {
    static SESSION_STOREAGE = 1;
    static LOCAL_STOREAGE = 2;

    /*
    String
    */

    static randomString(charCount = 20) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < charCount; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return btoa(text + Date.now());
    }

    static __(text) {
        const appConfig = this.getAppDashboardConfigs();
        let config = null;
        if (appConfig !== null) {
            config = appConfig['app-configs'][0] || null;
        }

        const storeConfig = this.getStoreConfig();
        try {
            const languageCode = storeConfig.storeConfig.locale;
            if (config.language.hasOwnProperty(languageCode)) {
                const {language} = config;
                const languageWithCode = language[languageCode];
                if (languageWithCode.hasOwnProperty(text)) {
                    return languageWithCode[text];
                }
            }
        } catch (err) {

        }

        return text
    }

    static isRtl() {
        let is_rtl = false;
        const configs = this.getStoreConfig();
        if (configs !== null && configs.storeview && configs.storeview.base && configs.storeview.base.is_rtl) {
            is_rtl = parseInt(configs.storeview.base.is_rtl, 10) === 1;
        }
        return is_rtl;
    }

    /*
    URL param
    */
    static findGetParameter(parameterName) {
        var result = null,
            tmp = [];
        var items = location.search.substr(1).split("&");
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        }
        return result;
    }

    /*
    Store config
    */
    static saveStoreConfig(data) {
        //check version
        if (data && data.simiStoreConfig && data.simiStoreConfig.pwa_studio_client_ver_number) {
            const {pwa_studio_client_ver_number} = data.simiStoreConfig
            const curentVer = this.getDataFromStoreage(Identify.LOCAL_STOREAGE, Constants.CLIENT_VER)
            if (curentVer && curentVer !== pwa_studio_client_ver_number) {
                console.log('New version released, updating..')
                CacheHelper.clearCaches()
                window.location.reload()
            }
            this.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.CLIENT_VER, pwa_studio_client_ver_number)
        }
        //save to storeview + currency to local storage
        if (data.simiStoreConfig && data.simiStoreConfig.config_json && (typeof data.simiStoreConfig.config_json) === 'string') {
            const simi_config = JSON.parse(data.simiStoreConfig.config_json)
            if (simi_config && simi_config.storeview) {
                data.simiStoreConfig.config = simi_config.storeview
                if (simi_config.storeview && simi_config.storeview.base && simi_config.storeview.base.customer_identity)
                    this.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID, simi_config.storeview.base.customer_identity)
            }
        }
        //save store config to session storage
        this.storeDataToStoreage(Identify.SESSION_STOREAGE, Constants.STORE_CONFIG, data)
    }
    static getStoreConfig() {
        return this.getDataFromStoreage(this.SESSION_STOREAGE, Constants.STORE_CONFIG);
    }

    /*
    Dashboard config handlers
    */
    static getAppDashboardConfigs() {
        let data = this.getDataFromStoreage(this.SESSION_STOREAGE, Constants.DASHBOARD_CONFIG);
        if (data === null) {
            data = window.DASHBOARD_CONFIG;
            if (data)
                this.storeDataToStoreage(this.SESSION_STOREAGE, Constants.DASHBOARD_CONFIG, data);
        }
        return data;
    }
    /*
    App Settings
    */
    static getAppSettings() {
        return this.getDataFromStoreage(this.LOCAL_STOREAGE, Constants.APP_SETTINGS);
    }

    static storeAppSettings(data) {
        return this.storeDataToStoreage(this.LOCAL_STOREAGE, Constants.APP_SETTINGS, data)
    }


    /*
    store/get data from storage
    */
    static storeDataToStoreage(type, key, data) {
        if (typeof(Storage) !== "undefined") {
            if (!key)
                return;
            //process data
            const pathConfig = key.split('/');
            let rootConfig = key;
            if (pathConfig.length === 1) {
                rootConfig = pathConfig[0];
            }
            //save to storegae
            data = JSON.stringify(data);
            if (type === this.SESSION_STOREAGE) {
                sessionStorage.setItem(rootConfig, data);
                return;
            }

            if (type === this.LOCAL_STOREAGE) {
                localStorage.setItem(rootConfig, data);
                return;
            }
        }
        console.log('This Browser dont supported storeage');
    }
    static getDataFromStoreage(type, key) {
        if (typeof(Storage) !== "undefined") {
            let value = "";
            let data = '';
            if (type === this.SESSION_STOREAGE) {
                value = sessionStorage.getItem(key);
            }
            if (type === this.LOCAL_STOREAGE) {
                value = localStorage.getItem(key);
            }
            try {
                data = JSON.parse(value) || null;
            } catch (err) {
                data = value;
            }
            return data
        }
        console.log('This browser does not support local storage');
    }

    static ApiDataStorage(key='',type='get',data={}){
        let api_data = this.getDataFromStoreage(this.SESSION_STOREAGE,key);
        if(type === 'get'){
            return api_data
        }else if(type === 'update' && data){
            api_data = api_data ? api_data : {};
            api_data = {...api_data,...data}
            this.storeDataToStoreage(this.SESSION_STOREAGE,key,api_data)
        }
    }

    /*
    Version control
    */
    //version control
    static detectPlatforms() {
        if (navigator.userAgent.match(/iPad|iPhone|iPod/)) {
            return 1;
        } else if (navigator.userAgent.match(/Android/)) {
            return 2;
        } else {
            return 3;
        }
    }

    static validateEmail(email) {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    }

    static PadWithZeroes(number, length) {

        let my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }

        return my_string;
    }

    static formatAddress(address = {}, countries = []) {
        const country = countries.find(({ id }) => id === address.country_id);

        const { available_regions: regions } = country;
        if (!country.available_regions) {
            return address
        } else {
            let region = {};
            if (address.hasOwnProperty('region_code')) {
                const { region_code } = address;
                region = regions.find(({ code }) => code === region_code);
            } else if (address.hasOwnProperty('region') && !isObjectEmpty(address.region)) {
                const region_list = address.region;
                const { region_code } = region_list;
                if (region_code) {
                    region = regions.find(({ code }) => code === region_code);
                } else {
                    region = { region: "Mississippi", region_code: "MS", region_id: 35 };
                }
            } else {
                //fake region to accept current shipping address
                region = { region: "Mississippi", region_code: "MS", region_id: 35 };
            }

            return {
                ...address,
                country_id: address.country_id,
                region_id: parseInt(region.id, 10),
                region_code: region.code,
                region: region.name
            }
        }
        /* let region = {};
        if (regions) {
            region = regions.find(({ code }) => code === region_code);
        } else {
            //fake region to accept current shipping address
            region = { region: "Mississippi", region_code: "MS", region_id: 35 };
        }

        return {
            ...address,
            country_id: address.country_id,
            region_id: parseInt(region.id, 10),
            region_code: region.code,
            region: region.name
        }; */
    }
}

export default Identify;
