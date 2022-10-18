import React from 'react';
import { useProductAlertPage } from './useProductAlertPage';
import { AlertTable } from './AlertTable';
import { useGlobalLoading } from './Loading/useGlobalLoading';
import LeftMenu from '../../core/LeftMenu';
import defaultClasses from './productAlertPage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { useIntl } from 'react-intl';

const ProductAlertPage = props => {
    const { Component: LoadingComponent, setLoading } = useGlobalLoading();
    const { formatMessage } = useIntl();

    const {
        customerData,
        reInitialize,
        shouldShowStockTable,
        shouldShowPriceTable,
        loading
    } = useProductAlertPage({
        setLoading: setLoading
    });
    const classes = useStyle(defaultClasses);
    const isMobileSite = window.innerWidth <= 768;

    const stockData = customerData
        ? customerData.customer.mp_product_alert.out_of_stock
        : null;
    const priceData = customerData
        ? customerData.customer.mp_product_alert.product_price
        : null;

    if (isMobileSite) {
        return (
            <div>
                <LoadingComponent />

                {!shouldShowPriceTable && !shouldShowStockTable && !loading && (
                    <div
                        style={{
                            marginTop: 25
                        }}
                    >
                        <h3>
                            {formatMessage({
                                id: 'You currently have no subscription.',
                                defaultMessage:
                                    'You currently have no subscription.'
                            })}
                        </h3>
                    </div>
                )}
                {shouldShowStockTable && (
                    <div
                        style={{
                            marginTop: 40,
                            marginBottom: 60
                        }}
                    >
                        <AlertTable
                            title={formatMessage({
                                id: 'Alert for Stock Change'
                            })}
                            data={stockData}
                            reInitialize={reInitialize}
                            setLoading={setLoading}
                            isMobileSite={isMobileSite}
                        />
                    </div>
                )}

                {shouldShowPriceTable && (
                    <div
                        style={{
                            marginTop: 20,
                            marginBottom: 20
                        }}
                    >
                        <AlertTable
                            title={formatMessage({
                                id: 'Alert for Price Change'
                            })}
                            data={priceData}
                            reInitialize={reInitialize}
                            setLoading={setLoading}
                            isMobileSite={isMobileSite}
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`${classes.productAlert} container`}>
            <div className={classes.wrapper}>
                <LeftMenu label="Product Alert" />
                <div className={classes.mainContent}>
                    <LoadingComponent />
                    <div>
                        <h2
                            style={{
                                fontSize: 30
                            }}
                        >
                            {formatMessage({
                                id: 'My Product Alerts',
                                defaultMessage: 'My Product Alerts'
                            })}
                        </h2>
                    </div>

                    {!shouldShowPriceTable &&
                        !shouldShowStockTable &&
                        !loading && (
                            <div
                                style={{
                                    marginTop: 25
                                }}
                            >
                                <h3>
                                    {' '}
                                    {formatMessage({
                                        id:
                                            'You currently have no subscription.',
                                        defaultMessage:
                                            'You currently have no subscription.'
                                    })}
                                </h3>
                            </div>
                        )}

                    {shouldShowStockTable && (
                        <div
                            style={{
                                marginTop: 40,
                                marginBottom: 60
                            }}
                        >
                            <AlertTable
                                title={formatMessage({
                                    id: 'Alert for Stock Change'
                                })}
                                data={stockData}
                                reInitialize={reInitialize}
                                setLoading={setLoading}
                            />
                        </div>
                    )}

                    {shouldShowPriceTable && (
                        <div
                            style={{
                                marginTop: 20,
                                marginBottom: 20
                            }}
                        >
                            <AlertTable
                                title={formatMessage({
                                    id: 'Alert for Price Change'
                                })}
                                data={priceData}
                                reInitialize={reInitialize}
                                setLoading={setLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductAlertPage;
