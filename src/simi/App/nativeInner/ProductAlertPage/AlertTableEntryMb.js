import React from 'react';
import './alertTableEntryMb.css'
import { Link } from 'react-router-dom';
import {useAlertTableEntry} from "./useAlertTableEntry";
import {Trash} from 'react-feather'


const AlertTableEntryMb = (props) => {
    const data = props ? props.data : null;
    const reInitialize = props ? props.reInitialize : null;
    const setLoading = props ? props.setLoading : null;
    const {
        product_id,
        status,
        subscribe_updated_at,
        subscriber_id,
        product_data
    } = data ? data : {}

    const {
        name,
        product_image_url,
        // product_url,
        sku
    } = product_data ? product_data : {}

    console.log("haha", data);
    

    const product_url = `${data.product_data.product_url.slice(34, )}`
    // console.log("haha", pathname);
    const {removeSubscription} = useAlertTableEntry({
        id: subscriber_id,
        reInitialize: reInitialize,
        setLoading: setLoading
    })

    return <div className="alertEntryMb">
        <div className="left-content" >
            <img src={data.product_data.product_image_url} alt="product alert" style={{width: 100}} />
        </div>
        <div className="right-content">
            <Link style={{color: '#0058AC' }} to={product_url}>{data.product_data.name}</Link>
            <div>
                <span>Alert Status: {data.status}</span>
            </div>
            <div style={{marginBottom: 15}}>
                <span>Subscribed On: {data.subscribe_updated_at}</span>
            </div>
            <button className="remove-btn" onClick={removeSubscription}>
                <Trash />
            </button>
        </div>
    </div>;
};
export default AlertTableEntryMb;
