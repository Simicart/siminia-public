import React, { useMemo, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import defaultClasses from './orderHistoryPageMb.module.scss';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from 'react-router-dom';
import { useOrderHistoryPage } from '../../../talons/OrderHistory/useOrderHistoryPage';
import Button from '@magento/venia-ui/lib/components/Button';

const OrderHistoryPageMb = props => {
    // const { orders } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [status, setStatus] = useState('All');
    const [ordersFilter, setOrdersFilter] = useState([]);

    const currentPage = 1;
    const talonProps = useOrderHistoryPage(currentPage);
    const {
        loadMoreOrders,

        isBackgroundLoading,
        isLoadingWithoutData,
        orders
    } = talonProps;

    // let handleFilterOrders;
    useEffect(() => {
        let handleFilterOrders = orders.filter(order => {
            if (status === 'All') {
                return orders;
            } else return order.status === status;
        });
        setOrdersFilter(handleFilterOrders);
    }, [status, orders]);

    const loadMoreButton = loadMoreOrders ? (
        <button className={classes.loadMoreBtn} onClick={loadMoreOrders}>
            <FormattedMessage
                id={'orderHistoryPage.loadMore'}
                defaultMessage={'Load More'}
            />
        </button>
    ) : null;

    const listStatusBtn = ['All', 'Pending', 'Completed', 'Canceled'];
   

    const renderStatusBtn = listStatusBtn => {
        let html = null;
        html = listStatusBtn.map((s, index) => {
            const left=16+102*index;
            return (
                <>
                <button
                    onClick={() => setStatus(s)}
                    key={index}
                    className={
                        s === status
                        ? classes.statusBtnActive
                        : classes.statusBtn
                    }
                    >
                    {s}
                </button>
                {s === status ? <div style={{left: left}} className={classes.activeIcon}/> : null}
                </>
            );
        });
        return html;
    };

    const forMatCurrentValue = value => {
        if (value == 'USD') {
            return '$';
        } else return null;
    };
    const renderOrderList = listItem => {
        let html = null;
        if (listItem) {
            html = listItem.map((item, index) => {
                return (
                    <Link to={`/order-history/${item.number}`}>
                    <div key={index} className={classes.orderItem}>
                        <div className={classes.orderItemHead}>
                            <span>Order ID {item.number}</span>
                            {/* <span>
                                {forMatCurrentValue(
                                    item.items[0].product_sale_price.currency
                                )}
                                {item.total.grand_total.value}
                            </span> */}
                        </div>
                        <div className={classes.date}>
                            <span>
                                {formatMessage({
                                    id: 'Data',
                                    defaultMessage: 'Date'
                                })}
                            </span>
                            <span>: {item.order_date}</span>
                        </div>
                        {/* <div className={classes.shipTo}>
                            <span>
                                {formatMessage({
                                    id: 'Ship to',
                                    defaultMessage: 'Ship to'
                                })}
                            </span>
                            <span>
                                : {item.billing_address.firstname}
                                {item.billing_address.lastname}
                            </span>
                        </div> */}

                        {/* <div className={classes.viewOrder}>
                            <Link to={`/order-history/${item.number}`}>
                                <button>View order</button>
                            </Link>
                        </div> */}
                        <div className={classes.total}>
                            <span>Order Total: </span>
                            {forMatCurrentValue(
                                item.items[0].product_sale_price.currency
                            )}
                            {item.total.grand_total.value}
                        </div>
                        <div className={classes.status} >
                            <span>Status: </span>
                            <span>{item.status}</span>
                        </div>
                    </div>
                    </Link>

                );
            });
            return html;
        }
        return null;
    };

    return (
        <>
            {isBackgroundLoading || isLoadingWithoutData ? (
                <div>
                    <div className={classes.loader} />
                    <div className={classes.modalLoader} />
                </div>
            ) : null}
            <div className={classes.statusBtnContainer}>
                {/* {formatMessage({
                    id: 'My orders',
                    defaultMessage: 'My orders'
                })} */}
                {renderStatusBtn(listStatusBtn)}
            </div>
            <div className={classes.mobileRoot}>
                {renderOrderList(ordersFilter)}
                {status === "All" ?loadMoreButton : null}
                {ordersFilter.length === 0 ?
                <p>You have no products on {status}.</p>
                : null}
            </div>
        </>
    );
};
export default OrderHistoryPageMb;
