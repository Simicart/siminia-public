import React from 'react'
import { PbPageHoc } from 'src/simi/BaseComponents/Pbpage'
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import DefaultHome from 'src/simi/App/core/Home'

const Home = props => {
    const jsonSimiCart = Identify.getAppDashboardConfigs();
    const storeConfig = Identify.getStoreConfig();
    let pb_page = null
    if (jsonSimiCart !== null && storeConfig && storeConfig.storeConfig && storeConfig.storeConfig.id) {
        const config = jsonSimiCart['app-configs'][0];
        const storeId = storeConfig.storeConfig.id
        if (
            config.api_version &&
            parseInt(config.api_version) &&
            config.themeitems &&
            config.themeitems.pb_pages &&
            config.themeitems.pb_pages.length
            ) {
            let home_pb_page = null
            config.themeitems.pb_pages.every(element => {
                if (
                    element.visibility &&
                    parseInt(element.visibility, 10) === 2 && 
                    element.storeview_visibility &&
                    (element.storeview_visibility.split(',').indexOf(storeId.toString()) !== -1)
                ){
                    home_pb_page = element
                    return false
                }
                return true
            });
            if (home_pb_page) {
                pb_page = home_pb_page
            }
        }
    }
    // if (pb_page && pb_page.entity_id)
    if(false)
        return (
            <React.Fragment>
                {TitleHelper.renderMetaHeader({
                    title:Identify.__('Home Page')
                })}
                <PbPageHoc pb_page_id={pb_page.entity_id} {...props}/>
            </React.Fragment>
        )
    else return (
        <React.Fragment>
            {TitleHelper.renderMetaHeader({
                title:Identify.__('Home Page')
            })}
            <DefaultHome {...props}/>
        </React.Fragment>

    )
}

export default Home