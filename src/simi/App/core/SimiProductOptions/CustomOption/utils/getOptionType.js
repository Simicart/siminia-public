export const getOptionType = (item) => {
    let itemType = ''
    let prLabel = {};

    if (item['checkbox_value']) {
        itemType = 'checkbox';
    } else if (item['dropdown_value']) {
        itemType = 'drop_down';
    } else if (item['multiple_value']) {
        itemType = 'multiple';
    } else if (item['radio_value']) {
        itemType = 'radio';
    } else if (item['date_value']) {
        itemType = 'date_time';
        prLabel = item.date_value;
    } else if (item['field_value']) {
        itemType = 'field';
        prLabel = item.field_value;
    } else if (item['area_value']) {
        itemType = 'area';
        prLabel = item.area_value;
    } else if (item['file_value']) {
        itemType = 'file';
        prLabel = item.file_value;
    }
    // else
    //     if (type === 'date') {
    //        return <div style={{ marginTop: -10 }}>
    //            <DatePicker id={id} parent={this} />
    //        </div>
    //    }
    //    if (type === 'time') {
    //        return <div style={{ marginTop: -10 }}>
    //            <TimePicker id={id} parent={this} />
    //        </div>
    //    }

    return {
        itemType,
        prLabel
    }
}
