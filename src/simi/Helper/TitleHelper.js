import React from 'react';
import {Helmet} from "react-helmet";

class TitleHelper {
    static renderMetaHeader = (props = {title:null,desc:null,meta_other:[]})=>{
        let meta = null;
        if(props.meta_other){
            if(props.meta_other instanceof Array && props.meta_other.length > 0){
                meta = props.meta_other.map(item=>{
                    return item;
                })
            }else {
                meta = props.meta_other
            }
        }
        return (
            <Helmet>
                {props.title && (
                    <title>{props.title}</title>
                )}
                {props.desc && (
                    <meta name="description" content={props.desc} />
                )}
                {meta}
            </Helmet>
        )
    }
}

export default TitleHelper