import React, { Component } from 'react';
import { bool } from 'prop-types';

import Footer from '../Footer';
import Header from 'src/simi/BaseComponents/Header'
import Identify from 'src/simi/Helper/Identify'
import {saveCategoriesToDict} from 'src/simi/Helper/Url'
import Connection from 'src/simi/Network/SimiConnection'
import LoadingComponent  from 'src/simi/BaseComponents/Loading'
import * as Constants from 'src/simi/Config/Constants';
import simiStoreConfigDataQuery from 'src/simi/queries/getStoreConfigData.graphql'
import { Simiquery } from 'src/simi/Network/Query'
import classes from './main.css';

class Main extends Component {

    componentDidMount() {
        const dbConfig = Identify.getAppDashboardConfigs()
        if (!dbConfig) {
            Connection.connectSimiCartServer('GET', true, this);
        }
    }

    static propTypes = {
        isMasked: bool
    };

    get classes() {
        const { classes } = this.props;

        return ['page', 'root'].reduce(
            (acc, val) => ({ ...acc, [val]: classes[`${val}`] }),
            {}
        );
    }

    mainContent(storeConfig = null) {
        return (
            <React.Fragment>
                <Header storeConfig={storeConfig}/>
                <div id="data-breadcrumb"/>
                {storeConfig ? <div className={classes.page} id="siminia-main-page">{this.props.children}</div> : <LoadingComponent />}
                <Footer />
            </React.Fragment>
        )
    }
    render() {
        return (
            <main className={classes.root}>
                <div className="app-loading" style={{display:'none'}} id="app-loading">
                    <LoadingComponent/>
                </div>
                { Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, Constants.STORE_CONFIG) ?
                    this.mainContent(Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, Constants.STORE_CONFIG)) :
                    <Simiquery query={simiStoreConfigDataQuery}>
                        {({ data }) => {
                            if (data && data.storeConfig) {
                                Identify.saveStoreConfig(data)
                                saveCategoriesToDict(data.simiRootCate)
                                return this.mainContent(data)
                            }
                            return this.mainContent()
                        }}
                    </Simiquery>
                }
            </main>
        );
    }
}

export default Main;
