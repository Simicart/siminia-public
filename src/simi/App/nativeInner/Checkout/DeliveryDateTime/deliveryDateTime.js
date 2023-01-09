import React, { forwardRef, useState, useImperativeHandle } from 'react';
import defaultClasses from './deliveryDateTime.module.css';
import Identify from 'src/simi/Helper/Identify';
import { useStyle } from '@magento/venia-ui/lib/classify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useIntl, FormattedMessage } from 'react-intl';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './deliveryDateTime.gql';
import Button from '@magento/venia-ui/lib/components/Button';
import Loader from '../../Loader';

const DeliveryDateTime = forwardRef((props, ref) => {
    const classes = useStyle(defaultClasses, props.classes);
    const storeConfig = Identify.getStoreConfig();
    const { bssDeliveryDateStoreConfig } = storeConfig || {};
    const { formatMessage } = useIntl();

    if (
        !bssDeliveryDateStoreConfig ||
        bssDeliveryDateStoreConfig.active === '0'
    ) {
        return null;
    }
    const {
        active,
        as_processing_days,
        block_out_holidays,
        cut_off_time,
        date_day_off,
        date_fields,
        icon_calendar,
        is_field_required_comment,
        is_field_required_date,
        is_field_required_timeslot,
        on_which_page,
        process_time,
        shipping_comment,
        time_slots
    } = bssDeliveryDateStoreConfig;
    const formatDate = (date, type, mutation) => {
        if (mutation) {
            return (
                ('00' + date.getDate()).slice(-2) +
                type +
                ('00' + (date.getMonth() + 1)).slice(-2) +
                type +
                date.getFullYear()
            );
        }
        return (
            ('00' + (date.getMonth() + 1)).slice(-2) +
            type +
            ('00' + date.getDate()).slice(-2) +
            type +
            date.getFullYear()
        );
    };
    const now = new Date();
    const holidays = block_out_holidays
        .split('{s:4:"date";s:10:')
        .filter(item => item.indexOf('content') !== -1);
    const daysOff = date_day_off.split(',');
    const dateOff = [];

    holidays.forEach(function(element) {
        dateOff.push(element.slice(1, 11));
    });
    const filterDate = (date, dateOff) => {
        if (dateOff.includes(formatDate(date, '/'))) {
            return false;
        }
        return true;
    };

    const filterDaysOff = (date, daysOff) => {
        if (daysOff.includes(date)) {
            return false;
        }
        return true;
    };

    const handleSelectedDate = () => {
        const selectedDate = new Date();
        selectedDate.setDate(now.getDate() + 1 + Number(process_time));
        if (!filterDaysOff(selectedDate.getDay().toString(), daysOff)) {
            selectedDate.setDate(selectedDate.getDate() + 1);
            if (!filterDate(selectedDate, dateOff)) {
                selectedDate.setDate(selectedDate.getDate() + 1);
            }
        }
        return selectedDate;
    };

    const [startDate, setStartDate] = useState(handleSelectedDate());
    const excludeHolidays =
        as_processing_days === '0'
            ? dateOff.filter(
                  date =>
                      date >= formatDate(now, '/') &&
                      date <= formatDate(handleSelectedDate(), '/')
              ).length
            : 0;
    const minDate = new Date();
    minDate.setDate(now.getDate() + 1 + Number(process_time) + excludeHolidays);

    const handleSubString = (str, number) => {
        return str.substring(0, str.length - number);
    };

    const chunkArray = (arr, size) => {
        let index = 0;
        let arrayLength = arr.length;
        let tempArray = [];

        for (index = 0; index < arrayLength; index += size) {
            let myChunk = arr.slice(index, index + size);
            tempArray.push(myChunk);
        }

        return tempArray;
    };

    const handletimeSlots = () => {
        const strTimeSlots = time_slots.slice(5);
        let tempArray = [];
        handleSubString(strTimeSlots, 1)
            .split('s:18:')
            .filter(item => item.indexOf('name') !== -1)
            .map(element => {
                const item = handleSubString(element.slice(26), 2).split(';');
                item.map(i => {
                    tempArray.push(
                        handleSubString(i.slice(i.indexOf('"') + 1), 1)
                    );
                });
            });
        const arraySplit = chunkArray(tempArray, 10);
        let deliveryTimeSlot = [];
        arraySplit.forEach(function(element) {
            let splitHalf = chunkArray(element, 2);
            const entries = new Map(splitHalf);
            const obj = Object.fromEntries(entries);
            deliveryTimeSlot.push(obj);
        });
        return deliveryTimeSlot;
    };
    const deliveryTime = handletimeSlots();
    const OptionDeliveryTime = deliveryTime.map((time, index) => {
        const opt =
            time.name +
            ' | ' +
            time.from +
            ' - ' +
            time.to +
            ' | ' +
            time.note +
            ' | ' +
            '(+$' +
            time.price +
            ')';

        return (
            <option value={opt} key={index}>
                {opt}
            </option>
        );
    });

    const [deliTime, setDeliTime] = useState('');
    const [deliveryComment, setDeliveryComment] = useState('');

    const handleChange = e => {
        let name = e.target.name;
        if (name == 'deliveryTime') {
            setDeliTime(e.target.value);
        }
        if (name == 'Delivery Comment') {
            setDeliveryComment(e.target.value);
        }
    };
    const DeliveryComment =
        shipping_comment === '1' ? (
            <label className="text-area">
                <div className={classes.title}>
                    {formatMessage({
                        id: 'Shipping Arrival Comment',
                        defaultMessage: 'Shipping Arrival Comment'
                    })}
                </div>
                <input
                    type="text"
                    value={deliveryComment}
                    onChange={handleChange}
                    name="Delivery Comment"
                />
            </label>
        ) : null;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { deliveryTimeMutation } = operations;
    const [{ cartId }] = useCartContext();
    const handleSubmit = () => {
        deliveryMutation({
            variables: {
                cart_id: cartId,
                shipping_arrival_comments: deliveryComment,
                shipping_arrival_date: formatDate(startDate, '-', 1),
                shipping_arrival_timeslot: deliTime
            }
        });
    };
    const [
        deliveryMutation,
        { data: mutationData, loading: mutationLoading, error: mutationError }
    ] = useMutation(deliveryTimeMutation);

    if (mutationLoading) {
        return <Loader />;
    }

    return (
        <div className={classes.root}>
            <div className={classes.deliveryDate}>
                <div className={classes.title}>Delivery Date</div>
                <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    minDate={minDate}
                    filterDate={date =>
                        filterDaysOff(date.getDay().toString(), daysOff) &&
                        filterDate(date, dateOff)
                    }
                />
            </div>
            <div className={classes.deliveryTime}>
                <div className={classes.title}>Delivery Time Slot</div>
                <select
                    onChange={handleChange}
                    value={deliTime}
                    name="deliveryTime"
                    id="deliveryTime"
                    placeholder="Please"
                >
                    <option>
                        {formatMessage({
                            id: 'Please select delivery time slot',
                            defaultMessage: 'Please select delivery time slot'
                        })}
                    </option>
                    {OptionDeliveryTime}
                </select>
            </div>
            <div className={classes.comment}>{DeliveryComment}</div>
            <Button
                className={classes.btnApply}
                onClick={() => handleSubmit()}
                priority={'normal'}
                type={'button'}
            >
                <FormattedMessage id={'Apply'} defaultMessage={'Apply'} />
            </Button>
        </div>
    );
});

export default DeliveryDateTime;
