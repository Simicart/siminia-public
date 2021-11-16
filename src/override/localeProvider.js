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
    const { data } = useQuery(GET_LOCALE, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

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
                    console.error(
                        `Unable to load translation file. \n${error}`
                    );
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
            if (
                storeConfig.categories &&
                storeConfig.categories.items &&
                storeConfig.categories.items[0]
            )
                saveCategoriesToDict(storeConfig.categories.items[0]);
            props.setStoreConfig(data);
            if (
                storeConfig.simiStoreConfig &&
                storeConfig.simiStoreConfig.config &&
                parseInt(storeConfig.simiStoreConfig.config.base.is_rtl, 10) ===
                    1
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

    return (
        <IntlProvider
            key={language}
            {...props}
            defaultLocale={DEFAULT_LOCALE}
            locale={language}
            messages={messages}
            onError={handleIntlError}
        />
    );
};

const mapDispatchToProps = { setStoreConfig };

export default connect(
    null,
    mapDispatchToProps
)(LocaleProvider);
