import React from 'react'
import Product from 'src/simi/App/core/RootComponents/Product'
import Category from 'src/simi/App/core/RootComponents/Category'
import Simicms from 'src/simi/App/core/Simicms'
import resolveUrl from 'src/simi/queries/urlResolver.graphql'
import { simiUseQuery } from 'src/simi/Network/Query';
import Loading from 'src/simi/BaseComponents/Loading'
import Identify from 'src/simi/Helper/Identify'
import Page404 from './Page404'
import { getDataFromUrl } from 'src/simi/Helper/Url';

var parseFromDoc = true
const TYPE_PRODUCT = 'PRODUCT'
const TYPE_CATEGORY = 'CATEGORY'
const TYPE_CMS_PAGE = 'CMS_PAGE'

const NoMatch = props => {
    const {location} = props
    const renderByTypeAndId = (type, id, preloadedData = null) => {
        if (type === TYPE_PRODUCT)
            return <Product {...props} preloadedData={preloadedData}/>
        else if (type === TYPE_CATEGORY)
            return <Category {...props} id={parseInt(id, 10)}/>
    }

    if (
        parseFromDoc &&
        document.body.getAttribute('data-model-type') &&
        document.body.getAttribute('data-model-id') &&
        (document.body.getAttribute('data-model-type') !== TYPE_CMS_PAGE)
    ) {
        parseFromDoc = false
        const type = document.body.getAttribute('data-model-type')
        const id = document.body.getAttribute('data-model-id')
        const result = renderByTypeAndId(type, id)
        if (result)
            return result
    } else if (location && location.pathname) {
        parseFromDoc = false
        const pathname = location.pathname

        //load from dict
        const dataFromDict = getDataFromUrl(pathname)
        if (dataFromDict && dataFromDict.id) {
            let type = TYPE_CATEGORY
            const id = dataFromDict.id
            if (dataFromDict.sku)  {
                type = TYPE_PRODUCT
            }
            const result = renderByTypeAndId(type, id, dataFromDict)
            if (result)
                return result
        }
        //check if simicms
        const simiStoreConfig = Identify.getStoreConfig();
        if (simiStoreConfig && simiStoreConfig.simiStoreConfig &&
            simiStoreConfig.simiStoreConfig.config &&
            simiStoreConfig.simiStoreConfig.config.cms &&
            simiStoreConfig.simiStoreConfig.config.cms.cmspages &&
            simiStoreConfig.simiStoreConfig.config.cms.cmspages.length
            ) {
                let simiCms = null
                simiStoreConfig.simiStoreConfig.config.cms.cmspages.forEach(simicmspage => {
                    if (
                        simicmspage.cms_content && simicmspage.cms_url &&
                        (simicmspage.cms_url === pathname) || (`/${simicmspage.cms_url}` === pathname)
                        )
                        simiCms = simicmspage
                });
                if (simiCms)
                    return <Simicms csmItem={simiCms} />
        }

        //get type from server
        const [queryResult, queryApi] = simiUseQuery(resolveUrl);
        const { data } = queryResult;
        const { runQuery } = queryApi;
        if (!data) {
            runQuery({
                variables: {
                    urlKey: pathname
                }
            });
        }
        if (data) {
            if (data.urlResolver) {
                const result = renderByTypeAndId(data.urlResolver.type, data.urlResolver.id)
                if (result)
                    return result
            }
            return <Page404 />
        }
    }

    parseFromDoc = false
    return (
        <Loading />
    )
}
export default NoMatch