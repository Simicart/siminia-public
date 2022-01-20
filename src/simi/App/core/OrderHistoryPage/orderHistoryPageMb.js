import React, { useMemo, useEffect } from 'react';
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

    const currentPage = 1;
    const talonProps = useOrderHistoryPage(currentPage);
    const {
        loadMoreOrders,

        isBackgroundLoading,
        isLoadingWithoutData,
        orders
    } = talonProps;

    const loadMoreButton = loadMoreOrders ? (
        <Button
            disabled={isBackgroundLoading || isLoadingWithoutData}
            onClick={loadMoreOrders}
            priority="low"
        >
            <FormattedMessage
                id={'orderHistoryPage.loadMore'}
                defaultMessage={'Load More'}
            />
        </Button>
    ) : null;

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
                    <div key={index} className={classes.orderItem}>
                        <div className={classes.orderItemHead}>
                            <span>#{item.number}</span>
                            <span>
                                {forMatCurrentValue(
                                    item.items[0].product_sale_price.currency
                                )}
                                {item.items[0].product_sale_price.value}
                            </span>
                        </div>
                        <div className={classes.shipTo}>
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
                        <div className={classes.viewOrder}>
                            <Link to={`/order-history/${item.number}`}>
                                <button>View order</button>
                            </Link>
                        </div>
                        <div className={classes.status}>{item.status}</div>
                    </div>
                );
            });
            return html;
        }
        return null;
    };

    console.log('orderrr', orders);
    return (
        <>
            <div className={classes.mbHeading}>
                {formatMessage({
                    id: 'My orders',
                    defaultMessage: 'My orders'
                })}
            </div>
            <div className={classes.mobileRoot}>
                {renderOrderList(orders)}
                {loadMoreButton}
            </div>
        </>
    );
};
export default OrderHistoryPageMb;
