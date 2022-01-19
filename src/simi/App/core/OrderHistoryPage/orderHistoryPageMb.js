import React, { useMemo, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import defaultClasses from './orderHistoryPageMb.module.scss';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useOrderHistoryPage } from './useOrderHistoryPage';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { Link } from 'react-router-dom';


const PAGE_SIZE = 10;

const OrderHistoryPageMb = props => {
    // const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
   
    const talonProps = useOrderHistoryPage();
    const {
        ordersMb,
        loading
    } = talonProps;
 

    const [showMore, setShowMore] = useState(1)
    const [isShowMore, setIsShowMore] = useState(true)
    const [currentOrder, setCurrentOrder] = useState(ordersMb.length > PAGE_SIZE ? ordersMb.slice(0,PAGE_SIZE) : ordersMb)
    
    

   
   
  
   
//    const currentOrder = orders.length > 5 ? orders.slice(0,5) : orders


//    const handleShowMore = () => {
//        if (5*showMore <= ordersMb.length) {
//            setCurrentOrder(ordersMb.slice(0,5*showMore));
//        }
//        else setIsShowMore(false)
//    }

   useEffect(() => {
    
        if (PAGE_SIZE*showMore <= ordersMb.length) {
            setCurrentOrder(ordersMb.slice(0,PAGE_SIZE*showMore));
        }
        else {
            setCurrentOrder(ordersMb);
            setIsShowMore(false);
        }
    
   }, [showMore, ordersMb])

    console.log("showmore", showMore);


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
                    <div className={classes.orderItem}>
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


    if(loading) {
        return <LoadingIndicator />
    }
    return (
        <>
            <div className={classes.mbHeading}>
                {formatMessage({
                    id: 'My orders',
                    defaultMessage: 'My orders'
                })}
            </div>
            <div className={classes.mobileRoot}>
                {renderOrderList(currentOrder)}
                {isShowMore ? 
               <button className={classes.showBtn} onClick={() => setShowMore(showMore+1)}>{formatMessage({
                id: 'Show More',
                defaultMessage: 'Show More'
            })}</button>
            : null}
            </div>
        </>
    );
};
export default OrderHistoryPageMb;
