import React, { useEffect } from 'react';

import Footer from '../Footer';
import Header from '../Header';
import LoadingComponent from 'src/simi/BaseComponents/Loading';
import classes from './main.module.css';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import LzL from 'src/simi/BaseComponents/LazyLoad';
import RsHome from '../Seo/Markup/RsHome';
import RsHomeBasic from '../SeoBasic/Markup/RsHome';
const storage = new BrowserPersistence();
import { Helmet } from 'react-helmet';
import RsSeller from '../Seo/Markup/RsSeller';

const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

const Main = props => {
    const { storeConfig } = props;
    const storeCode = storage.getItem('store_view_code') || null;

    const faviconUrl = storeConfig
        ? storeConfig['storeConfig']['head_shortcut_icon']
        : null;
    const baseUrl = storeConfig
        ? storeConfig['storeConfig']['base_media_url']
        : null;
    const url =
        faviconUrl && baseUrl
            ? new URL('./favicon/' + faviconUrl, baseUrl).href
            : null;

    // useEffect(() => {
    //     const dbConfig = Identify.getAppDashboardConfigs();
    //     if (!dbConfig) {
    //         Connection.connectSimiCartServer('GET', true, this);
    //     }
    // }, []);

    //wont render if chose storeview before to avoid rtl issue
    if (!storeConfig && storeCode) return '';

    try {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) splashScreen.style.display = 'none';
    } catch (err) {
        console.warn('no splash screen found');
    }
    return (
        <React.Fragment>
            {mageworxSeoEnabled ? (
                <RsHome type="home" />
            ) : (
                <RsHomeBasic type="home" />
            )}
            {mageworxSeoEnabled ? <RsSeller type="home" /> : ''}
            <Helmet>
                {!!url && <link rel={'icon'} type="image/png" href={url} />}
            </Helmet>
            {/* <StoreTitle /> comment out due to requesting extra query */}
            <main className={classes.root}>
                <div
                    className="app-loading"
                    style={{ display: 'none' }}
                    id="app-loading"
                >
                    <LoadingComponent />
                </div>
                <Header storeConfig={storeConfig} />

                <div id="data-breadcrumb" className={classes.breadcrumb} />
                <div id="siminia-main-page">{props.children}</div>
                <LzL>
                    <Footer />
                </LzL>
            </main>
        </React.Fragment>
    );
};

export default Main;
