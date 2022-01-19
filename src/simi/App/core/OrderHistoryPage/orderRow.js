import React, { useMemo } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useOrderRow } from './useOrderRow';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import CollapsedImageGallery from '@magento/venia-ui/lib/components/OrderHistoryPage/collapsedImageGallery';
import OrderProgressBar from '@magento/venia-ui/lib/components/OrderHistoryPage/orderProgressBar';
import OrderDetails from '@magento/venia-ui/lib/components/OrderHistoryPage/OrderDetails';
import defaultClasses from './orderRow.module.css';
import { useOrderDetailPage } from '../OrderDetailPage/useOrderDetailPage';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

const OrderRow = props => {
    const { order } = props;
    const { formatMessage } = useIntl();
    const {
        invoices,
        items,
        number: orderNumber,
        order_date: orderDate,
        shipments,
        status,
        total,
        billing_address
    } = order;
    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;
    
    const orderId = order.number;
    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = orderDate.replace(' ', 'T');
    const formattedDate = new Date(isoFormattedDate).toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    );
    const name = billing_address.firstname + billing_address.lastname;

    const talonPropsReorder = useOrderDetailPage({ orderId });
    const {
        dataDetail,
        loadingDetail,
        errorDetail,
        reorderItemMutation
    } = talonPropsReorder;
    const [reorderItem, { data,loading, error }] = useMutation(
        reorderItemMutation
    );

    const hasInvoice = !!invoices.length;
    const hasShipment = !!shipments.length;
    let derivedStatus;
    if (status === 'Complete') {
        derivedStatus = formatMessage({
            id: 'orderRow.deliveredText',
            defaultMessage: 'Delivered'
        });
    } else if (hasShipment) {
        derivedStatus = formatMessage({
            id: 'orderRow.shippedText',
            defaultMessage: 'Shipped'
        });
    } else if (hasInvoice) {
        derivedStatus = formatMessage({
            id: 'orderRow.readyToShipText',
            defaultMessage: 'Ready to ship'
        });
    } else {
        derivedStatus = formatMessage({
            id: 'orderRow.processingText',
            defaultMessage: 'Processing'
        });
    }

    const talonProps = useOrderRow({ items });
    const { loadingOrderRow, isOpen, handleContentToggle } = talonProps;

    const imagesData = useMemo(() => {
        const imgData = {};
        if (talonProps.imagesData)
            Object.keys(talonProps.imagesData).map(key => {
                if (
                    talonProps.imagesData[key] &&
                    talonProps.imagesData[key].thumbnail
                ) {
                    imgData[key] = talonProps.imagesData[key];
                }
            });
        return imgData;
    }, [talonProps.imagesData]);

    const classes = useStyle(defaultClasses, props.classes);

    const contentClass = isOpen ? classes.content : classes.content_collapsed;

    const contentToggleIconSrc = isOpen ? ChevronUp : ChevronDown;

    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={24} />;

    // const collapsedImageGalleryElement = isOpen ? null : (
    //     <CollapsedImageGallery items={imagesData} />
    // );

    // const orderDetails = loadingOrderRow ? null : (
    //     <OrderDetails orderData={order} imagesData={imagesData} />
    // );
    // console.log("hahaha", order);

    const orderTotalPrice =
        currency && orderTotal !== null ? (
            <Price currencyCode={currency} value={orderTotal} />
        ) : (
            '-'
        );

    if (loading) {
        return fullPageLoadingIndicator;
    }
    return (
        <li className={classes.root}>
            <div className={classes.rootItem}>
                <span className={classes.orderNumberLabel}>
                    <FormattedMessage
                        id={'orderRow.orderNumberText'}
                        defaultMessage={'Order #'}
                    />
                </span>
                <span className={classes.orderNumber}>{orderNumber}</span>
            </div>
            <div className={classes.rootItem}>
                <span className={classes.orderDateLabel}>
                    {/* <FormattedMessage
                        id={'orderRow.orderDateText'}
                        defaultMessage={'Order Date'}
                    /> */}
                </span>
                <span className={classes.orderDate}>{formattedDate}</span>
            </div>
            <div className={classes.rootItem}>
                {/* {collapsedImageGalleryElement}
                 */}
                {name}
            </div>
            <div className={classes.rootItem}>
                <span className={classes.orderStatusBadge}>
                    {status}
                </span>
                {/* <OrderProgressBar status={derivedStatus} /> */}
            </div>
            <div className={classes.rootItem}>
                <span className={classes.orderTotalLabel} />
                <div className={classes.orderTotal}>{orderTotalPrice}</div>
            </div>

            {/* <button
                className={classes.contentToggleContainer}
                onClick={handleContentToggle}
                type="button"
            >
                view
                {contentToggleIcon}
                
            </button> */}
            <Link
                className={classes.viewOrder}
                to={`/order-history/${order.number}`}
            >
                <button className={classes.btnViewOrd}>{formatMessage({
                    id: 'View order',
                    defaultMessage: 'View order'
                })}</button>
            </Link>
            <button
                disabled={loading ? true : false}
                className={loading ? classes.btnDis : classes.btn}
                onClick={() => reorderItem({ variables: { orderId } })}
            >
                {formatMessage({
                    id: 'Reorder',
                    defaultMessage: 'Reorder'
                })}
            </button>

            {/* <div className={contentClass}>{orderDetails}</div> */}
        </li>
    );
};

export default OrderRow;

OrderRow.propTypes = {
    classes: shape({
        root: string,
        cell: string,
        stackedCell: string,
        label: string,
        value: string,
        orderNumberContainer: string,
        orderDateContainer: string,
        orderTotalContainer: string,
        orderStatusContainer: string,
        orderItemsContainer: string,
        contentToggleContainer: string,
        orderNumberLabel: string,
        orderDateLabel: string,
        orderTotalLabel: string,
        orderNumber: string,
        orderDate: string,
        orderTotal: string,
        orderStatusBadge: string,
        content: string,
        content_collapsed: string
    }),
    order: shape({
        billing_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string)
        }),
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        invoices: arrayOf(
            shape({
                id: string
            })
        ),
        number: string,
        order_date: string,
        payment_methods: arrayOf(
            shape({
                type: string,
                additional_data: arrayOf(
                    shape({
                        name: string,
                        value: string
                    })
                )
            })
        ),
        shipping_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string),
            telephone: string
        }),
        shipping_method: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        number: string
                    })
                )
            })
        ),
        status: string,
        total: shape({
            discounts: arrayOf(
                shape({
                    amount: shape({
                        currency: string,
                        value: number
                    })
                })
            ),
            grand_total: shape({
                currency: string,
                value: number
            }),
            subtotal: shape({
                currency: string,
                value: number
            }),
            total_tax: shape({
                currency: string,
                value: number
            }),
            total_shipping: shape({
                currency: string,
                value: number
            })
        })
    })
};
