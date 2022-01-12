import React, { useEffect, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import {
    fromReactIntl,
    toReactIntl
} from '@magento/venia-ui/lib/util/formatLocale';
import { gql, useQuery } from '@apollo/client';
import GET_LOCALE from 'src/simi/queries/getStoreConfigData.graphql';

import { setStoreConfig } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify';
import { saveCategoriesToDict } from 'src/simi/Helper/Url';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

// const GET_LOCALE = gql`
//     query getLocaleNew {
//         storeConfig {
//             id
//             locale
//             copyright
//         }
//     }
// `;

const LocaleProvider = props => {
    const [messages, setMessages] = useState(null);
    const preloadedData = window.smPreloadedStoreConfig;
    const storeCode = storage.getItem('store_view_code') || null;
    const storeCurrency = storage.getItem('store_view_currency') || null;

    const { data: apiData } = useQuery(GET_LOCALE, {
        fetchPolicy: 'no-cache',
        skip:
            preloadedData && preloadedData.data && !storeCode && !storeCurrency
    });
    const data = apiData
        ? apiData
        : preloadedData && preloadedData.data && !storeCode && !storeCurrency
        ? preloadedData.data
        : null;
    const language = useMemo(() => {
        return data && data.storeConfig.locale
            ? toReactIntl(data.storeConfig.locale)
            : DEFAULT_LOCALE;
    }, [data]);

    /**
     * At build time, `__fetchLocaleData__` is injected as a global. Depending on the environment, this global will be
     * either an ES module with a `default` property, or a plain CJS module.
     *
     * Please see {LocalizationPlugin} at @magento/pwa-buildpack/WebpackTools/plugins/LocalizationPlugin.js
     */
    const fetchLocale =
        'default' in __fetchLocaleData__
            ? __fetchLocaleData__.default
            : __fetchLocaleData__;

    useEffect(() => {
        if (language) {
            const locale = fromReactIntl(language);
            fetchLocale(locale)
                .then(data => {
                    setMessages(data.default);
                })
                .catch(error => {
                    // no need to warning on this
                    // console.error(
                    //     `Unable to load translation file. \n${error}`
                    // );
                });
        }
    }, [fetchLocale, language]);

    const handleIntlError = error => {
        if (messages) {
            if (error.code === 'MISSING_TRANSLATION') {
                console.warn('Missing translation', error.message);
                return;
            }
            throw error;
        }
    };
    useEffect(() => {
        let storeConfig;
        if (data && data.storeConfig && props.setStoreConfig) {
            storeConfig = data;
            Identify.saveStoreConfig(data);

            //if uncomment this - should comment out useDelayedTransition() at src/simi/app.js
            /*
            if (
                storeConfig.categories &&
                storeConfig.categories.items &&
                storeConfig.categories.items[0]
            )
                saveCategoriesToDict(storeConfig.categories.items[0]);
            */
            props.setStoreConfig(data);
            if (
                (storeConfig.simiStoreConfig &&
                    storeConfig.simiStoreConfig.config &&
                    parseInt(
                        storeConfig.simiStoreConfig.config.base.is_rtl,
                        10
                    ) === 1) ||
                language.indexOf('ar') !== -1
            ) {
                try {
                    document.getElementById('root').classList.add('rtl-root');
                    document.body.classList.add('rtl-body');
                } catch (err) {
                    console.warn(err);
                }
            }
        }
    }, [data]);

    let mergedMessage = {};
    if (language) {
        if (messages) {
            mergedMessage = { ...messages };
        }
        const dashboardConfig = Identify.getAppDashboardConfigs();
        const localeFormated = language.replace('-', '_');
        if (
            dashboardConfig &&
            dashboardConfig['app-configs'] &&
            dashboardConfig['app-configs'][0] &&
            dashboardConfig['app-configs'][0]['language'] &&
            dashboardConfig['app-configs'][0]['language'][localeFormated]
        ) {
            const simiDbLConfig =
                dashboardConfig['app-configs'][0]['language'][localeFormated];
            //map venia locale file to translated json from dashboard
            Object.keys(mergedMessage).forEach(key => {
                if (mergedMessage[key] && simiDbLConfig[mergedMessage[key]]) {
                    mergedMessage[key] = simiDbLConfig[mergedMessage[key]];
                }
            });
            mergedMessage = {
                ...mergedMessage,
                ...simiDbLConfig
            };
        }
    }

    return (
        <IntlProvider
            key={language}
            {...props}
            defaultLocale={DEFAULT_LOCALE}
            locale={language}
            messages={mergedMessage}
            onError={handleIntlError}
        />
    );
};

const mapDispatchToProps = { setStoreConfig };

export default connect(
    null,
    mapDispatchToProps
)(LocaleProvider);
