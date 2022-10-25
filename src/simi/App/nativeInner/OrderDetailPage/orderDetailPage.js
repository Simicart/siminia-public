import React, { useEffect, useState, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/client';
import AlertMessages from '../ProductFullDetail/AlertMessages';
import { useParams } from 'react-router-dom';
import DEFAULT_OPERATIONS from './orderDetailPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useOrderDetailPage } from './useOrderDetailPage';
import defaultClasses from './orderDetailPage.module.scss';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LeftMenu from '../../core/LeftMenu';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { MdLocationPin } from 'react-icons/md';
import { useOrderRow } from '../OrderHistoryPage/useOrderRow';
import Loader from '../Loader';
import { logoUrl } from 'src/simi/Helper/Url';

const OrderDetailPage = props => {
    const [width, setWidth] = useState(window.innerWidth);
    const placeHolderImg = logoUrl();

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

    const [alertMsg, setAlertMsg] = useState(-1);
    const [alertText, setAlertText] = useState('');
    const successMsg = `This order has been reordered successfully`;

    const classes = useStyle(defaultClasses, props.classes);

    const [reorderItem, { data, loading, error }] = useMutation(
        reorderItemMutation
    );

    useEffect(() => {
        if (data) {
            setAlertMsg(true);
            setAlertText('This order has been reordered successfully');
        }
        if (error) {
            setAlertMsg(true);
            setAlertText('Error! An error occurred. Please try again later');
        }
    }, [data, error]);

    const items = dataDetail ? dataDetail.customer.orders.items[0].items : [];

    const talonThumbnail = useOrderRow({ items });

    let bottomInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            bottomInsets = parseInt(simicartRNinsets.bottom);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            bottomInsets = parseInt(simpifyRNinsets.bottom);
        }
    } catch (err) {}

    const handleImage = useCallback((list, listItem) => {
        const result = {};
        list.forEach((item, index) => {
            if (item[1] && item[1].variants) {
                item[1].variants.forEach((i, idx) => {
                    result[i.product.sku] = i.product.thumbnail.url;
                });
            }
            if (item[1] && item[1].thumbnail && !result[item[0]])
                result[item[0]] = item[1].thumbnail.url;
        });
        return result;
    }, []);

    const result = Object.entries(talonThumbnail.imagesData);
    const listImage =
        dataDetail && dataDetail.customer
            ? dataDetail.customer.orders.items[0].items
            : [];

    if (loadingDetail) {
        return <Loader />;
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
    const listUrlImage = handleImage(result, listImage);
    // const items = dataDetail ? dataDetail.customer.orders.items[0].items : [];

    const { customer } = dataDetail;

    const listItem = customer.orders.items[0].items;
    const subTotal = customer.orders.items[0].total.subtotal.value;
    const discount = customer.orders.items[0].total.discounts[0]
        ? customer.orders.items[0].total.discounts[0].amount
        : null;
    const grandTotal = customer.orders.items[0].total.base_grand_total.value;
    const mpRewardPoints = customer.orders.items[0].mp_reward_points || {};
    const mpDeliveryInformation =
        customer.orders.items[0].mp_delivery_information || {};
    const status = customer.orders.items[0].status;

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
                        <td>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: item.product_name
                                }}
                            />
                        </td>
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
                    <div className={classes.orderItemMb} key={index}>
                        {/* {placeHoder ? (
                            <ImageLoading height={100} width={80} />
                        ) : null} */}
                        <img
                            className={classes.orderItemMbImg}
                            src={
                                listUrlImage[item.product_sku] || placeHolderImg
                            }
                            style={{
                                marginRight: 15,
                                minWidth: 100,
                                maxWidth: 100,
                                width: 100,
                                objectFit: 'contain'
                            }}
                            alt={item.product_name}
                        />
                        <div
                            style={{ width: '70%' }}
                            className={classes.orderItemMbContent}
                        >
                            <div className={classes.orderItemMbHeading}>
                                {/* <span>{item.product_name}</span> */}
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: item.product_name
                                    }}
                                />
                            </div>
                            <div>
                                <span>SKU: </span>
                                <span>{item.product_sku}</span>
                            </div>
                        </div>
                        <div className={classes.orderItemQty}>
                            <div>
                                <span>x{item.quantity_ordered}</span>
                            </div>
                            <div>
                                <span className={classes.orderItemPrice}>
                                    {forMatCurrentValue(
                                        item.product_sale_price.currency
                                    )}
                                    {item.product_sale_price.value}
                                </span>
                            </div>
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
                            {mpDeliveryInformation.mp_delivery_time ? (
                                <div className={classes.infoItemContent}>
                                    <span>
                                        {mpDeliveryInformation.mp_delivery_date.slice(
                                            0,
                                            10
                                        )}
                                    </span>
                                    <span>
                                        {mpDeliveryInformation.mp_delivery_time ===
                                        'Select time'
                                            ? ''
                                            : mpDeliveryInformation.mp_delivery_time}
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
            <AlertMessages
                message={alertText}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status={data ? 'success' : 'error'}
            />

            <div className={classes.rootMobile}>
                {loading ? <Loader /> : null}
                <div className={classes.shippingAddressContainer}>
                    <MdLocationPin className={classes.addressIcon} />
                    <div className={classes.mbShipTo}>
                        <div>
                            {formatMessage({
                                id: 'Shipping Address',
                                defaultMessage: 'Shipping Address'
                            })}
                        </div>

                        <span>
                            {customer.orders.items[0].billing_address.firstname}{' '}
                            {customer.orders.items[0].billing_address.lastname}
                            {' | '}
                            {customer.orders.items[0].billing_address.telephone}
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
                        <span style={{ display: 'flex' }}>
                            {customer.orders.items.length > 0 &&
                                customer.orders.items[0]
                                    .mp_delivery_information &&
                                customer.orders.items[0].mp_delivery_information
                                    .mp_delivery_time && (
                                    <React.Fragment>
                                        <span style={{ marginRight: 5 }}>
                                            {formatMessage({
                                                id: 'Delivery Time',
                                                defaultMessage: 'Delivery Time'
                                            })}
                                            :{' '}
                                        </span>
                                        <span
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                            className={classes.infoItemContent}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: 400,
                                                    marginRight: 5
                                                }}
                                            >
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
                                        </span>
                                    </React.Fragment>
                                )}
                        </span>
                        {/* <span>
                                {
                                    customer.orders.items[0].billing_address
                                        .telephone
                                }
                            </span> */}
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

                    <div className={classes.shippingMethod}>
                        <span>
                            {formatMessage({
                                id: 'global.shippingMethod',
                                defaultMessage: 'Shipping Method'
                            })}
                        </span>
                        <div className={classes.price}>
                            <span>
                                {customer.orders.items[0].shipping_method}
                            </span>
                            <span>
                                {forMatCurrentValue(
                                    customer.orders.items[0].total
                                        .total_shipping.currency
                                )}
                                {
                                    customer.orders.items[0].total
                                        .total_shipping.value
                                }
                            </span>
                        </div>
                    </div>
                    <div className={classes.subTotal}>
                        <span>
                            {formatMessage({
                                id: 'miniCart.subtotal',
                                defaultMessage: 'Subtotal'
                            })}
                        </span>
                        <span>
                            {forMatCurrentValue(
                                customer.orders.items[0].total.subtotal.currency
                            )}
                            {subTotal}
                        </span>
                    </div>
                </div>
                <div className={classes.mbPayment}>
                    <div>
                        {formatMessage({
                            id: 'Payment Method',
                            defaultMessage: 'Payment Method'
                        })}
                    </div>

                    <span>
                        {customer.orders.items[0].payment_methods[0].name}
                    </span>
                </div>
                {(mpRewardPoints.earn || mpRewardPoints.spent) && (
                    <div className={classes.mbRewardPoints}>
                        <div style={{ fontSize: 16, fontWeight: '600' }}>
                            {formatMessage({
                                id: 'Reward Points',
                                defaultMessage: 'Reward Points'
                            })}
                        </div>
                        <div className={classes.content}>
                            {mpRewardPoints.earn ? (
                                <div>
                                    <span>
                                        {formatMessage({
                                            id: 'You earned',
                                            defaultMessage: 'You earned'
                                        })}
                                        : {mpRewardPoints.earn}{' '}
                                        {formatMessage({
                                            id: 'points',
                                            defaultMessage: 'points'
                                        })}
                                    </span>
                                </div>
                            ) : null}
                            {mpRewardPoints.spent ? (
                                <div>
                                    <span>
                                        {formatMessage({
                                            id: 'You spent',
                                            defaultMessage: 'You spent'
                                        })}
                                        : {mpRewardPoints.spent}{' '}
                                        {formatMessage({
                                            id: 'points',
                                            defaultMessage: 'points'
                                        })}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                <div
                    style={{ height: 55 + bottomInsets }}
                    className={classes.mbBuyAgain}
                >
                    <button
                        disabled={loading ? true : false}
                        className={loading ? classes.btnDis : null}
                        onClick={() => reorderItem({ variables: { orderId } })}
                    >
                        {formatMessage({
                            id: 'Reorder',
                            defaultMessage: 'Reorder'
                        })}
                    </button>
                </div>

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
                        {customer.orders.items[0].total.total_shipping.value}
                    </span>
                    <span>
                        {formatMessage({
                            id: 'Tax',
                            defaultMessage: 'Tax'
                        })}
                        :{' '}
                        {forMatCurrentValue(
                            customer.orders.items[0].total.total_tax.currency
                        )}
                        {customer.orders.items[0].total.total_tax.value}
                    </span>
                    {discount ? (
                        <span>
                            {formatMessage({
                                id: 'Discount',
                                defaultMessage: 'Discount'
                            })}
                            : -{forMatCurrentValue(discount.currency)}
                            {discount.value}
                        </span>
                    ) : null}
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
                                customer.orders.items[0].total.subtotal.currency
                            )}
                            {grandTotal}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetailPage;
