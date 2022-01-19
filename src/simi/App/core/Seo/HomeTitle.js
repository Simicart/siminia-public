import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import {Helmet} from "react-helmet";
import { useStoreConfigData } from './talons/useStoreConfigData';

/* 
props: {
}
*/
// Website
const HomeTitle = (props) => {
    const {storeConfigData} = useStoreConfigData();

    const {default_title, default_description, default_keywords} = storeConfigData.storeConfig || {}

    return (
        <>
        {default_title &&
            <Helmet>
                <title>{default_title}</title>
            </Helmet>
        }
        {default_description &&
            <Helmet>
                <meta name="description" content={default_description} />
            </Helmet>
        }
        </>
    )
}

export default HomeTitle;