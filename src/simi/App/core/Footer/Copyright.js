import React from 'react';
import Identify from "src/simi/Helper/Identify";

const Copyright = props => {
    const { classes } = props;
    const copyright = `${new Date().getFullYear()} ${Identify.__('Simicart')}`;
    const storeConfig = Identify.getStoreConfig();
    let footer_link = null;
    let footer_title1 = null;
    let footer_title2 = null;
    if (storeConfig && storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.catalog &&
        storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.footer_link) {
        footer_link = storeConfig.simiStoreConfig.config.catalog.frontend.footer_link
    }
    if (storeConfig && storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.catalog &&
        storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.footer_link) {
        footer_title1 = storeConfig.simiStoreConfig.config.catalog.frontend.footer_title1
    }
    if (storeConfig && storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.catalog &&
        storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.footer_link) {
        footer_title2 = storeConfig.simiStoreConfig.config.catalog.frontend.footer_title2
    }

    return (
        <div className={classes["app-copyright"]}>
            <div className="container">
                <div className={`${classes['pd-tb-15']}`} style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <div className={`col-xs-6 ${classes["app--flex"]}`} style={{ frontSize: '13px' }}>
                        <span>
                            &copy; {copyright}
                        </span>
                    </div>
                    <div
                        className="col-xs-6 text-right"
                        style={{ fontSize: "13px" }}
                    >
                        {Identify.__(footer_title1 ? footer_title1 : "eCommerce by ")}
                        <a target='blank' href={footer_link ? footer_link : '#'} style={{ color: "#FC565A" }}>
                            {Identify.__(footer_title2 ? footer_title2 : "Simicart")}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Copyright;