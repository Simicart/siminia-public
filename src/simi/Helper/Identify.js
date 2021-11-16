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
        let text = '';
        const possible =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < charCount; i++)
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
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
                const { language } = config;
                const languageWithCode = language[languageCode];
                if (languageWithCode.hasOwnProperty(text)) {
                    return languageWithCode[text];
                } else if (
                    languageWithCode.hasOwnProperty(text.toLowerCase())
                ) {
                    return languageWithCode[text.toLowerCase()];
                }
            }
        } catch (err) {}

        return text;
    }

    static isRtl() {
        let is_rtl = false;
        const storeConfigs = this.getStoreConfig();

        const configs =
            storeConfigs && storeConfigs.hasOwnProperty('simiStoreConfig')
                ? storeConfigs.simiStoreConfig
                : null;

        if (
            configs !== null &&
            configs.config &&
            configs.config.base &&
            configs.config.base.is_rtl
        ) {
            is_rtl = parseInt(configs.config.base.is_rtl, 10) === 1;
        }
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
        sessionStorage.removeItem('LOCAL_URL_DICT');
        sessionStorage.removeItem(Constants.STORE_CONFIG);
    }

    static isEnabledCheckoutAsGuest() {
        const data = this.getStoreConfig();
        if (
            data &&
            data.simiStoreConfig &&
            data.simiStoreConfig.config &&
            data.simiStoreConfig.config.checkout &&
            data.simiStoreConfig.config.checkout.enable_guest_checkout
        ) {
            return !!parseInt(
                data.simiStoreConfig.config.checkout.enable_guest_checkout
            );
        }
        return false;
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

    static ApiDataStorage(key = '', type = 'get', data = {}) {
        let api_data = this.getDataFromStoreage(this.SESSION_STOREAGE, key);
        if (type === 'get') {
            return api_data;
        } else if (type === 'update' && data) {
            api_data = api_data ? api_data : {};
            api_data = { ...api_data, ...data };
            this.storeDataToStoreage(this.SESSION_STOREAGE, key, api_data);
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
        if (!regions || (regions instanceof Array && regions.length < 1)) {
            if (
                address.hasOwnProperty('region') &&
                address.region instanceof Object &&
                Object.keys(address.region).length
            ) {
                const regionUnavailable = address.region;
                const addRtn = { ...address };
                if (regionUnavailable.hasOwnProperty('region_code')) {
                    addRtn.region_code = regionUnavailable.region_code;
                }
                if (regionUnavailable.hasOwnProperty('region_id')) {
                    addRtn.region_id = regionUnavailable.region_id;
                }
                if (regionUnavailable.hasOwnProperty('region')) {
                    addRtn.region = regionUnavailable.region;
                }
                return addRtn;
            }
            return address;
        } else {
            let region = {};
            if (address.hasOwnProperty('region_code')) {
                const { region_code } = address;
                region = regions.find(({ code }) => code === region_code);
            } else if (
                address.hasOwnProperty('region') &&
                !isObjectEmpty(address.region)
            ) {
                const region_list = address.region;
                const { region_code } = region_list;
                if (region_code) {
                    region = regions.find(({ code }) => code === region_code);
                } else {
                    region = {
                        region: 'Mississippi',
                        region_code: 'MS',
                        region_id: 35
                    };
                }
            } else {
                //fake region to accept current shipping address
                region = {
                    region: 'Mississippi',
                    region_code: 'MS',
                    region_id: 35
                };
            }

            return {
                ...address,
                country_id: address.country_id,
                region_id: parseInt(region.id, 10),
                region_code: region.code,
                region: region.name
            };
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

    static formatDate(dateInput) {
        let newDate = new Date(dateInput);
        if (window.navigator && !navigator.userAgent.match(/Android/)) {
            const arr = dateInput.split(/[- :]/);
            newDate = new Date(
                arr[0],
                arr[1] - 1,
                arr[2],
                arr[3],
                arr[4],
                arr[5]
            );
        }
        return newDate;
    }
}

export default Identify;
