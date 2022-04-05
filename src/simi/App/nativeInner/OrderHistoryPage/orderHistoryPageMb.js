import React, { useMemo, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import defaultClasses from './orderHistoryPageMb.module.scss';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from 'react-router-dom';
import { useOrderHistoryPage } from '../../../talons/OrderHistory/useOrderHistoryPage';
import Button from '@magento/venia-ui/lib/components/Button';
import Loader from '../Loader';
const OrderHistoryPageMb = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [status, setStatus] = useState('All');
    const [ordersFilter, setOrdersFilter] = useState([]);
    const { statusId } = props;
    const currentPage = 1;
    const talonProps = useOrderHistoryPage(currentPage);
    const {
        loadMoreOrders,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        total_count
    } = talonProps;

    useEffect(() => {
        if (statusId === 'Pending') setStatus('Pending');
        if (statusId === 'Complete') setStatus('Complete');
        if (statusId === 'Canceled') setStatus('Canceled');
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (orders.length < total_count) {
                if (
                    window.innerHeight + document.documentElement.scrollTop ===
                    document.documentElement.offsetHeight
                ) {
                    loadMoreOrders();
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [orders, total_count, loadMoreOrders]);

    useEffect(() => {
        let handleFilterOrders = orders.filter(order => {
            if (status === 'All') {
                return orders;
            } else return order.status === status;
        });
        setOrdersFilter(handleFilterOrders);
    }, [status, orders]);

    const loadMoreButton = loadMoreOrders ? (
        <button className={classes.loadMoreBtn}>
            <FormattedMessage
                id={'orderHistoryPage.loadMore'}
                defaultMessage={'Load More'}
            />
        </button>
    ) : null;

    const listStatusBtn = ['All', 'Pending', 'Complete', 'Canceled'];

    const renderStatusBtn = listStatusBtn => {
        let html = null;
        html = listStatusBtn.map((s, index) => {
            const left = 16 + 102 * index;
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
                    {s === status ? (
                        <div
                            style={{ left: left }}
                            className={classes.activeIcon}
                        />
                    ) : null}
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
                            <div className={classes.total}>
                                <span>Order Total: </span>
                                {forMatCurrentValue(
                                    item.items[0].product_sale_price.currency
                                )}
                                {item.total.grand_total.value}
                            </div>
                            <div className={classes.status}>
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
            {isBackgroundLoading || isLoadingWithoutData ? <Loader /> : null}
            <div className={classes.statusBtnContainer}>
                {renderStatusBtn(listStatusBtn)}
            </div>
            <div className={classes.mobileRoot}>
                {renderOrderList(ordersFilter)}
                {status === 'All' ? loadMoreButton : null}
                {ordersFilter.length === 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <img
                            src={require('./noOrder.png')}
                            alt="no order"
                            style={{ marginBottom: 15, marginTop: 70 }}
                        />
                        <p>There is no order with this status</p>
                    </div>
                ) : null}
            </div>
        </>
    );
};
export default OrderHistoryPageMb;
