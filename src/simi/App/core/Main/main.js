import React, { useEffect } from 'react';

import Footer from '../Footer';
import Header from 'src/simi/App/core/Header';
import Identify from 'src/simi/Helper/Identify';
import Connection from 'src/simi/Network/SimiConnection';
import LoadingComponent from 'src/simi/BaseComponents/Loading';
import resolveUrl from 'src/simi/queries/urlResolver.graphql';
import classes from './main.css';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import GET_HOME_DATA from 'src/simi/queries/homeData';
import { getDataFromUrl } from 'src/simi/Helper/Url';

const Main = props => {
    const { storeConfig } = props;
    let pathName = window.location.pathname;
    let isHome;
    if (pathName && pathName.length > 1) {
        //
    } else {
        if (pathName === '/' || pathName === '') isHome = true;
        pathName = false;
    }

    useEffect(() => {
        const dbConfig = Identify.getAppDashboardConfigs();
        if (!dbConfig) {
            Connection.connectSimiCartServer('GET', true, this);
        }
    }, []);

    const urlDataFromDict = getDataFromUrl(pathName);
    const { data: urlResolveData } = useQuery(resolveUrl, {
        variables: {
            urlKey: pathName
        },
        skip: !pathName || (urlDataFromDict && urlDataFromDict.id)
    });

    const { data: homeData } = useQuery(GET_HOME_DATA, {
        skip: !isHome
    });

    if (
        pathName &&
        !urlResolveData &&
        (!urlDataFromDict || !urlDataFromDict.id)
    )
        return '';
    if (isHome && !homeData) return '';
    if (!storeConfig) return '';

    try {
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) splashScreen.style.display = 'none';
    } catch (err) {
        console.warn('no splash screen found');
    }

    return (
        <main className={classes.root}>
            <div
                className="app-loading"
                style={{ display: 'none' }}
                id="app-loading"
            >
                <LoadingComponent />
            </div>
            {storeConfig &&
            storeConfig.simiStoreConfig &&
            storeConfig.simiStoreConfig.config &&
            storeConfig.simiStoreConfig.config.base &&
            storeConfig.simiStoreConfig.config.base.default_title
                ? TitleHelper.renderMetaHeader({
                      title:
                          storeConfig.simiStoreConfig.config.base.default_title,
                      desc:
                          storeConfig.simiStoreConfig.config.base
                              .default_description,
                      meta_other: [
                          <meta
                              name="keywords"
                              content={
                                  storeConfig.simiStoreConfig.config.base
                                      .default_keywords
                              }
                              key="keywords"
                          />
                      ]
                  })
                : ''}
            <Header storeConfig={storeConfig} />
            <div id="data-breadcrumb" className={classes.breadcrumb} />
            <div id="siminia-main-page">{props.children}</div>
            <Footer />
        </main>
    );
};

export default Main;
