import * as Constants from 'src/simi/Config/Constants';
import CacheHelper from 'src/simi/Helper/CacheHelper';

import { CACHE_PERSIST_PREFIX } from '@magento/peregrine/lib/Apollo/constants';

class Identify {
    static SESSION_STOREAGE = 1;
    static LOCAL_STOREAGE = 2;

    static isRtl() {
        let is_rtl = false;
        const storeConfigs = this.getStoreConfig();

        const configs =
            storeConfigs && Object.prototype.hasOwnProperty.call(storeConfigs,('simiStoreConfig'))
                ? storeConfigs.simiStoreConfig
                : null;

        if (
            configs !== null &&
            configs.config &&
            configs.config.base &&
            configs.config.base.is_rtl
        ) {
            is_rtl = parseInt(configs.config.base.is_rtl, 10) === 1;
        } else if (
            storeConfigs &&
            storeConfigs.storeConfig &&
            storeConfigs.storeConfig.locale.indexOf('ar') !== -1
        )
            is_rtl = true;
        return is_rtl;
    }

    /*
    URL param
    */
    static findGetParameter(parameterName) {
        var result = null;
        var tmp = [];
        var items = location.search.substr(1).split('&');
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split('=');
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        }
        return result;
    }

    /*
    Store config
    */
    static saveStoreConfig(data) {
        //check version
        if (
            data &&
            data.simiStoreConfig &&
            data.simiStoreConfig.pwa_studio_client_ver_number
        ) {
            const { pwa_studio_client_ver_number } = data.simiStoreConfig;
            const curentVer = this.getDataFromStoreage(
                Identify.LOCAL_STOREAGE,
                Constants.CLIENT_VER
            );
            if (curentVer && curentVer !== pwa_studio_client_ver_number) {
                console.log('New version released, updating..');
                CacheHelper.clearCaches();
                window.location.reload();
            }
            this.storeDataToStoreage(
                Identify.LOCAL_STOREAGE,
                Constants.CLIENT_VER,
                pwa_studio_client_ver_number
            );
        }
        //save store config to session storage
        this.storeDataToStoreage(
            Identify.SESSION_STOREAGE,
            Constants.STORE_CONFIG,
            data
        );
    }
    static getStoreConfig() {
        return this.getDataFromStoreage(
            this.SESSION_STOREAGE,
            Constants.STORE_CONFIG
        );
    }

    static clearStoreConfig() {
        localStorage.removeItem('apollo-cache-persist');
        const storeConfig = this.getStoreConfig();
        if (
            storeConfig &&
            storeConfig.storeConfig &&
            storeConfig.storeConfig.code
        ) {
            localStorage.removeItem(
                `${CACHE_PERSIST_PREFIX}-${storeConfig.storeConfig.code}`
            );
        }
        sessionStorage.removeItem('LOCAL_URL_DICT');
        sessionStorage.removeItem(Constants.STORE_CONFIG);
    }
    /*
    Dashboard config handlers
    */
    static getAppDashboardConfigs() {
        let data = this.getDataFromStoreage(
            this.SESSION_STOREAGE,
            Constants.DASHBOARD_CONFIG
        );
        if (data === null) {
            //init dashboard config
            data = window.DASHBOARD_CONFIG;
            if (data) {
                try {
                    let languages = {};
                    if ((languages = data['app-configs'][0]['language'])) {
                        for (const locale in languages) {
                            for (const term in languages[locale]) {
                                languages[locale][term.toLowerCase()] =
                                    languages[locale][term];
                            }
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
                this.storeDataToStoreage(
                    this.SESSION_STOREAGE,
                    Constants.DASHBOARD_CONFIG,
                    data
                );
            }
        }
        return data;
    }

    /*
    store/get data from storage
    */
    static storeDataToStoreage(type, key, data) {
        if (typeof Storage !== 'undefined') {
            if (!key) return;
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
        if (typeof Storage !== 'undefined') {
            let value = '';
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
            return data;
        }
        console.log('This browser does not support local storage');
    }
}

export default Identify;
