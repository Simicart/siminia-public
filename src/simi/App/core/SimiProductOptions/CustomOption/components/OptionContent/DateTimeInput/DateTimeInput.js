import React, {useEffect, useState, memo, forwardRef} from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {useBaseInput} from "../../../utils/useBaseInput";
import './DateTimeInput.css'
import {configColor} from "src/simi/Config";


const ExampleCustomInput = forwardRef(({value, onClick}, ref) => {
    const styles = {
        backgroundColor: configColor.button_background,
        color: configColor.button_text_color
    }
    return (
        <button className="button-custom-date"
                onClick={onClick} ref={ref}
                style={styles}
        >
            {value}
        </button>
    )
});

export const _DateTimeInput = (props) => {
    const {item, handleSelected, fieldName} = useBaseInput(props)

    const [startDate, setStartDate] = useState(new Date());

    const handleChange = (date) => {
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const sec = date.getSeconds()
        const str = `${year}-${month}-${day} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
        setStartDate(date)
        handleSelected(str)
    }

    useEffect(() => {
        handleChange(new Date(Date.now()))
    }, [])


    return (
        <DatePicker selected={startDate}
                    onChange={handleChange}
                    showTimeSelect
                    dateFormat="yyyy-mm-dd HH:ii:ss"
                    className="datetime-input-magic"
                    customInput={<ExampleCustomInput/>}
        />
    );
};

export const DateTimeInput = memo(_DateTimeInput)
