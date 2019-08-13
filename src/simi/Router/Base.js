import React from 'react'
import Identify from "src/simi/Helper/Identify"
import { Switch, Route } from 'react-router-dom';
import {PbPageHoc} from 'src/simi/BaseComponents/Pbpage';
import {smoothScrollToView} from "src/simi/Helper/Behavior";

class Abstract extends React.Component{
    render(){
        const simicartConfig = Identify.getAppDashboardConfigs() !== null ? Identify.getAppDashboardConfigs()
            : Identify.getAppDashboardConfigsFromLocalFile();
        const merchantConfig = Identify.getStoreConfig();
        if(simicartConfig
            && merchantConfig
            && merchantConfig.simiStoreConfig)
        {
            //add rtl
            this.renderRTL(merchantConfig.simiStoreConfig)
        }
        smoothScrollToView($('#root'))
        return (
            this.renderLayout()
        )
    }

    renderLayout = ()=>{
        return null;
    }

    /**
    * Page builder routes
    * @returns array
    */
    renderPbRoute = () => {
        const pbRoutes = []
        const simicartConfig = Identify.getAppDashboardConfigs() !== null ? Identify.getAppDashboardConfigs()
        : Identify.getAppDashboardConfigsFromLocalFile();
        if (simicartConfig) {
            const config = simicartConfig['app-configs'][0];
            if (
                config.api_version &&
                parseInt(config.api_version, 10) &&
                config.themeitems &&
                config.themeitems.pb_pages &&
                config.themeitems.pb_pages.length
                ) {
                const merchantConfigs = Identify.getStoreConfig();
                if (merchantConfigs &&
                    merchantConfigs.storeConfig &&
                    merchantConfigs.storeConfig.id) {
                    const storeId = merchantConfigs.storeConfig.id
                    config.themeitems.pb_pages.forEach(element => {
                        if (
                            element.url_path &&
                            element.url_path !== '/' &&
                            element.storeview_visibility &&
                            (element.storeview_visibility.split(',').indexOf(storeId.toString()) !== -1)
                        ){
                            const routeToAdd = {
                                path : element.url_path,
                                render: (props) => <PbPageHoc {...props} pb_page_id={element.entity_id}/>
                            }
                            pbRoutes.push(<Route key={`pb_page_${element.entity_id}`} exact {...routeToAdd}/>)
                        }
                    });
                }
            }
        }
        return pbRoutes
    }

    renderRoute =(router = null)=>{
        if(!router) return <div></div>
        return (
            <Switch>
                <Route exact {...router.home}/>
                <Route exact {...router.search_page}/>
                <Route exact {...router.register}/>
                <Route exact {...router.cart}/>
                <Route exact {...router.product_detail}/>
                <Route exact {...router.checkout}/>
                <Route exact {...router.thankyou}/>
                <Route exact {...router.account}/>
                <Route exact {...router.address_book}/>
                <Route exact {...router.oder_history}/>
                <Route exact {...router.order_history_detail}/>
                <Route exact {...router.newsletter}/>
                <Route exact {...router.profile}/>
                <Route exact {...router.wishlist}/>
                <Route exact {...router.login}/>
                <Route exact {...router.logout}/>
                <Route exact {...router.contact}/>
                {this.renderPbRoute()}
                <Route {...router.noMatch}/>
            </Switch>
        )
    }


    renderRTL = (simiStoreConfig)=>{
        //add rtl
        if (simiStoreConfig.store && parseInt(simiStoreConfig.store.base.is_rtl, 10) === 1) {
            console.log('Is RTL');
        } else {
            try {
                document.getElementById("rtl-stylesheet").remove();
            }
            catch (err) {

            }
        }
    }
}

export default Abstract
