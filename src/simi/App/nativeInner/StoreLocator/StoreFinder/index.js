import React from 'react'
import {isStoreLocatorEnable} from 'src/simi/App/nativeInner/Helper/Module'
import Page404 from '../../NoMatch/Page404'
import StoreFinderPage from './StoreFinderPage'

const StoreFinder = props => {
    const storeLocatorEnable = isStoreLocatorEnable()
    
    if(storeLocatorEnable) {
        return <StoreFinderPage />
    }

    return <Page404 />
}

export default StoreFinder
