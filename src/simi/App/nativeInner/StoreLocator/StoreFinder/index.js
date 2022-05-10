import React, {useEffect} from 'react';
import {useStoreLocatorConfig} from "../talons/useStoreLocatorConfig";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@magento/venia-ui/lib/components/Breadcrumbs/breadcrumbs.module.css";
import {useGlobalLoading} from "../talons/useGlobalLoading";
import {ManualStoreLocatorBreadcrumb} from "./ManualBreadcrumb/breadcrumb";
import HeaderBlock from "./StoreFinderHeader";
import BodyContent from "./StoreFindeBody";


const StoreFinder = (props) => {
        const classes = mergeClasses(defaultClasses, props.classes);
        const {loading, config} = useStoreLocatorConfig()

        const {
            upload_head_image, title, description,
            upload_head_icon,
        } = config || {}


        const {Component: LoadingComponent, setLoading} = useGlobalLoading({
            initialValue: true
        })

        const bread = <ManualStoreLocatorBreadcrumb {...props}/>

        useEffect(() => {
            if (!(loading || !config)) {
                setLoading(false)
            }
        }, [loading, config])


        if (loading || !config) {
            return (
                <div>

                </div>
            )
        }
        const headerBlock = (
            <HeaderBlock
                upload_head_image={upload_head_image}
                title={title}
                description={description}
                upload_head_icon={upload_head_icon}
            />
        )

        return (
            <>
                <LoadingComponent/>
                {bread}
                <div style={{
                    marginBottom: 20,
                    marginTop: 20,
                    marginRight: 40,
                    marginLeft: 40
                }}>
                    {headerBlock}
                    <BodyContent config={config}
                                 loading={loading}
                                 classes={classes}
                    />
                </div>
            </>
        );
    }
;

export default StoreFinder;