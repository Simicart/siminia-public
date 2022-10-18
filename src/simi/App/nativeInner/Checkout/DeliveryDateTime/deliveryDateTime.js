import React, {
    Fragment,
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef
} from 'react';
import DEFAULT_OPERATIONS from './deliveryDateTime.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useQuery, useMutation } from '@apollo/client';
// import { DateTimeInput } from '../../SimiProductOptions/CustomOption/components/OptionContent/DateTimeInput/DateTimeInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import ButtonLoader from '../../../../BaseComponents/ButtonLoader';
import { useIntl } from 'react-intl';

const deliveryTimeEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME) === 1;

require('./style.scss');
const DeliveryDateTime = forwardRef((props, ref) => {
    const { formatMessage } = useIntl();
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getDeliveryTime, deliveryTimeMutation } = operations;
    const { data, error, loading } = useQuery(getDeliveryTime, {
        skip: !deliveryTimeEnabled,
        fetchPolicy: 'cache-and-network'
    });
    const [startDate, setDate] = useState(new Date());
    const [deliTime, setDeliTime] = useState(
        data && data.deliveryTime && data.deliveryTime.deliveryTime
            ? data.deliveryTime.deliveryTime[0]
            : ''
    );
    const [houseSecurityCode, setHouseSecurityCode] = useState('');
    const [deliveryComment, setDeliveryComment] = useState('');

    const handleSubmit = () => {
        deliveryMutation({
            variables: {
                cart_id: cartId,
                mp_delivery_time: {
                    mp_delivery_date: startDate,
                    mp_delivery_time: deliTime,
                    mp_house_security_code: houseSecurityCode,
                    mp_delivery_comment: deliveryComment
                }
            }
        });
    };
    useImperativeHandle(ref, () => {
        return {
            handleSubmit: handleSubmit
        };
    });

    const [{ cartId }] = useCartContext();
    const [
        deliveryMutation,
        { data: mutationData, loading: mutationLoading, error: mutationError }
    ] = useMutation(deliveryTimeMutation);
    if (loading) {
        return null;
    }

    const dateFormat = data.deliveryTime.deliveryDateFormat;
    const daysOff = data.deliveryTime.deliveryDaysOff;
    const dateOff = data.deliveryTime.deliveryDateOff;
    const deliveryTime = data.deliveryTime.deliveryTime;
    const isHouseSecurityCode = data.deliveryTime.isEnabledHouseSecurityCode;
    const isDeliveryComment = data.deliveryTime.isEnabledDeliveryComment;
    const isEnabledDeliveryTime = data.deliveryTime.isEnabledDeliveryTime;

    const handleChange = e => {
        let name = e.target.name;
        if (name == 'deliveryTime') {
            setDeliTime(e.target.value);
        }
        if (name == 'House Security') {
            setHouseSecurityCode(e.target.value);
        }
        if (name == 'Delivery Comment') {
            setDeliveryComment(e.target.value);
        }
    };

    const HouseSecurityCode =
        isHouseSecurityCode == 'true' ? (
            <label className="text-area">
                {formatMessage({ id: 'House Security Code:' })}
                <input
                    type="text"
                    value={houseSecurityCode}
                    onChange={handleChange}
                    name="House Security"
                />
            </label>
        ) : null;

    const DeliveryComment =
        isDeliveryComment == 'true' ? (
            <label className="text-area">
                {formatMessage({ id: 'Delivery Comment:' })}
                <input
                    type="text"
                    value={deliveryComment}
                    onChange={handleChange}
                    name="Delivery Comment"
                />
            </label>
        ) : null;

    const OptionDeliveryTime = isEnabledDeliveryTime
        ? deliveryTime.map((time, index) => {
              return (
                  <option value={time} key={index}>
                      {time}
                  </option>
              );
          })
        : null;

    const filterDate = (date, dateOff) => {
        let d = date.getDate() < '10' ? '0' + date.getDate() : date.getDate();
        let m = '' + parseInt(date.getMonth() + 1);
        let y = date.getFullYear();
        let thisDay = d + '/' + m + '/' + y;

        if (dateOff.includes(thisDay)) {
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

    if (isEnabledDeliveryTime && OptionDeliveryTime) {
        return (
            <div className="deliveryTime-main">
                <div className="header">
                    {formatMessage({
                        id: 'Delivery time',
                        defaultMessage: 'Delivery Time'
                    })}
                </div>
                <DatePicker
                    selected={startDate}
                    onChange={date => setDate(date)}
                    minDate={new Date()}
                    filterDate={date =>
                        filterDaysOff(date.getDay().toString(), daysOff) &&
                        filterDate(date, dateOff)
                    }
                />
                <select
                    onChange={handleChange}
                    value={deliTime}
                    name="deliveryTime"
                    id="deliveryTime"
                    placeholder="Please"
                >
                    <option>Select time</option>
                    {OptionDeliveryTime}
                </select>
                {HouseSecurityCode}
                {DeliveryComment}
                {mutationLoading ? (
                    <ButtonLoader classes={'btn-updateTime'} />
                ) : (
                    <button className="btn-updateTime" onClick={handleSubmit}>
                        {formatMessage({
                            id: 'Update delivery time',
                            defaultMessage: 'Update Delivery Time'
                        })}
                    </button>
                )}
            </div>
        );
    }
    return '';
});

export default DeliveryDateTime;
