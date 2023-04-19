import React, {
    forwardRef,
    useState,
    useImperativeHandle,
    useEffect,
    useCallback
} from 'react';
import Identify from 'src/simi/Helper/Identify';
import 'react-datepicker/dist/react-datepicker.css';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './deliveryDateTime.gql';

import { usePriceSummary } from '../../../../talons/Cart/usePriceSummary';
export const useDeliveryDateTime = props => {
    const { setPageIsUpdating } = props;
    const storeConfig = Identify.getStoreConfig();
    const [isSubmit, setIsSubmit] = useState(false);
    const { bssDeliveryDateStoreConfig } = storeConfig || {};
    const { flatData } = usePriceSummary();

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
    } = bssDeliveryDateStoreConfig || '';
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

    const daysOff = date_day_off?.split(',');
    const dateOff = block_out_holidays;

    const filterDate = (date, dateOff) => {
        let d =
            date.getDate() < '10' ? '' + '0' + date.getDate() : date.getDate();

        let m =
            date.getMonth() + 1 < '10'
                ? '0' + parseInt(date.getMonth() + 1)
                : '' + parseInt(date.getMonth() + 1);
        let y = date.getFullYear();
        let thisDay = m + '/' + d + '/' + y;
        if (dateOff.findIndex(item => item.date === thisDay) !== -1) {
            return false;
        }
        return true;
    };

    const filterDaysOff = (date, daysOff) => {
        if (daysOff?.includes(date)) {
            return false;
        }
        return true;
    };

    const handleSelectedDate = () => {
        if (flatData.shipping_arrival_date) {
            const selectedDate = new Date(flatData.shipping_arrival_date);
            return selectedDate;
        } else {
            const selectedDate = new Date();
            selectedDate.setDate(now.getDate() + 1 + Number(process_time));
            if (!filterDaysOff(selectedDate.getDay().toString(), daysOff)) {
                selectedDate.setDate(selectedDate.getDate() + 1);
                if (!filterDate(selectedDate, dateOff)) {
                    selectedDate.setDate(selectedDate.getDate() + 1);
                }
            }
            return selectedDate;
        }
    };
    const [startDate, setStartDate] = useState(handleSelectedDate());
    const excludeHolidays =
        as_processing_days === '0'
            ? dateOff?.filter(
                  date =>
                      date >= formatDate(now, '/') &&
                      date <= formatDate(handleSelectedDate(), '/')
              ).length
            : 0;
    const minDate = new Date();
    minDate.setDate(now.getDate() + 1 + Number(process_time) + excludeHolidays);


    const [deliTime, setDeliTime] = useState(
        flatData.shipping_arrival_timeslot
    );
    const [deliveryComment, setDeliveryComment] = useState(
        flatData.shipping_arrival_comments
    );
    useEffect(() => {
        setDeliTime(flatData.shipping_arrival_timeslot);
        setDeliveryComment(flatData.shipping_arrival_comments);
    }, [
        flatData.shipping_arrival_timeslot,
        flatData.shipping_arrival_comments
    ]);

    const handleChange = e => {
        let name = e.target.name;
        if (name == 'deliveryTime') {
            setDeliTime(e.target.value);
        }
        if (name == 'Delivery Comment') {
            setDeliveryComment(e.target.value);
        }
    };

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { deliveryTimeMutation } = operations;
    const [{ cartId }] = useCartContext();

    const [
        deliveryMutation,
        {
            called: applyDeliveryTimeCalled,
            error: deliveryTimeError,
            loading: deliveryTimeLoading
        }
    ] = useMutation(deliveryTimeMutation);

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

    useEffect(() => {
        if (applyDeliveryTimeCalled) {
            setPageIsUpdating(deliveryTimeLoading);
        }
    }, [applyDeliveryTimeCalled, deliveryTimeLoading, setPageIsUpdating]);

    useEffect(() => {
        if (
            (Number(is_field_required_comment) === 1 &&
                deliveryComment === '') ||
            (Number(is_field_required_timeslot) === 1 && deliTime === '')
        ) {
            setIsSubmit(true);
        } else {
            setIsSubmit(false);
        }
    }, [deliveryComment, deliTime]);

    useEffect(() => {
        if (flatData.shipping_arrival_date) {
            setStartDate(handleSelectedDate());
        }
    }, [flatData.shipping_arrival_date]);

    return {
        bssDeliveryDateStoreConfig,
        handleSubmit,
        isSubmit,
        deliTime,
        startDate,
        setStartDate,
        minDate,
        dateOff,
        daysOff,
        handleChange,
        flatData,
        deliveryTimeLoading,
        deliveryComment,
        filterDaysOff,
        filterDate
    };
};
