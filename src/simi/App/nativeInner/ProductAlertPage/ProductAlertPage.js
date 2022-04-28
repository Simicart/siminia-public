import React from "react";
import {useProductAlertPage} from "./useProductAlertPage";
import {AlertTable} from "./AlertTable";
import {useGlobalLoading} from "./Loading/useGlobalLoading";

const ProductAlertPage = (props) => {

    const {Component: LoadingComponent, setLoading} = useGlobalLoading()
    const {
        customerData,
        reInitialize,
        shouldShowStockTable,
        shouldShowPriceTable,
        loading
    } = useProductAlertPage({
        setLoading: setLoading
    })

    const stockData = customerData ? customerData.customer.mp_product_alert.out_of_stock : null
    const priceData = customerData ? customerData.customer.mp_product_alert.product_price : null

    
    return (
        <div style={{
            marginTop: 30,
            marginBottom: 30,
            marginLeft: 30,
            marginRight: 30
        }}>
            <LoadingComponent/>
            <div>
                <h2 style={{
                    fontSize: 30,
                }}>My Product Alerts</h2>
            </div>

            {(!shouldShowPriceTable && !shouldShowStockTable && !loading) && (
                <div style={{
                    marginTop: 25
                }}>
                    <h3>You currently have no subscription.</h3>
                </div>
            )}

            {shouldShowStockTable && (
                <div style={{
                    marginTop: 40,
                    marginBottom: 60,
                }}>
                    <AlertTable title={'Alert for Stock Change'}
                                data={stockData}
                                reInitialize={reInitialize}
                                setLoading={setLoading}
                    />
                </div>
            )}

            {shouldShowPriceTable && (
                <div style={{
                    marginTop: 20,
                    marginBottom: 20,
                }}>
                    <AlertTable title={'Alert for Price Change'}
                                data={priceData}
                                reInitialize={reInitialize}
                                setLoading={setLoading}
                    />
                </div>
            )}
        </div>
    )
}

export default ProductAlertPage