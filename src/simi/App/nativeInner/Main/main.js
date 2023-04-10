import React, { Fragment, useEffect } from 'react';

//abs import Header
import HeaderAbs from '../../../../abenson-cart/components/Header'
import HeaderAbsNative from '../../../../abenson-cart/components/HeaderNative';
//abs import Footer
import FooterAbs from '../../../../abenson-cart/components/Footer'
import FooterAbsNative from '../../../../abenson-cart/components/FooterNative';

import Header from '../Header';
import FooterNative from '../FooterNative';
import Footer from '../Footer';
import LoadingComponent from 'src/simi/BaseComponents/Loading';
import classes from './main.module.css';
import { Meta } from '@magento/venia-ui/lib/components/Head';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import RsHome from '../../core/Seo/Markup/RsHome';
import RsHomeBasic from '../../core/SeoBasic/Markup/RsHome';
const storage = new BrowserPersistence();
import { Helmet } from 'react-helmet';
import RsSeller from '../../core/Seo/Markup/RsSeller';
import { useWindowSize } from '@magento/peregrine';

//abs check location
import { useLocation } from 'react-router-dom';

const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

const Main = props => {
    const { storeConfig } = props;
    const storeCode = storage.getItem('store_view_code') || null;
    const windowSize = useWindowSize();

    //get location
    const location = useLocation()

    const isPhone = windowSize.innerWidth < 500;
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

    let links = [];
    if (url) {
        links = [
            <link key={1} rel={'icon'} type="image/png" href={url} />,
            <link
                key={2}
                rel={'apple-touch-icon'}
                type="image/png"
                href={url}
            />,
            <link key={3} rel={'mask-icon'} type="image/png" href={url} />
        ];
    } else {
        links = [
            <link
                key={1}
                rel="icon"
                type="image/x-icon"
                href="/static/icons/siminia_square_512.png"
            />,
            <link
                key={2}
                rel="apple-touch-icon"
                href="/static/icons/siminia_square_512.png"
            />,
            <link
                key={3}
                rel="apple-touch-icon"
                sizes="180x180"
                href="/static/icons/apple-touch-icon.png"
            />
        ];
    }

    try {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) splashScreen.style.display = 'none';
    } catch (err) {
        console.warn('no splash screen found');
    }
    return (
        <React.Fragment>
            {storeConfig &&
            storeConfig['storeConfig'] &&
            storeConfig['storeConfig'].default_title ? (
                <Meta
                    name="title"
                    content={storeConfig['storeConfig'].default_title}
                />
            ) : (
                ''
            )}
            {storeConfig &&
            storeConfig['storeConfig'] &&
            storeConfig['storeConfig'].default_description ? (
                <Meta
                    name="description"
                    content={storeConfig['storeConfig'].default_description}
                />
            ) : (
                ''
            )}
            {mageworxSeoEnabled ? (
                <RsHome type="home" />
            ) : (
                <RsHomeBasic type="home" />
            )}
            {mageworxSeoEnabled ? <RsSeller type="home" /> : ''}
            <Helmet>{links}</Helmet>
            {/* <StoreTitle /> comment out due to requesting extra query */}
            <main
                // style={{ backgroundColor: configColor.app_background }}
                className={classes.root}
            >
                <div
                    className="app-loading"
                    style={{ display: 'none' }}
                    id="app-loading"
                >
                    <LoadingComponent />
                </div>

                {/*check location*/}

                {location.pathname === '/cart' && isPhone && (<HeaderAbsNative></HeaderAbsNative>)}
                {location.pathname === '/cart' && !isPhone && (<HeaderAbs></HeaderAbs>)}
                {location.pathname !== '/cart' && (<Header storeConfig={storeConfig} />)}

                <div id="data-breadcrumb" className={classes.breadcrumb} />
                <div id="siminia-main-page" style={location.pathname==='/cart' && !isPhone ? {
                    position: 'relative',
                    backgroundColor: '#f1f1f1',
                    width: '100%',
                    height: '100%',
                    minHeight: '100vh',
                    padding: '80px 0'
                } : {}}>{props.children}</div>
                
                {/*<FooterNative />*/}

                {/*check location*/}

                {location.pathname === '/cart' && isPhone && (<FooterAbsNative></FooterAbsNative>)}
                {location.pathname === '/cart' && !isPhone && (<FooterAbs></FooterAbs>)}
                {location.pathname !== '/cart' && (<Footer/>)}

            </main>
        </React.Fragment>
    );
};

export default Main;
