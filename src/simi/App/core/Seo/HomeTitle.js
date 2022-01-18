import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import {Helmet} from "react-helmet";

/* 
props: {
}
*/
// Website
const HomeTitle = (props) => {
    const {storeConfig} = Identify.getStoreConfig() || {}

    const {default_title, default_description, default_keywords} = storeConfig || {}

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