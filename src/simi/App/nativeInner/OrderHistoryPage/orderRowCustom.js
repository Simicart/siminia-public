import React, { useMemo } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { useOrderRow } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import CollapsedImageGallery from '@magento/venia-ui/lib/components/OrderHistoryPage/collapsedImageGallery';
import OrderProgressBar from '@magento/venia-ui/lib/components/OrderHistoryPage/orderProgressBar';
import OrderDetails from '@magento/venia-ui/lib/components/OrderHistoryPage/OrderDetails';
import defaultClasses from '@magento/venia-ui/lib/components/OrderHistoryPage/orderRow.module.css';


const OrderRowCustom = props => {
    const {order} = props;
    console.log("myorder", order);
    const { formatMessage } = useIntl();
    const {
        invoices,
        items,
        number: orderNumber,
        order_date: orderDate,
        shipments,
        status,
        total
    } = order;
    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;
    const isoFormattedDate = orderDate.replace(' ', 'T');
    const formattedDate = new Date(isoFormattedDate).toLocaleDateString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
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

    return <h1>hihihihi</h1>

}


export default OrderRowCustom