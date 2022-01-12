import React, { Fragment, useEffect, useState } from 'react';
import DEFAULT_OPERATIONS from './deliveryDateTime.gql'
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useQuery } from '@apollo/client';
import { DateTimeInput } from '../../SimiProductOptions/CustomOption/components/OptionContent/DateTimeInput/DateTimeInput';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
require('./style.scss')
const DeliveryDateTime = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getDeliveryTime } = operations;
    const { data, error, loading } = useQuery(getDeliveryTime, {
      
    });
    const [date, setDate] = useState(new Date()); 

    if (loading) {
        return <h1>Loading...</h1>
    }
    console.log("dataa", data);
    const dateFormat = data.deliveryTime.deliveryDateFormat
    const daysOff = data.deliveryTime.deliveryDaysOff
    const dateOff = data.deliveryTime.deliveryDateOff

    return <DatePicker 
    selected={date}
    onChange={ date => setDate(date)}
    minDate={ new Date()}
    filterDate = {date => date.getDay() != '6' && date.getDay() != '0' && date.getDate() != '17/01/2022'}
    />

}


export default DeliveryDateTime