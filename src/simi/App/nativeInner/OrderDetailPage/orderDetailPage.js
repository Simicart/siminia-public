import React, { useMemo, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useQuery, useMutation } from '@apollo/client';

import { useParams } from 'react-router-dom';
import DEFAULT_OPERATIONS from './orderDetailPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useOrderDetailPage } from './useOrderDetailPage';
import defaultClasses from './orderDetailPage.module.scss';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LeftMenu from '../../core/LeftMenu';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { MdLocationPin } from 'react-icons/Md';

const OrderDetailPage = props => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleSize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleSize);
        //clean
        return () => {
            window.removeEventListener('resize', handleSize);
        };
    }, []);

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    // const { getOrderDetail } = operations;
    const { formatMessage } = useIntl();

    const { orderId } = useParams();
    const talonProps = useOrderDetailPage({ orderId });
    const {
        dataDetail,
        loadingDetail,
        errorDetail,
        reorderItemMutation
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const [reorderItem, { data, loading, error }] = useMutation(
        reorderItemMutation
    );

    if (loadingDetail) {
        return fullPageLoadingIndicator;
    }

    if (!dataDetail) {
        console.warn(errorDetail);

        return (
            <span className={classes.dataError}>
                <FormattedMessage
                    id={'productForm.dataError'}
                    defaultMessage={
                        'Something went wrong. Please refresh and try again.'
                    }
                />
            </span>
        );
    }

    if (!dataDetail.customer.orders.items[0]) {
        return (
            <div className={classes.noItem}>
                <h1>You have no item here. </h1>
            </div>
        );
    }
    console.log('testtt', dataDetail);

    const { customer } = dataDetail;
    const listItem = customer.orders.items[0].items;
    const subTotal = customer.orders.items[0].total.subtotal.value;
    const grandTotal = customer.orders.items[0].total.base_grand_total.value;
    const mpRewardPoints = customer.orders.items[0].mp_reward_points;
    console.log(mpRewardPoints);
    const status = customer.orders.items[0].status;
    console.log('dataDetailaa', customer);

    const dateFormat = date => {
        const mystring = date;
        const arrayStrig = mystring.split(' ');
        return arrayStrig[0];
    };
    const timeFormat = date => {
        const mystring = date;
        const arrayStrig = mystring.split(' ');
        return arrayStrig[1];
    };

    // console.log("date",dateFormat(customer.orders.items[0].order_date ));

    const forMatCurrentValue = value => {
        if (value == 'USD') {
            return '$';
        } else return null;
    };

    const renderTRTable = listItem => {
        let html = null;
        if (listItem) {
            html = listItem.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{item.product_name}</td>
                        <td>{item.product_sku}</td>
                        <td>
                            {forMatCurrentValue(
                                item.product_sale_price.currency
                            )}
                            {item.product_sale_price.value}
                        </td>
                        <td>{item.quantity_ordered}</td>
                        <td>
                            {forMatCurrentValue(
                                item.product_sale_price.currency
                            )}
                            {item.quantity_ordered *
                                item.product_sale_price.value}
                        </td>
                    </tr>
                );
            });
        } else return null;
        return html;
    };

    const orderItemMb = listItem => {
        let html = null;
        if (listItem) {
            html = listItem.map((item, index) => {
                return (
                    <div className={classes.orderItemMb}>
                        <div className={classes.orderItemMbHeading}>
                            <span>{item.product_name}</span>
                            <span>
                                {forMatCurrentValue(
                                    item.product_sale_price.currency
                                )}
                                {item.product_sale_price.value}
                            </span>
                        </div>
                        <div>
                            <span>SKU: </span>
                            <span>{item.product_sku}</span>
                        </div>
                        <div>
                            <span>Qty: </span>
                            <span>{item.quantity_ordered}</span>
                        </div>
                        <div>
                            <span>
                                {formatMessage({
                                    id: 'Price',
                                    defaultMessage: 'Price'
                                })}
                                :
                            </span>
                            <span>
                                {' '}
                                {forMatCurrentValue(
                                    item.product_sale_price.currency
                                )}
                                {item.product_sale_price.value}
                            </span>
                        </div>
                    </div>
                );
            });
            return html;
        }
        return null;
    };

    const orderDetailTable = () => {
        let html = null;

        html = (
            <table>
                <thead>
                    <tr>
                        <th>
                            {formatMessage({
                                id: 'Product name',
                                defaultMessage: 'Product name'
                            })}
                        </th>
                        <th>Sku</th>
                        <th>
                            {formatMessage({
                                id: 'Price',
                                defaultMessage: 'Price'
                            })}
                        </th>
                        <th>
                            {formatMessage({
                                id: 'Quantity',
                                defaultMessage: 'Qty'
                            })}
                        </th>
                        <th>
                            {formatMessage({
                                id: 'Subtotal',
                                defaultMessage: 'Subtotal'
                            })}
                        </th>
                    </tr>
                </thead>
                <tbody>{renderTRTable(listItem)}</tbody>
                <tfoot>
                    {mpRewardPoints.earn ? (
                        <tr>
                            <td colSpan={5}>
                                {formatMessage({
                                    id: 'You earned',
                                    defaultMessage: 'You earned'
                                })}
                                : {mpRewardPoints.earn}{' '}
                                {formatMessage({
                                    id: 'points',
                                    defaultMessage: 'points'
                                })}
                            </td>
                        </tr>
                    ) : null}
                    {mpRewardPoints.spent ? (
                        <tr>
                            <td colSpan={5}>
                                {formatMessage({
                                    id: 'You spent',
                                    defaultMessage: 'You spent'
                                })}
                                : {mpRewardPoints.spent}{' '}
                                {formatMessage({
                                    id: 'points',
                                    defaultMessage: 'points'
                                })}
                            </td>
                        </tr>
                    ) : null}
                    <tr>
                        <td colSpan={5}>
                            {formatMessage({
                                id: 'Subtotal',
                                defaultMessage: 'Subtotal'
                            })}
                            :{' '}
                            {forMatCurrentValue(
                                customer.orders.items[0].total.subtotal.currency
                            )}
                            {subTotal}
                        </td>
                        {/* <td colSpan={5}>GRANDTOTAL: {subTotal}</td> */}
                    </tr>
                    {mpRewardPoints.discount ? (
                        <tr>
                            <td colSpan={5}>
                                {formatMessage({
                                    id: 'Discount',
                                    defaultMessage: 'Discount'
                                })}
                                :{' -'}
                                {forMatCurrentValue(
                                    customer.orders.items[0].total.subtotal
                                        .currency
                                )}
                                {mpRewardPoints.discount}
                            </td>
                        </tr>
                    ) : null}
                    <tr>
                        <td colSpan={5}>
                            {formatMessage({
                                id: 'Shipping Fee',
                                defaultMessage: 'Shipping Fee'
                            })}
                            :{' '}
                            {forMatCurrentValue(
                                customer.orders.items[0].total.total_shipping
                                    .currency
                            )}
                            {
                                customer.orders.items[0].total.total_shipping
                                    .value
                            }
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            {formatMessage({
                                id: 'Tax',
                                defaultMessage: 'Tax'
                            })}
                            :{' '}
                            {forMatCurrentValue(
                                customer.orders.items[0].total.total_tax
                                    .currency
                            )}
                            {customer.orders.items[0].total.total_tax.value}
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={5}>
                            <span className={classes.child1}>
                                {formatMessage({
                                    id: 'Grand total',
                                    defaultMessage: 'Grand total'
                                })}
                                :{' '}
                            </span>
                            <span className={classes.child2}>
                                {forMatCurrentValue(
                                    customer.orders.items[0].total.subtotal
                                        .currency
                                )}
                                {grandTotal}
                            </span>
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
        return html;
    };

    const orderInfo = () => {
        let html = null;
        html = (
            <div className={classes.orderInfoWrapper}>
                <div className={classes.orderInfoTitle}>Order Infomation</div>
                <div className={classes.orderInfoMain}>
                    <div className={classes.infoItem}>
                        <div className={classes.infoItemTitle}>
                            {formatMessage({
                                id: 'Shipping Address',
                                defaultMessage: 'Shipping Address'
                            })}
                        </div>
                        <div className={classes.infoItemContent}>
                            <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .firstname
                                }{' '}
                                {
                                    customer.orders.items[0].billing_address
                                        .lastname
                                }
                            </span>
                            <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .street[0]
                                }
                            </span>
                            <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .street[1]
                                }
                            </span>
                        </div>
                    </div>

                    <div className={classes.infoItem}>
                        <div className={classes.infoItemTitle}>
                            {formatMessage({
                                id: 'Shipping Method',
                                defaultMessage: 'Shipping Method'
                            })}
                        </div>
                        <div className={classes.infoItemContent}>
                            <span>
                                {customer.orders.items[0].shipping_method}
                            </span>
                            {customer.orders.items[0].mp_delivery_information
                                .mp_delivery_time ? (
                                <div className={classes.infoItemContent}>
                                    <span>
                                        {customer.orders.items[0].mp_delivery_information.mp_delivery_date.slice(
                                            0,
                                            10
                                        )}
                                    </span>
                                    <span>
                                        {
                                            customer.orders.items[0]
                                                .mp_delivery_information
                                                .mp_delivery_time
                                        }
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div className={classes.infoItemTitle}>
                            {formatMessage({
                                id: 'Billing Address',
                                defaultMessage: 'Billing Address'
                            })}
                        </div>
                        <div className={classes.infoItemContent}>
                            <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .firstname
                                }{' '}
                                {
                                    customer.orders.items[0].billing_address
                                        .lastname
                                }
                            </span>
                            <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .street[0]
                                }
                            </span>
                            <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .street[1]
                                }
                            </span>
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div className={classes.infoItemTitle}>
                            {formatMessage({
                                id: 'Payment Method',
                                defaultMessage: 'Payment Method'
                            })}
                        </div>
                        <div className={classes.infoItemContent}>
                            <span>
                                {
                                    customer.orders.items[0].payment_methods[0]
                                        .name
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
        return html;
    };
    // console.log('dataDetail', customer.orders.items[0].billing_address);

    if (width > 767) {
        return (
            <div className={`${classes.root} container`}>
                <div className={classes.wrapper}>
                    <div className={classes.LeftMenu}>
                        <LeftMenu label="Order History" />
                    </div>
                    {loading ? (
                        fullPageLoadingIndicator
                    ) : (
                        <div className={classes.container}>
                            <div className={classes.pageContent}>
                                <div className={classes.heading}>
                                    <span>
                                        {formatMessage({
                                            id: 'My orders',
                                            defaultMessage: 'My orders'
                                        })}
                                    </span>
                                    <span>{status}</span>
                                </div>

                                <div className={classes.subHead}>
                                    <span>
                                        {formatMessage({
                                            id: 'Order #',
                                            defaultMessage: 'Order #'
                                        })}
                                        {orderId}
                                    </span>
                                    <div>
                                        <button onClick={() => window.print()}>
                                            {formatMessage({
                                                id: 'Print order',
                                                defaultMessage: 'Print order'
                                            })}
                                        </button>
                                        <button
                                            disabled={loading ? true : false}
                                            className={
                                                loading ? classes.btnDis : null
                                            }
                                            onClick={() =>
                                                reorderItem({
                                                    variables: { orderId }
                                                })
                                            }
                                        >
                                            {formatMessage({
                                                id: 'Reorder',
                                                defaultMessage: 'Reorder'
                                            })}
                                        </button>
                                    </div>
                                </div>

                                <div className={classes.pageContentTable}>
                                    {orderDetailTable()}
                                    {orderInfo()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={classes.mbHeading}>
                <span className={classes.status}>{status}</span>
            </div>
            {loading ? (
                fullPageLoadingIndicator
            ) : (
                <div className={classes.rootMobile}>
                    <div className={classes.shippingAddressContainer}>
                        <MdLocationPin className={classes.addressIcon} />
                        <div className={classes.mbShipTo}>
                            <div >
                                {formatMessage({
                                    id: 'Shipping Address',
                                    defaultMessage: 'Shipping Address'
                                })}
                            </div>

                            <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .firstname
                                }{' '}
                                {
                                    customer.orders.items[0].billing_address
                                        .lastname
                                }
                                {' | '}
                                {
                                    customer.orders.items[0].billing_address
                                        .telephone
                                }
                            </span>
                            <span>
                                <span>
                                    {formatMessage({
                                        id: 'Address',
                                        defaultMessage: 'Address'
                                    })}
                                </span>
                                :{' '}
                                {
                                    customer.orders.items[0].billing_address
                                        .street[0]
                                }
                            </span>
                            {/* <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .telephone
                                }
                            </span> */}
                            {/* <div className={classes.method}>
                            {customer.orders.items[0].shipping_method}
                        </div> */}
                        </div>
                    </div>
                    <div className={classes.mbId}>
                        <span>Order ID</span>
                        <span>{orderId}</span>
                    </div>
                    <div className={classes.mbMyOrder}>
                        <div className={classes.title}>
                            {formatMessage({
                                id: 'My Order',
                                defaultMessage: 'My Order'
                            })}
                        </div>
                        <div />
                        {orderItemMb(listItem)}
                    </div>
                    <div>
                            <button onClick={() => window.print()}>
                                {formatMessage({
                                    id: 'Print order',
                                    defaultMessage: 'Print order'
                                })}
                            </button>
                            <button
                                disabled={loading ? true : false}
                                className={loading ? classes.btnDis : null}
                                onClick={() =>
                                    reorderItem({ variables: { orderId } })
                                }
                            >
                                {formatMessage({
                                    id: 'Reorder',
                                    defaultMessage: 'Reorder'
                                })}
                            </button>
                    </div>
                    <div className={classes.mbHeadInfo}>
                        <div className={classes.mbHeadInfoItem}>
                            <span>
                                {formatMessage({
                                    id: 'Date',
                                    defaultMessage: 'Date'
                                })}
                            </span>
                            <span>
                                {dateFormat(
                                    customer.orders.items[0].order_date
                                )}
                            </span>
                            <span>
                                {timeFormat(
                                    customer.orders.items[0].order_date
                                )}
                            </span>
                        </div>
                        <div className={classes.mbHeadInfoItem}>
                            <span>
                                {formatMessage({
                                    id: 'Order Total',
                                    defaultMessage: 'Order Total'
                                })}
                            </span>
                            <span>
                                {forMatCurrentValue(
                                    customer.orders.items[0].total.subtotal
                                        .currency
                                )}
                                {subTotal}
                            </span>
                        </div>
                    </div>

                    <div className={classes.mbPayment}>
                        <div>
                            {formatMessage({
                                id: 'Payment method',
                                defaultMessage: 'Payment Method'
                            })}
                        </div>
                        <div />
                        <span>
                            {customer.orders.items[0].payment_methods[0].name}
                        </span>
                        <div>
                            {formatMessage({
                                id: 'Billing Address',
                                defaultMessage: 'Billing Address'
                            })}
                        </div>
                        <span>
                            <span>
                                {formatMessage({
                                    id: 'Name',
                                    defaultMessage: 'Name'
                                })}
                            </span>
                            :{' '}
                            {customer.orders.items[0].billing_address.firstname}{' '}
                            {customer.orders.items[0].billing_address.lastname}
                        </span>
                        <span>
                            <span>
                                {formatMessage({
                                    id: 'Email',
                                    defaultMessage: 'Email'
                                })}{' '}
                            </span>
                            :
                        </span>
                        <span>
                            <span>
                                {formatMessage({
                                    id: 'Company',
                                    defaultMessage: 'Company'
                                })}
                            </span>
                            : {customer.orders.items[0].billing_address.company}
                        </span>
                        <span>
                            <span>
                                {formatMessage({
                                    id: 'Address',
                                    defaultMessage: 'Address'
                                })}
                            </span>
                            :{' '}
                            {customer.orders.items[0].billing_address.street[0]}
                        </span>
                        <span>
                            <span>
                                {formatMessage({
                                    id: 'Country',
                                    defaultMessage: 'Country'
                                })}
                            </span>
                            :{' '}
                            {customer.orders.items[0].billing_address.street[1]}
                        </span>
                        <span>
                            <span>
                                {formatMessage({
                                    id: 'Phone Number',
                                    defaultMessage: 'Phone Number'
                                })}
                            </span>
                            :{' '}
                            {customer.orders.items[0].billing_address.telephone}
                        </span>
                        <div className={classes.method}>
                            <span>
                                {formatMessage({
                                    id: 'Coupon code',
                                    defaultMessage: 'Coupon code'
                                })}
                            </span>
                        </div>
                    </div>
                    {/* <div className={classes.mbMyOrder}>
                        <div>
                            {formatMessage({
                                id: 'My Order',
                                defaultMessage: 'My Order'
                            })}
                        </div>
                        <div />
                        {orderItemMb(listItem)}
                    </div> */}
                    <div className={classes.mbTotal}>
                        <span>
                            {formatMessage({
                                id: 'Subtotal',
                                defaultMessage: 'Subtotal'
                            })}
                            :{' '}
                            {forMatCurrentValue(
                                customer.orders.items[0].total.subtotal.currency
                            )}
                            {subTotal}
                        </span>
                        <span>
                            {formatMessage({
                                id: 'Shipping Fee',
                                defaultMessage: 'Shipping Fee'
                            })}
                            :{' '}
                            {forMatCurrentValue(
                                customer.orders.items[0].total.total_shipping
                                    .currency
                            )}
                            {
                                customer.orders.items[0].total.total_shipping
                                    .value
                            }
                        </span>
                        <span>
                            {formatMessage({
                                id: 'Tax',
                                defaultMessage: 'Tax'
                            })}
                            :{' '}
                            {forMatCurrentValue(
                                customer.orders.items[0].total.total_tax
                                    .currency
                            )}
                            {customer.orders.items[0].total.total_tax.value}
                        </span>
                        <div>
                            <span className={classes.child1}>
                                {formatMessage({
                                    id: 'Grand total',
                                    defaultMessage: 'Grand total'
                                })}
                                :{' '}
                            </span>
                            <span className={classes.child2}>
                                {forMatCurrentValue(
                                    customer.orders.items[0].total.subtotal
                                        .currency
                                )}
                                {grandTotal}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderDetailPage;
