import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '@magento/venia-ui/lib/classify';

const DeliveryTimeSlot = props => {
    const classes = useStyle({}, props.classes);
    const { total, shipping_arrival_timeslot } = props.data;

    if(Object.entries(shipping_arrival_timeslot).length === 0){
        return ''
    }

    const indexStart = shipping_arrival_timeslot.indexOf('(+$');
    const indexEnd = shipping_arrival_timeslot.indexOf(')"');
    const priceStr = shipping_arrival_timeslot.slice(indexStart + 3, indexEnd);

    return shipping_arrival_timeslot ? (
        <Fragment>
            <span className={classes.lineItemLabel}>
                <FormattedMessage
                    id={'Delivery Time Slot'}
                    defaultMessage={'Delivery Time Slot'}
                />
            </span>
            <span className={classes.price}>
                <Price value={Number(priceStr)} currencyCode={total.currency} />
            </span>
        </Fragment>
    ) : (
        ''
    );
};

export default DeliveryTimeSlot;
